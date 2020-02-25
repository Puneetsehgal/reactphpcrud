<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
header("Access-Control-Allow-Headers: Content-Type");

// include database and object files
include '../../config/database.php';
include '../../model/devices.php';
include '../../model/supplier.php';

// instantiate database
$database = new Database();
$db = $database->getConnection();

// initialize object
$device = new Device($db);
$supplier = new Supplier($db);

$device ->id = isset($_GET['id']) && isset($_GET['sessiontoken']) ? $_GET['id'] : die();

$device ->readOne();
$stmtSup = $supplier ->read();
$numSup = $stmtSup->rowCount();

// create array
if ($device->id && $numSup>0) {
    $device_arr = array();
    $device_arr["device"] = array();
    $suppliers_arr=array();
    $device_arr["suppliers"]=array();

    while ($row = $stmtSup->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);
        $supplier_item=array(
            "id" => $supplier_id,
            "name" =>$supplier_name,
        );
        array_push($suppliers_arr, $supplier_item);
    }
    $device_item = array(
        "id" => $device->id,
        "name" => $device->name,
        "description" => html_entity_decode($device->description),
        "supplier_name" => ($device->supplier_name),
        "supplier_id" => ($device->supplier_id)
    );

    $device_arr["device"] =  $device_item;
    $device_arr["suppliers"] = $suppliers_arr;
    // make it json format
    echo json_encode($device_arr);
} else if (!$numSup>0) {
    $error_arr["error"] = array("errorcode" => 502, "message" => "No Supplier found the devices.");
    echo json_encode($error_arr);
} else {
    $error_arr["error"] = array("errorcode" => 500, "message" => "Device data not found.");
    echo json_encode($error_arr);
}
?>