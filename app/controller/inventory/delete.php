<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// include database and object file
include '../../config/database.php';
include '../../model/inventory.php';

// get database connection
$database = new Database();
$db = $database->getConnection();

// prepare inventory object
$inventory = new inventory($db);

// get inventory id
$data = json_decode(file_get_contents("php://input"), true);

// set inventory id to be deleted
$inventory->id = $data["id"];

// delete the inventory
if($inventory->delete()) {
    echo json_encode(
        array("message" => "Inventory has been deleted")
    );
} // if unable to delete the inventory
else {
    echo json_encode(
        array("message" => "Unable to  delete Inventory.")
    );
}
?>