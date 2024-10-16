<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'config.php';

header('Content-Type: application/json');

$id = $_POST['id'] ?? '';
if (empty($id)) {
    echo json_encode(['success' => false, 'message' => 'Student ID is required']);
    exit;
}

$updateFields = ['name', 'department', 'year', 'feesTotal', 'feesPaid', 'fine', 'busStop', 'permissionGranted', 'busName'];
$updateData = [];
$params = [];

foreach ($updateFields as $field) {
    if (isset($_POST[$field])) {
        $updateData[] = "$field = ?";
        $params[] = $_POST[$field];
    }
}

if (empty($updateData)) {
    echo json_encode(['success' => false, 'message' => 'No fields to update']);
    exit;
}

$params[] = $id;
$sql = "UPDATE students SET " . implode(', ', $updateData) . " WHERE id = ?";
$stmt = $pdo->prepare($sql);
$result = $stmt->execute($params);

if ($result) {
    echo json_encode(['success' => true, 'message' => 'Student updated successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update student']);
}