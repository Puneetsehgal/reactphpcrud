<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// include database and object files
include '../../config/database.php';
include '../../model/devices.php';

// get database connection
$database = new Database();
$db = $database->getConnection();

// prepare device object
$device = new Device($db);

$data = json_decode(file_get_contents("php://input"), true);

// set device property values
if(isset($data["name"])) {
    $device->name = $data["name"];
    $device->description = $data["description"];
    $device->supplier_id =  $data["supplier_id"];
} else {
    die();
}

// create the device
if($device->create()) {
    echo json_encode(
        array(
            "message" => "Device was added."
        )
    );
}
else {
    $error_arr["error"] = array("errorcode" => 500,"message" => "Unable to add the device.");
    echo json_encode($error_arr["error"]);
}
?>