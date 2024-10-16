<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'config.php';

header('Content-Type: application/json');

$name = $_POST['name'] ?? '';

if (empty($name)) {
    echo json_encode(['success' => false, 'message' => 'Bus name is required']);
    exit;
}

$stmt = $pdo->prepare('INSERT INTO buses (name) VALUES (?)');
$result = $stmt->execute([$name]);

if ($result) {
    echo json_encode(['success' => true, 'message' => 'Bus added successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to add bus']);
}