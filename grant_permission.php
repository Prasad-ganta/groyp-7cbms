<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'config.php';

header('Content-Type: application/json');

$input = $_POST['input'] ?? '';

if (empty($input)) {
    echo json_encode(['success' => false, 'message' => 'Input is required']);
    exit;
}

$stmt = $pdo->prepare('UPDATE students SET permissionGranted = 1 WHERE id = ? OR department = ?');
$result = $stmt->execute([$input, $input]);

if ($result) {
    $count = $stmt->rowCount();
    echo json_encode(['success' => true, 'message' => "Permission granted for $count student(s)"]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to grant permission']);
}