<?php
/**
 * =================================================================
 * api/facturas.php
 * =================================================================
 * Este script maneja toda la lógica de negocio relacionada con las
 * facturas para la API del sistema de inventario.
 *
 * Funcionalidades:
 * - GET: Obtener una factura por su ID o un listado de facturas
 * con filtros y paginación.
 * - POST: Crear una nueva factura, sus ítems asociados y generar
 * los movimientos de inventario correspondientes.
 * - PUT: Anular una factura existente, revirtiendo los movimientos
 * de inventario asociados.
 *
 * Todos los endpoints están protegidos y requieren una sesión activa.
 * Ciertas acciones (crear, anular) requieren permisos de Administrador.
 */

require_once 'session_check.php'; 
require_once 'db_connection.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit; }
header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];
$response = ['success' => false, 'message' => 'Método no válido o error.', 'data' => null];

try {
    switch ($method) {
        
        case 'GET':
            if (isset($_GET['id']) && filter_var($_GET['id'], FILTER_VALIDATE_INT)) {
                
                $facturaId = (int)$_GET['id'];
                
                // MODIFICADO: Añadido f.fecha_registro y c.direccion
                $sqlFactura = "SELECT f.id, f.fecha, f.fecha_registro,
                                      f.cliente_id, c.nombre_razon_social as cliente_nombre, c.direccion as cliente_direccion, 
                                      f.total, f.condicion_pago, f.fecha_vencimiento, f.saldo_pendiente, f.estado_pago,
                                      f.anulada, f.fecha_anulacion, f.motivo_anulacion, u_anul.username as usuario_anulacion_nombre
                               FROM facturas f
                               LEFT JOIN clientes c ON f.cliente_id = c.id
                               LEFT JOIN usuarios u_anul ON f.usuario_anulacion_id = u_anul.id
                               WHERE f.id = ?";
                $stmtFactura = $pdo->prepare($sqlFactura);
                $stmtFactura->execute([$facturaId]);
                $factura = $stmtFactura->fetch(PDO::FETCH_ASSOC);

                if (!$factura) { 
                    http_response_code(404); 
                    $response['message'] = 'Factura no encontrada.'; 
                    break; 
                }

                $sqlItems = "SELECT fi.id, fi.producto_id, fi.cantidad, fi.precio_venta, fi.subtotal,
                                    p.codigo as producto_codigo, p.descripcion as producto_descripcion, p.medida as producto_medida
                             FROM factura_items fi
                             JOIN productos p ON fi.producto_id = p.id
                             WHERE fi.factura_id = ?";
                $stmtItems = $pdo->prepare($sqlItems);
                $stmtItems->execute([$facturaId]);
                $items = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

                $factura['items'] = $items;
                $response = ['success' => true, 'message' => 'Factura obtenida.', 'data' => $factura];

            } else {
                $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
                $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 25;
                $filtro_texto = isset($_GET['filtro_texto']) ? trim($_GET['filtro_texto']) : null;
                $filtro_fecha_inicio = isset($_GET['filtro_fecha_inicio']) ? $_GET['filtro_fecha_inicio'] : null;
                $filtro_fecha_fin = isset($_GET['filtro_fecha_fin']) ? $_GET['filtro_fecha_fin'] : null;
                $ver_anuladas = isset($_GET['ver_anuladas']) && $_GET['ver_anuladas'] === '1';
                $filtro_estado_pago = isset($_GET['filtro_estado_pago']) ? $_GET['filtro_estado_pago'] : null;

                $params_for_where_clause = [];
                $whereConditions = [];

                if (!$ver_anuladas) {
                    $whereConditions[] = "f.anulada = 0";
                }

                if ($filtro_texto) {
                    $whereConditions[] = "(CAST(f.id AS CHAR) LIKE :filtro_texto_val OR c.nombre_razon_social LIKE :filtro_texto_val)";
                    $params_for_where_clause[':filtro_texto_val'] = "%".$filtro_texto."%";
                }
                if ($filtro_fecha_inicio) {
                    $whereConditions[] = "f.fecha >= :filtro_fecha_inicio_val";
                    $params_for_where_clause[':filtro_fecha_inicio_val'] = $filtro_fecha_inicio;
                }
                if ($filtro_fecha_fin) {
                    $whereConditions[] = "f.fecha <= :filtro_fecha_fin_val";
                    $params_for_where_clause[':filtro_fecha_fin_val'] = $filtro_fecha_fin;
                }

                if ($filtro_estado_pago) {
                    switch ($filtro_estado_pago) {
                        case 'pagada':
                            $whereConditions[] = "f.estado_pago = 'pagada'";
                            break;
                        case 'pendiente':
                            $whereConditions[] = "f.estado_pago IN ('pendiente', 'parcialmente_pagada')";
                            break;
                        case 'contado':
                            $whereConditions[] = "f.condicion_pago = 'contado'";
                            break;
                    }
                }

                $whereSql = count($whereConditions) > 0 ? "WHERE " . implode(" AND ", $whereConditions) : "";
                
                $sqlCount = "SELECT COUNT(f.id) FROM facturas f LEFT JOIN clientes c ON f.cliente_id = c.id $whereSql";
                $stmtCount = $pdo->prepare($sqlCount);
                $stmtCount->execute($params_for_where_clause);
                $totalRecords = (int)$stmtCount->fetchColumn();

                $totalPages = ($limit > 0) ? ceil($totalRecords / $limit) : 0;
                $page = max(1, min($page, $totalPages > 0 ? $totalPages : 1));
                $offset = ($page - 1) * $limit;

                $sqlData = "SELECT f.id, f.fecha, f.cliente_id, c.nombre_razon_social as cliente_nombre, f.total,
                                   f.condicion_pago, f.fecha_vencimiento, f.saldo_pendiente, f.estado_pago, f.anulada
                            FROM facturas f
                            LEFT JOIN clientes c ON f.cliente_id = c.id
                            $whereSql
                            ORDER BY f.anulada ASC, f.fecha DESC, f.id DESC 
                            LIMIT :limit_val OFFSET :offset_val";
                
                $stmtData = $pdo->prepare($sqlData);
                foreach ($params_for_where_clause as $key => $value) {
                    $stmtData->bindValue($key, $value);
                }
                $stmtData->bindValue(':limit_val', (int)$limit, PDO::PARAM_INT);
                $stmtData->bindValue(':offset_val', (int)$offset, PDO::PARAM_INT);
                $stmtData->execute();
                $facturas = $stmtData->fetchAll(PDO::FETCH_ASSOC);

                $response = [
                    'success' => true, 'message' => 'Listado de facturas obtenido.', 'data' => $facturas,
                    'pagination' => ['currentPage' => $page, 'limit' => $limit, 'totalRecords' => $totalRecords, 'totalPages' => $totalPages]
                ];
            }
            break;

        case 'POST':
            if (!isset($currentUser['role']) || $currentUser['role'] !== 'Administrador') { 
                http_response_code(403); 
                $response['message'] = 'Acceso prohibido. Permiso insuficiente para crear facturas.'; 
                break;
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            if (!isset($input['fecha'], $input['clienteId'], $input['items'], $input['condicion_pago']) || 
                !DateTime::createFromFormat('Y-m-d', $input['fecha']) || !filter_var($input['clienteId'], FILTER_VALIDATE_INT) || 
                !is_array($input['items']) || empty($input['items']) || !in_array($input['condicion_pago'], ['contado', 'credito'])) {
                http_response_code(400); 
                $response['message'] = 'Datos de factura incompletos o inválidos.'; 
                break;
            }
            
            $pdo->beginTransaction();
            try {
                $totalFacturaCalculado = 0; 
                $itemsValidos = [];
                $items = $input['items']; // Definir $items aquí
                
                foreach ($items as $item) { 
                    if (!isset($item['productoId'], $item['cantidad'], $item['precio']) || !filter_var($item['productoId'], FILTER_VALIDATE_INT) || !is_numeric($item['cantidad']) || $item['cantidad'] <= 0 || !is_numeric($item['precio']) || $item['precio'] < 0) {
                         http_response_code(400); $response['message'] = 'Item inválido en la factura.'; $pdo->rollBack(); break 2;
                    }
                    $subtotal = (float)$item['cantidad'] * (float)$item['precio'];
                    $totalFacturaCalculado += $subtotal;
                    $itemsValidos[] = [ 'productoId' => (int)$item['productoId'], 'cantidad' => (float)$item['cantidad'], 'precio_venta' => (float)$item['precio'], 'subtotal' => $subtotal ];
                }
                
                $clienteId = (int)$input['clienteId'];
                $stmtCheckCliente = $pdo->prepare("SELECT nombre_razon_social FROM clientes WHERE id = ? AND activo = 1");
                $stmtCheckCliente->execute([$clienteId]);
                $clienteData = $stmtCheckCliente->fetch();
                if (!$clienteData) { http_response_code(404); $response['message'] = 'Cliente no encontrado o inactivo.'; break; }
                $nombreClienteFactura = $clienteData['nombre_razon_social'];


                $condicionPago = $input['condicion_pago'];
                $fechaVencimiento = null;
                $estadoPago = 'pagada';
                $saldoPendiente = 0.00;

                if ($condicionPago === 'credito') {
                    if (empty($input['fecha_vencimiento']) || !DateTime::createFromFormat('Y-m-d', $input['fecha_vencimiento'])) {
                        http_response_code(400); 
                        $response['message'] = 'Fecha de vencimiento inválida o no proporcionada para factura a crédito.'; 
                        break;
                    }
                    $fechaFacturaObj = new DateTime($input['fecha']);
                    $fechaVencimientoObj = new DateTime($input['fecha_vencimiento']);
                    if ($fechaVencimientoObj < $fechaFacturaObj) {
                        http_response_code(400);
                        $response['message'] = 'La fecha de vencimiento no puede ser anterior a la fecha de la factura.';
                        break;
                    }
                    $fechaVencimiento = $input['fecha_vencimiento'];
                    $estadoPago = 'pendiente';
                    $saldoPendiente = $totalFacturaCalculado;
                }

                $sqlFactura = "INSERT INTO facturas (fecha, cliente_id, total, condicion_pago, fecha_vencimiento, saldo_pendiente, estado_pago) 
                               VALUES (?, ?, ?, ?, ?, ?, ?)";
                $stmtFactura = $pdo->prepare($sqlFactura);
                $stmtFactura->execute([$input['fecha'], $clienteId, $totalFacturaCalculado, $condicionPago, $fechaVencimiento, $saldoPendiente, $estadoPago]);
                $newFacturaId = $pdo->lastInsertId();

                $sqlItem = "INSERT INTO factura_items (factura_id, producto_id, cantidad, precio_venta, subtotal) VALUES (?, ?, ?, ?, ?)";
                $stmtItem = $pdo->prepare($sqlItem);
                $sqlMovimiento = "INSERT INTO movimientos (producto_id, tipo, cantidad, fecha, cliente, factura_id) VALUES (?, 'salida', ?, ?, ?, ?)";
                $stmtMovimiento = $pdo->prepare($sqlMovimiento);

                foreach ($itemsValidos as $itemValidado) {
                    $stmtItem->execute([ $newFacturaId, $itemValidado['productoId'], $itemValidado['cantidad'], $itemValidado['precio_venta'], $itemValidado['subtotal'] ]);
                    $stmtMovimiento->execute([ $itemValidado['productoId'], $itemValidado['cantidad'], $input['fecha'], $nombreClienteFactura, $newFacturaId ]);
                }
                
                $pdo->commit();
                $response = ['success' => true, 'message' => "Factura ID {$newFacturaId} creada exitosamente.", 'data' => ['id' => (int)$newFacturaId]];

            } catch (Exception $e) {
                 $pdo->rollBack(); 
                 http_response_code(500); 
                 error_log("Error en Transacción POST Factura: " . $e->getMessage());
                 $response['message'] = 'Error al procesar la factura: ' . $e->getMessage();
            }
            break;

        case 'PUT':
            if (!isset($currentUser['role']) || $currentUser['role'] !== 'Administrador') {
                http_response_code(403); $response['message'] = 'Acceso prohibido para anular facturas.'; break;
            }
            if (!isset($_GET['id']) || !filter_var($_GET['id'], FILTER_VALIDATE_INT)) {
                http_response_code(400); $response['message'] = 'ID de factura inválido para anular.'; break;
            }
            $facturaIdAnular = (int)$_GET['id'];
            
            $input = json_decode(file_get_contents('php://input'), true);
            $motivoAnulacion = isset($input['motivo_anulacion']) ? trim($input['motivo_anulacion']) : null;
            if (empty($motivoAnulacion)) {
                http_response_code(400); $response['message'] = 'Se requiere un motivo para la anulación.'; break;
            }

            $pdo->beginTransaction();
            try {
                $stmtCheck = $pdo->prepare("SELECT anulada FROM facturas WHERE id = ?");
                $stmtCheck->execute([$facturaIdAnular]);
                $facturaActual = $stmtCheck->fetch();

                if (!$facturaActual) {
                    $pdo->rollBack(); http_response_code(404); $response['message'] = 'Factura no encontrada.'; break;
                }
                if ($facturaActual['anulada']) {
                    $pdo->rollBack(); http_response_code(409); $response['message'] = 'Esta factura ya ha sido anulada previamente.'; break;
                }

                $sqlAnularFactura = "UPDATE facturas SET anulada = 1, fecha_anulacion = NOW(), motivo_anulacion = ?, usuario_anulacion_id = ?, estado_pago = 'anulada', saldo_pendiente = 0 WHERE id = ?";
                $stmtAnular = $pdo->prepare($sqlAnularFactura);
                $stmtAnular->execute([$motivoAnulacion, $currentUser['id'], $facturaIdAnular]);

                $sqlDelMov = "DELETE FROM movimientos WHERE factura_id = ?";
                $stmtDelMov = $pdo->prepare($sqlDelMov);
                $stmtDelMov->execute([$facturaIdAnular]);
                
                $pdo->commit();
                $response = ['success' => true, 'message' => "Factura ID {$facturaIdAnular} anulada correctamente."];
            } catch (Exception $e) {
                 $pdo->rollBack(); 
                 http_response_code(500);
                 error_log("Error en Transacción PUT Anular Factura: " . $e->getMessage());
                 $response['message'] = 'Error al anular la factura: ' . $e->getMessage();
            }
            break; 

        default:
            http_response_code(405); 
            $response['message'] = 'Método no permitido.'; 
            break;
    }
} catch (PDOException $e) {
    http_response_code(500); 
    error_log('Error de BD (PDOException en Facturas): ' . $e->getMessage());
    $response = ['success' => false, 'message' => 'Error de base de datos. Consulte el log del servidor.'];
} catch (Exception $e) {
    http_response_code(500); 
    error_log('Error General (Exception en Facturas): ' . $e->getMessage());
    $response = ['success' => false, 'message' => 'Error general del servidor. Consulte el log.'];
}

echo json_encode($response);
?>
