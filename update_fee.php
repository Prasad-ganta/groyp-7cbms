<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'config.php';

header('Content-Type: application/json');

$input = $_POST['input'] ?? '';
$amount = floatval($_POST['amount'] ?? 0);

if (empty($input) || $amount <= 0) {
    echo json_encode(['success' => false, 'message' =>  'Invalid input or amount']);
    exit;
}

$stmt = $pdo->prepare('UPDATE students SET feesPaid = feesPaid + ?, permissionGranted = CASE WHEN feesPaid + ? >= feesTotal THEN 1 ELSE 0 END WHERE id = ? OR department = ?');
$result = $stmt->execute([$amount, $amount, $input, $input]);

if ($result) {
    $count = $stmt->rowCount();
    echo json_encode(['success' => true, 'message' => "Fees updated for $count student(s)"]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update fees']);
}