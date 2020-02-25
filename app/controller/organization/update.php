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
 
// get id of organization to be edited
$data = json_decode(file_get_contents("php://input"), true);
 
// set ID property of organization to be edited
$organization->id = $data["id"];
 
// set organization property values
$organization->name = $data["name"];
$organization->status = $data["status"];
$organization->description = $data["description"];
 
// update the organization
if($organization->update()) {
    echo json_encode(
        array("message" => "Success: Organization update."));
}// if unable to added the organization, tell the user
else {
    $error_arr["error"] = array("errorcode" => 500,"message" => "Unable to update the organization.");
    echo json_encode($error_arr["error"]);
}
?>