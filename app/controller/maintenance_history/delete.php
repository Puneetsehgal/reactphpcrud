<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// include database and object file
include '../../config/database.php';
include '../../model/maintenance_history.php';

// get database connection
$database = new Database();
$db = $database->getConnection();

$maintenance_history = new Maintenance_history($db);

// get Maintenance history id
$data = json_decode(file_get_contents("php://input"), true);

// set Maintenance history id to be deleted
$maintenance_history->id = $data["id"];

// delete the Maintenance history
if($maintenance_history->delete()) {
    echo json_encode(
        array("message" => "Maintenance history has been deleted")
    );
} 
else {
    $error_arr["error"] = array("errorcode" => 500,"message" => "Unable to delete the Maintenance history.");
    echo json_encode($error_arr["error"]);
}
?>