<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// include database and object files
include '../../config/database.php';
include '../../model/terminal.php';
 
// get database connection
$database = new Database();
$db = $database->getConnection();
 
// prepare terminal object
$terminal = new Terminal($db);
 
// get id of terminal to be edited
$data = json_decode(file_get_contents("php://input"), true);
 
// set ID property of terminal to be edited
$terminal->id = $data["id"];
 
// set terminal property values
$terminal->name = $data["name"];
$terminal->reg_number = $data["reg_number"];
$terminal->network_address = $data["network_address"];
$terminal->network_name = $data["network_name"];
$terminal->mac_address = $data["mac_address"];
$terminal->description = $data["description"];
$terminal->location_id = $data["location_id"];
$terminal->status = $data["status"];
 
// update the terminal
if($terminal->update() === "duplicate") {
    $error_arr["error"] = array("errorcode" => 502,"message" => "Terminal Reg No already exists.");
    echo json_encode($error_arr["error"]);
} elseif($terminal->update() !== false) {
    echo json_encode(
        array("message" => "Terminal was updated."));
} else {
    $error_arr["error"] = array("errorcode" => 500,"message" => "Unable to update the terminal.");
    echo json_encode($error_arr["error"]);
}
?>