<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type");

// include database and object files
include '../../config/database.php';
include '../../model/terminal.php';
include '../../model/locations.php';

// instantiate database
$database = new Database();
$db = $database->getConnection();

// initialize object
if(isset($_GET['sessiontoken'])) {
    $terminal = new Terminal($db);
    $search = isset($_GET["s"]) ? $_GET['s'] : "";
} else {
    die();
}
// query terminal
$stmt = $terminal->read($search);
$num = $stmt->rowCount();

// check if more than 0 record found
if($num>0) {
    // terminal array
    $terminal_arr=array();
    $terminal_arr["terminal"]=array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);
        $terminal_item=array(
            "id" => $terminal_id,
            "reg_number" => $terminal_reg_number,
            "name" => $terminal_name,
            "network_address" => $terminal_network_address,
            "network_name" => $terminal_network_name,
            "mac_address" => $terminal_mac_address,
            "status" => $terminal_is_active ? "Active" : "Not Active",
            "description" => html_entity_decode($terminal_description),
            "location_id" => $location_id,
            "location_name" => $location_name
        );

        array_push($terminal_arr["terminal"], $terminal_item);
    }
    echo json_encode($terminal_arr);
} else {
    $error_arr["error"] = array("errorcode" => 500, "message" => "Terminals data not found.");
    echo json_encode($error_arr);
}
?>