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

// get location id
$data = json_decode(file_get_contents("php://input"), true);

// set location id to be deleted
$location->id = $data["id"];

// delete the location
if($location->delete()) {
    echo json_encode(
        array("message" => "Location has been deleted")
    );
} // if unable to delete the location
else {
    $error_arr["error"] = array("errorcode" => 500,"message" => "Unable to delete the location.");
    echo json_encode($error_arr["error"]);
}
?>