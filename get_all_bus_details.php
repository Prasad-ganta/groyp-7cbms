<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'config.php';

header('Content-Type: application/json');

$stmt = $pdo->query('SELECT * FROM buses');
$buses = $stmt->fetchAll();

$result = [];
foreach ($buses as $bus) {
    $stmt = $pdo->prepare('SELECT * FROM students WHERE busName = ?');
    $stmt->execute([$bus['name']]);
    $students = $stmt->fetchAll();
    
    $result[] = [
        'name' => $bus['name'],
        'students' => $students
    ];
}

echo json_encode($result);