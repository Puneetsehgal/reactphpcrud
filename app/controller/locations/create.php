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

$data = json_decode(file_get_contents("php://input"), true);

if(isset($data["name"])) {
    $location->name = $data["name"];
    $location->status = $data["status"];
    $location->description = $data["description"];
    $location->organization_id = $data["organization_id"];
} else {
    die();
}

// create the location
if($location->create()) {
    echo json_encode(
        array("message" => "Success: Location added."));
}// if unable to added the location, tell the user
else {
    $error_arr["error"] = array("errorcode" => 500,"message" => "Unable to add the location.");
    echo json_encode($error_arr["error"]);
}
?>