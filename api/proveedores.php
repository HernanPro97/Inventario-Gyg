<?php
// --- api/proveedores.php ---
require_once 'session_check.php';
require_once 'db_connection.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit; }
header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];
$response = ['success' => false, 'message' => 'Error desconocido.', 'data' => null];

try {
    switch ($method) {
        case 'GET':
            if (isset($_GET['id']) && filter_var($_GET['id'], FILTER_VALIDATE_INT)) {
                $proveedorId = (int)$_GET['id'];
                $sql = "SELECT id, codigo_proveedor_alfanumerico, nombre_razon_social, identificacion_fiscal, direccion, telefono, email, activo FROM proveedores WHERE id = :proveedor_id";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([':proveedor_id' => $proveedorId]);
                $proveedor = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($proveedor) {
                    $proveedor['id'] = (int)$proveedor['id'];
                    $proveedor['activo'] = (bool)$proveedor['activo'];
                    $response = ['success' => true, 'data' => $proveedor];
                } else {
                    http_response_code(404);
                    $response['message'] = 'Proveedor no encontrado.';
                }
            } else {
                $soloActivos = isset($_GET['activo']) && $_GET['activo'] === '1';
                $sql = "SELECT id, codigo_proveedor_alfanumerico, nombre_razon_social, identificacion_fiscal, telefono, email, activo FROM proveedores";
                if ($soloActivos) {
                    $sql .= " WHERE activo = 1";
                }
                $sql .= " ORDER BY nombre_razon_social ASC";
                
                $stmt = $pdo->query($sql);
                $proveedores = $stmt->fetchAll(PDO::FETCH_ASSOC);
                 foreach($proveedores as &$prov) {
                    $prov['id'] = (int)$prov['id'];
                    $prov['activo'] = (bool)$prov['activo'];
                 }
                 unset($prov);
                $response = ['success' => true, 'data' => $proveedores];
            }
            break;

        case 'POST':
            if ($currentUser['role'] !== 'Administrador') {
                http_response_code(403); $response['message'] = 'Acceso prohibido.'; break;
            }
            $input = json_decode(file_get_contents('php://input'), true);

            if (!isset($input['nombre_razon_social']) || empty(trim($input['nombre_razon_social']))) {
                http_response_code(400); $response['message'] = 'El nombre o razón social es obligatorio.'; break;
            }
            
            $sql = "INSERT INTO proveedores (codigo_proveedor_alfanumerico, nombre_razon_social, identificacion_fiscal, direccion, telefono, email, activo) 
                    VALUES (:codigo_proveedor, :nombre_razon_social, :identificacion_fiscal, :direccion, :telefono, :email, :activo)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':codigo_proveedor' => isset($input['codigo_proveedor_alfanumerico']) && !empty(trim($input['codigo_proveedor_alfanumerico'])) ? trim($input['codigo_proveedor_alfanumerico']) : null,
                ':nombre_razon_social' => trim($input['nombre_razon_social']),
                ':identificacion_fiscal' => isset($input['identificacion_fiscal']) ? trim($input['identificacion_fiscal']) : null,
                ':direccion' => isset($input['direccion']) ? trim($input['direccion']) : null,
                ':telefono' => isset($input['telefono']) ? trim($input['telefono']) : null,
                ':email' => isset($input['email']) ? trim($input['email']) : null,
                ':activo' => isset($input['activo']) ? (bool)$input['activo'] : true
            ]);
            $newId = $pdo->lastInsertId(); 
            $response = ['success' => true, 'message' => 'Proveedor creado (ID: '.$newId.').', 'data' => ['id' => (int)$newId]];
            break;

        case 'PUT':
            if ($currentUser['role'] !== 'Administrador') {
                http_response_code(403); $response['message'] = 'Acceso prohibido.'; break;
            }
            if (!isset($_GET['id']) || !filter_var($_GET['id'], FILTER_VALIDATE_INT)) {
                http_response_code(400); $response['message'] = 'ID de proveedor inválido.'; break;
            }
            $proveedorIdToUpdate = (int)$_GET['id'];
            $input = json_decode(file_get_contents('php://input'), true);

            if (!isset($input['nombre_razon_social']) || empty(trim($input['nombre_razon_social']))) {
                http_response_code(400); $response['message'] = 'El nombre es obligatorio.'; break;
            }

            $sql = "UPDATE proveedores SET 
                        codigo_proveedor_alfanumerico = :codigo_proveedor, 
                        nombre_razon_social = :nombre_razon_social, 
                        identificacion_fiscal = :identificacion_fiscal, 
                        direccion = :direccion, 
                        telefono = :telefono, 
                        email = :email,
                        activo = :activo
                    WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $updateSuccess = $stmt->execute([
                ':codigo_proveedor' => isset($input['codigo_proveedor_alfanumerico']) && !empty(trim($input['codigo_proveedor_alfanumerico'])) ? trim($input['codigo_proveedor_alfanumerico']) : null,
                ':nombre_razon_social' => trim($input['nombre_razon_social']),
                ':identificacion_fiscal' => isset($input['identificacion_fiscal']) ? trim($input['identificacion_fiscal']) : null,
                ':direccion' => isset($input['direccion']) ? trim($input['direccion']) : null,
                ':telefono' => isset($input['telefono']) ? trim($input['telefono']) : null,
                ':email' => isset($input['email']) ? trim($input['email']) : null,
                ':activo' => isset($input['activo']) ? (bool)$input['activo'] : true,
                ':id' => $proveedorIdToUpdate
            ]);

            if ($updateSuccess && $stmt->rowCount() > 0) {
                $response = ['success' => true, 'message' => 'Proveedor actualizado.'];
            } elseif ($updateSuccess && $stmt->rowCount() === 0) {
                $response = ['success' => true, 'message' => 'No se realizaron cambios (datos iguales o proveedor no encontrado).'];
            } else { 
                http_response_code(500); $response['message'] = 'Error al actualizar el proveedor.';
            }
            break;

        case 'DELETE': 
            if ($currentUser['role'] !== 'Administrador') {
                http_response_code(403); $response['message'] = 'Acceso prohibido.'; break;
            }
            if (!isset($_GET['id']) || !filter_var($_GET['id'], FILTER_VALIDATE_INT)) {
                http_response_code(400); $response['message'] = 'ID de proveedor inválido.'; break;
            }
            $proveedorIdToToggle = (int)$_GET['id'];

            $stmtCheck = $pdo->prepare("SELECT activo FROM proveedores WHERE id = ?");
            $stmtCheck->execute([$proveedorIdToToggle]);
            $currentStatus = $stmtCheck->fetchColumn();

            if ($currentStatus === false) { 
                http_response_code(404); $response['message'] = 'Proveedor no encontrado.'; break;
            }
            
            $newStatus = ($currentStatus == 1) ? 0 : 1; 
            $actionText = ($newStatus == 1) ? 'activado' : 'desactivado';

            $sql = "UPDATE proveedores SET activo = ? WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $toggleSuccess = $stmt->execute([$newStatus, $proveedorIdToToggle]);

            if ($toggleSuccess && $stmt->rowCount() > 0) {
                $response = ['success' => true, 'message' => "Proveedor {$actionText}."];
            } else {
                http_response_code(500); $response['message'] = "Error al {$actionText} el proveedor.";
            }
            break;

        default:
            http_response_code(405); $response['message'] = "Método {$method} no permitido."; break;
    }
} catch (PDOException $e) {
    http_response_code(500); 
    $errorMessage = 'Error de BD (Proveedores).';
    if ($e->getCode() == '23000') { 
        if (strpos(strtolower($e->getMessage()), 'uq_nombre_razon_social_proveedor') !== false) {
            http_response_code(409); 
            $errorMessage = 'Error: Ya existe un proveedor con ese nombre o razón social.';
        } elseif (strpos(strtolower($e->getMessage()), 'uq_codigo_proveedor') !== false) { 
             http_response_code(409);
             $errorMessage = 'Error: El código alfanumérico de proveedor proporcionado ya existe.';
        } else {
            http_response_code(409);
            $errorMessage = 'Error: Valor duplicado. Verifique los datos.';
        }
    }
    error_log("PDOException (Proveedores) [{$e->getCode()}]: " . $e->getMessage());
    $response['message'] = $errorMessage;
} catch (Exception $e) {
    http_response_code(500);
    error_log("Exception (Proveedores): " . $e->getMessage());
    $response['message'] = 'Error general del servidor (Proveedores).';
}

echo json_encode($response);
?>