<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type");

// include database and object files
include '../../config/database.php';
include '../../model/devices.php';

// instantiate database
$database = new Database();
$db = $database->getConnection();

if (isset($_GET['sessiontoken'])) {
    $device = new Device($db);
    $search = isset($_GET["s"]) ? $_GET['s'] : "";
} else {
    die();
}

// query devices
$stmt = $device->read($search);
$num = $stmt->rowCount();

// check if more than 0 record found
if($num>0) {
    // devices array
    $devices_arr=array();
    $devices_arr["devices"]=array();

    // retrieve our table contents
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);
        $device_item=array(
            "id" => $device_id,
            "name" => $device_name,
            "supplier_id" => $supplier_id,
            "supplier_name" => $supplier_name,
            "description" => html_entity_decode($device_description)
        );
        array_push($devices_arr["devices"], $device_item);
    }
    echo json_encode($devices_arr);
} else {
    $error_arr["error"] = array("errorcode" => 500, "message" => "Devices data not found.");
    echo json_encode($error_arr);
}
?>