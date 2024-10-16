<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$requiredFields = ['id', 'name', 'department', 'year', 'feesTotal', 'feesPaid', 'busName'];
$studentData = [];

foreach ($requiredFields as $field) {
    if (!isset($_POST[$field]) || empty($_POST[$field])) {
        echo json_encode(['success' => false, 'message' => "$field is required"]);
        exit;
    }
    $studentData[$field] = $_POST[$field];
}

$studentData['fine'] = isset($_POST['fine']) ? $_POST['fine'] : 0;
$studentData['busStop'] = isset($_POST['busStop']) ? $_POST['busStop'] : null;
$studentData['permissionGranted'] = ($studentData['feesPaid'] >= $studentData['feesTotal']) ? 1 : 0;

try {
    $stmt = $pdo->prepare('INSERT INTO students (id, name, department, year, feesTotal, feesPaid, fine, busStop, busName, permissionGranted) 
                           VALUES (:id, :name, :department, :year, :feesTotal, :feesPaid, :fine, :busStop, :busName, :permissionGranted)');
    
    $result = $stmt->execute($studentData);

    if ($result) {
        echo json_encode(['success' => true, 'message' => 'Student added successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add student']);
    }
} catch (PDOException $e) {
    if ($e->getCode() == '23000') {
        echo json_encode(['success' => false, 'message' => 'A student with this ID already exists']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
}