<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'config.php';

header('Content-Type: application/json');

$currentPassword = $_POST['currentPassword'] ?? '';
$newPassword = $_POST['newPassword'] ?? '';
$adminPassword = 'admin123'; // This should be stored securely, not in the code

if ($currentPassword === $adminPassword) {
    // In a real application, you would update the password in a secure storage
    // For this example, we'll just pretend it's updated
    echo json_encode(['success' => true, 'message' => 'Password changed successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Current password is incorrect']);
}