<?php

$NO = $_POST['NO'];
$newQuantity = $_POST['newQuantity'];

if ($NO !== null && $newQuantity !== null) {
    $jsonFilePath = 'cars.json';
    
    $jsonData = file_get_contents($jsonFilePath);
    $carData = json_decode($jsonData, true);
    
    //iterate over the carData array and update the matching car, 
    // &$car => iterate by reference
    // $car => iterate by value
    foreach($carData as &$car) {
        if($car['NO'] === $NO) {
            $car['Quantity'] =(int) $newQuantity;
            break;
        }
    }
    
    file_put_contents($jsonFilePath, json_encode($carData, JSON_PRETTY_PRINT));
    
    echo json_encode(["status" => "success", "message" => "Car quantity updated successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid input data"]);
}