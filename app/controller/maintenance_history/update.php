<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type");

// include database and object files
include '../../config/database.php';
include '../../model/maintenance_history.php';

// instantiate database
$database = new Database();
$db = $database->getConnection();

// initialize object
$maintenance_history = new Maintenance_history($db);

$data = json_decode(file_get_contents("php://input"), true);

$maintenance_history->id = $data["id"];
$maintenance_history->date = $data["date"];
$maintenance_history->description = $data["description"];
$maintenance_history->user_id = $data["user_id"];
$maintenance_history->inventory_id = $data["inventory_id"];

// update maintenance history
if($maintenance_history->update()) {
    echo json_encode(
        array("message" => "Success: Maintenance history updated."));
}// if unable to added the maintenance history, tell the user
else {
    $error_arr["error"] = array("errorcode" => 500,"message" => "Unable to update the maintenance history.");
    echo json_encode($error_arr["error"]);
}
?>