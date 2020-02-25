<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
header("Access-Control-Allow-Headers: Content-Type");

// include database and object files
include '../../config/database.php';
include '../../model/supplier.php';

// instantiate database
$database = new Database();
$db = $database->getConnection();

// initialize object
$supplier = new Supplier($db);

// set ID property of supplier to be edited
$supplier ->id = isset($_GET['id']) && isset($_GET['sessiontoken']) ? $_GET['id'] : die();

// read the details of supplier to be edited
$supplier ->readOne();

if ($supplier->id) {
    $supplier_arr = array(
        "id" => $supplier->id,
        "name" => $supplier->name,
        "address" => $supplier->address,
        "contact" => $supplier->contact,
        "email" => $supplier->email,
        "description" => html_entity_decode($supplier->description)
    );
    // make it json format
    echo json_encode($supplier_arr);
} else {
    $error_arr["error"] = array("errorcode" => 500, "message" => "Supplier data not found.");
    echo json_encode($error_arr);
}
?>