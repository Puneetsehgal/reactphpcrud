<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type");

// include database and object files
include '../../config/database.php';
include '../../model/inventory.php';
include '../../model/terminal.php';
include '../../model/devices.php';

// instantiate database
$database = new Database();
$db = $database->getConnection();

// initialize object
$inventory = new Inventory($db);
$terminal = new Terminal($db);
$device = new Device($db);

$inventory ->id = isset($_GET['id']) && isset($_GET['sessiontoken']) ? $_GET['id'] : die();

$stmt = $inventory->readOne();

$stmtTml = $terminal->read(); // get terminal data
$numTml = $stmtTml->rowCount();

$stmtDev = $device->read(); // get devices data
$numDev = $stmtDev->rowCount();

// check if more than 0 record found
if($numTml>0 && $numDev>0) {
    // inventory array
    $inventory_arr=array();
    $inventory_arr["inventory"]=array();

    $terminal_arr=array();
    $inventory_arr["terminal"]=array();
    
    $device_arr=array();
    $inventory_arr["device"]=array();

    // retrieve our table contents
    while ($row = $stmtTml->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);
        $terminal_item=array(
            "id" => $terminal_id,
            "name" => $terminal_name,
        );
        array_push($terminal_arr, $terminal_item);
    }

    while ($row = $stmtDev->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);
        $device_item=array(
            "id" => $device_id,
            "name" => $device_name,
        );
        array_push($device_arr, $device_item);
    }

    $inventory_item=array(
        "id" => $inventory->id,
        "serial_number" => $inventory->serial_number,
        "hcs_number" => $inventory->hcs_number,
        "purchase_date" => $inventory->purchase_date,
        "status" => $inventory->status ? "Active" : "Not Active",
        "notes" => html_entity_decode($inventory->inventory_notes),
        "terminal_id" => $inventory->terminal_id,
        "terminal_name" => $inventory->terminal_name,
        "device_id" => $inventory->device_id,
        "device_name" => $inventory->device_name,
        "supplier_id" => $inventory->supplier_id,
        "supplier_name" => $inventory->supplier_name,
        "location_id" => $inventory->location_id,
        "location_name" => $inventory->location_name,
        "organization_id" => $inventory->organization_id,
        "organization_name" => $inventory->organization_name
    );

    $inventory_arr["inventory"] = $inventory_item;
    $inventory_arr["terminal"] = $terminal_arr;
    $inventory_arr["device"] = $device_arr;
    
    echo json_encode($inventory_arr);
} else if (!$numTml>0 || !$numDev>0) {
    $error_arr["error"] = array("errorcode" => 502, "message" => "No terminal or device found. Please add terminal or device first to add inventory.");
    echo json_encode($error_arr);
} else {
    $error_arr["error"] = array("errorcode" => 500, "message" => "Inventory data not found.");
    echo json_encode($error_arr);
}
?>