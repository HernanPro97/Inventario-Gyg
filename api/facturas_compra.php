<?php
// --- api/facturas_compra.php ---
require_once 'session_check.php';
require_once 'db_connection.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit; }
header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];
$response = ['success' => false, 'message' => 'Método no válido o error.', 'data' => null];

try {
    switch ($method) {
        case 'POST':
            if ($currentUser['role'] !== 'Administrador') {
                http_response_code(403);
                $response['message'] = 'Acceso prohibido. Permiso insuficiente para registrar compras.';
                break;
            }

            $input = json_decode(file_get_contents('php://input'), true);

            // Validaciones básicas de la factura
            if (!isset($input['proveedorId'], $input['fechaRecepcion'], $input['items']) ||
                !filter_var($input['proveedorId'], FILTER_VALIDATE_INT) ||
                !DateTime::createFromFormat('Y-m-d', $input['fechaRecepcion']) ||
                !is_array($input['items']) || empty($input['items'])) {
                http_response_code(400);
                $response['message'] = 'Datos de factura de compra incompletos o inválidos.';
                break;
            }

            $pdo->beginTransaction();
            try {
                $totalFacturaCalculado = 0;
                $itemsValidos = [];

                // Validar cada ítem
                foreach ($input['items'] as $item) {
                    if (!isset($item['productoId'], $item['cantidad'], $item['costo']) ||
                        !filter_var($item['productoId'], FILTER_VALIDATE_INT) ||
                        !is_numeric($item['cantidad']) || $item['cantidad'] <= 0 ||
                        !is_numeric($item['costo']) || $item['costo'] < 0) {
                         http_response_code(400);
                         $response['message'] = 'Ítem inválido en la factura de compra. Verifique productos, cantidades y costos.';
                         $pdo->rollBack();
                         // Usamos 'break 2' para salir de ambos bucles (foreach y switch)
                         break 2;
                    }
                    $subtotal = (float)$item['cantidad'] * (float)$item['costo'];
                    $totalFacturaCalculado += $subtotal;
                    $itemsValidos[] = [
                        'productoId' => (int)$item['productoId'],
                        'cantidad' => (float)$item['cantidad'],
                        'costo_unitario' => (float)$item['costo'],
                        'subtotal' => $subtotal
                    ];
                }

                // Verificar que el proveedor exista y esté activo
                $proveedorId = (int)$input['proveedorId'];
                $stmtCheckProveedor = $pdo->prepare("SELECT nombre_razon_social FROM proveedores WHERE id = ? AND activo = 1");
                $stmtCheckProveedor->execute([$proveedorId]);
                $proveedorData = $stmtCheckProveedor->fetch();
                if (!$proveedorData) {
                    http_response_code(404);
                    $response['message'] = 'Proveedor no encontrado o inactivo.';
                    $pdo->rollBack();
                    break;
                }
                $nombreProveedorParaMovimiento = $proveedorData['nombre_razon_social'];

                // Insertar la factura de compra
                $sqlFacturaCompra = "INSERT INTO facturas_compra (proveedor_id, numero_factura_proveedor, fecha_emision, fecha_recepcion, total, observaciones, usuario_registro_id)
                                     VALUES (?, ?, ?, ?, ?, ?, ?)";
                $stmtFacturaCompra = $pdo->prepare($sqlFacturaCompra);
                $stmtFacturaCompra->execute([
                    $proveedorId,
                    isset($input['numeroFacturaProveedor']) ? trim($input['numeroFacturaProveedor']) : null,
                    isset($input['fechaEmision']) ? $input['fechaEmision'] : $input['fechaRecepcion'],
                    $input['fechaRecepcion'],
                    $totalFacturaCalculado,
                    isset($input['observaciones']) ? trim($input['observaciones']) : null,
                    $currentUser['id']
                ]);
                $newFacturaCompraId = $pdo->lastInsertId();

                // Preparar inserciones de ítems y movimientos
                $sqlItemCompra = "INSERT INTO facturas_compra_items (factura_compra_id, producto_id, cantidad, costo_unitario, subtotal) VALUES (?, ?, ?, ?, ?)";
                $stmtItemCompra = $pdo->prepare($sqlItemCompra);

                $sqlMovimiento = "INSERT INTO movimientos (producto_id, tipo, cantidad, precio_unitario, fecha, proveedor, factura_id) VALUES (?, 'entrada', ?, ?, ?, ?, NULL)";
                $stmtMovimiento = $pdo->prepare($sqlMovimiento);

                // Insertar ítems y generar movimientos de inventario
                foreach ($itemsValidos as $itemValidado) {
                    // Insertar el ítem en la factura de compra
                    $stmtItemCompra->execute([
                        $newFacturaCompraId,
                        $itemValidado['productoId'],
                        $itemValidado['cantidad'],
                        $itemValidado['costo_unitario'],
                        $itemValidado['subtotal']
                    ]);
                    // Crear el movimiento de 'entrada' correspondiente
                    $stmtMovimiento->execute([
                        $itemValidado['productoId'],
                        $itemValidado['cantidad'],
                        $itemValidado['costo_unitario'],
                        $input['fechaRecepcion'], // La fecha del movimiento es la fecha de recepción
                        $nombreProveedorParaMovimiento
                    ]);
                }

                $pdo->commit();
                $response = [
                    'success' => true,
                    'message' => "Factura de Compra ID {$newFacturaCompraId} registrada exitosamente. El inventario ha sido actualizado.",
                    'data' => ['id' => (int)$newFacturaCompraId]
                ];

            } catch (Exception $e) {
                 $pdo->rollBack();
                 http_response_code(500);
                 error_log("Error en Transacción POST Factura Compra: " . $e->getMessage());
                 $response['message'] = 'Error al procesar la factura de compra: ' . $e->getMessage();
            }
            break;

        default:
            http_response_code(405);
            $response['message'] = 'Método no permitido.';
            break;
    }
} catch (PDOException $e) {
    http_response_code(500);
    error_log('Error de BD (PDOException en Facturas Compra): ' . $e->getMessage());
    $response = ['success' => false, 'message' => 'Error de base de datos. Consulte el log del servidor.'];
} catch (Exception $e) {
    http_response_code(500);
    error_log('Error General (Exception en Facturas Compra): ' . $e->getMessage());
    $response = ['success' => false, 'message' => 'Error general del servidor. Consulte el log.'];
}

echo json_encode($response);
?>