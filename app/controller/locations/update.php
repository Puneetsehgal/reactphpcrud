<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// include database and object files
include '../../config/database.php';
include '../../model/locations.php';
 
// get database connection
$database = new Database();
$db = $database->getConnection();
 
// prepare location object
$location = new Location($db);
 
// get id of location to be edited
$data = json_decode(file_get_contents("php://input"), true);
 
// set ID property of location to be edited
$location->id = $data["id"];
 
// set location property values
$location->name = $data["name"];
$location->status = $data["status"];
$location->description = $data["description"];
$location->organization_id = $data["organization_id"];
 
// update the location
if($location->update()) {
    echo json_encode(
        array("message" => "Success: Location updated."));
}// if unable to added the location, tell the user
else {
    $error_arr["error"] = array("errorcode" => 500,"message" => "Unable to update the location.");
    echo json_encode($error_arr["error"]);
}
?>