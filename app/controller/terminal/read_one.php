<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
header("Access-Control-Allow-Headers: Content-Type");

// include database and object files
include '../../config/database.php';
include '../../model/terminal.php';
include '../../model/locations.php';

// instantiate database and product object
$database = new Database();
$db = $database->getConnection();

// initialize object
$terminal = new Terminal($db);
$location = new Location($db);

// set ID property of terminal to be edited
$terminal ->id = isset($_GET['id']) && isset($_GET['sessiontoken']) ? $_GET['id'] : die();

// read the details of terminal to be edited
$terminal ->readOne();

$stmtLoc = $location->read();
$numLoc = $stmtLoc->rowCount();

// create array
if ($terminal->id && $numLoc>0) {
    $terminal_arr=array();
    $terminal_arr["terminal"]=array();
    $locations_arr=array();
    $terminal_arr["locations"]=array();
    
    while ($row = $stmtLoc->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);
        $location_item=array(
            "id" => $location_id,
            "name" => $location_name,
        );
        array_push($locations_arr, $location_item);
    }

    $terminal_item = array(
        "id" => $terminal->id,
        "reg_number" => $terminal->reg_number,
        "name" => $terminal->name,
        "network_address" => $terminal->network_address,
        "network_name" => $terminal->network_name,
        "mac_address" => $terminal->mac_address,
        "status" => $terminal->status ? "Active" : "Not Active",
        "description" => html_entity_decode($terminal->description),
        "location_id" => $terminal->location_id,
        "location_name" => $terminal->location_name
    );
    $terminal_arr["terminal"] = $terminal_item;
    $terminal_arr["locations"] = $locations_arr;
    // make it json format
    echo json_encode($terminal_arr);
} else if (!$numLoc>0) {
    $error_arr["error"] = array("errorcode" => 502, "message" => "No Locations found for the terminal.");
    echo json_encode($error_arr);
} else {
    $error_arr["error"] = array("errorcode" => 500, "message" => "Terminal data not found.");
    echo json_encode($error_arr);
}
?>