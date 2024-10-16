<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'config.php';

header('Content-Type: application/json');

$password = $_POST['password'] ?? '';
$adminPassword = 'admin123'; // This should be stored securely, not in the code

if ($password === $adminPassword) {
    echo json_encode(['success' => true, 'message' => 'Admin login successful']);
} else {
    echo json_encode(['success' => false, 'message' => 'Incorrect password']);
}
