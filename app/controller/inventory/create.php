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
if(isset($data["serial_number"])) {
    $inventory->serial_number = $data["serial_number"];
    $inventory->hcs_number = $data["hcs_number"];
    $inventory->purchase_date = $data["purchase_date"];
    $inventory->status = $data["status"];
    $inventory->notes = $data["notes"];
    $inventory->terminal = $data["terminal"];
    $inventory->device = $data["device"];
} else {
    die();
}

// create the inventory
if($inventory->create() === "duplicate") {
    $error_arr["error"] = array("errorcode" => 502,"message" => "Inventory Serial Number already exists.");
    echo json_encode($error_arr["error"]);
} elseif ($inventory->create()) {
    echo json_encode(
        array("message" => "Success: Inventory added."));
}// if unable to added the inventory, tell the user
else {
    $error_arr["error"] = array("errorcode" => $data,"message" => "Unable to add the inventory.");
    echo json_encode($error_arr["error"]);
}
?>