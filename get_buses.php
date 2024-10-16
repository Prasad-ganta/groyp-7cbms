<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'config.php';

header('Content-Type: application/json');

$stmt = $pdo->query('SELECT * FROM students');
$students = $stmt->fetchAll();

echo json_encode($students);