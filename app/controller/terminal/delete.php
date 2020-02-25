<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// include database and object file
include '../../config/database.php';
include '../../model/terminal.php';

// get database connection
$database = new Database();
$db = $database->getConnection();

// prepare terminal object
$terminal = new Terminal($db);

// get terminal id
$data = json_decode(file_get_contents("php://input"), true);

// set terminal id to be deleted
$terminal->id = $data["id"];

// delete the terminal
if($terminal->delete()) {
    echo json_encode(
        array("message" => "Terminal has been deleted")
    );
} // if unable to delete the terminal
else {
    $error_arr["error"] = array("errorcode" => 500,"message" => "Unable to delete the terminal.");
    echo json_encode($error_arr["error"]);
}
?>