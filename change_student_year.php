<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'config.php';

header('Content-Type: application/json');

$id = $_POST['id'] ?? '';
$year = $_POST['year'] ?? '';

if (empty($id) || empty($year)) {
    echo json_encode(['success' => false, 'message' => 'Student ID and new year are required']);
    exit;
}

$stmt = $pdo->prepare('UPDATE students SET year = ? WHERE id = ?');
$result = $stmt->execute([$year, $id]);

if ($result) {
    echo json_encode(['success' => true, 'message' => "Year updated for student $id"]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update student year']);
}