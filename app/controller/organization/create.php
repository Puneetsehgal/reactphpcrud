<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// include database and object files
include '../../config/database.php';
include '../../model/organization.php';

// get database connection
$database = new Database();
$db = $database->getConnection();

// prepare organization object
$organization = new Organization($db);

$data = json_decode(file_get_contents("php://input"), true);

// set organization property values
if(isset($data["name"])) {
$organization->name = $data["name"];
$organization->description = $data["description"];
$organization->status = $data["status"];
} else {
    die();
}

// create the organization
if($organization->create()) {
    echo json_encode(
        array("message" => "Success: Organization added."));
}
else {
    $error_arr["error"] = array("errorcode" => 500,"message" => "Unable to add the organization.");
    echo json_encode($error_arr["error"]);
}
?>