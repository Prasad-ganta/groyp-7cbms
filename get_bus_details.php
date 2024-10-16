<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'config.php';

header('Content-Type: application/json');

$busName = $_GET['name'] ?? '';

if (empty($busName)) {
    echo json_encode(['success' => false, 'message' => 'Bus name is required']);
    exit;
}

$stmt = $pdo->prepare('SELECT * FROM students WHERE busName = ?');
$stmt->execute([$busName]);
$students = $stmt->fetchAll();

echo json_encode($students);