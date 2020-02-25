<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// include database and object files
include '../../config/database.php';
include '../../model/inventory.php';

// get database connection
$database = new Database();
$db = $database->getConnection();

// prepare inventory object
$inventory = new Inventory($db);

$data = json_decode(file_get_contents("php://input"), true);

// set inventory property values
$inventory->id = $data["id"];;
$inventory->serial_number = $data["serial_number"];
$inventory->hcs_number = $data["hcs_number"];
$inventory->purchase_date = $data["purchase_date"];
$inventory->status = $data["status"];
$inventory->notes = $data["notes"];
$inventory->terminal = $data["terminal"];
$inventory->device = $data["device"];

// update the inventory
if($inventory->update() === "duplicate") {
    $error_arr["error"] = array("errorcode" => 502,"message" => "Inventory Serial Number already exists.");
    echo json_encode($error_arr["error"]);
} elseif ($inventory->update()) {
    echo json_encode(
        array("message" => "Success: Inventory updated."));
}// if unable to updated the inventory, tell the user
else {
    $error_arr["error"] = array("errorcode" => 500 ,"message" => "Unable to update the inventory.");
    echo json_encode($error_arr["error"]);
}
?>