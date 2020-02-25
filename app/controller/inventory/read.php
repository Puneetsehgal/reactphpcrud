<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type");

// include database and object files
include '../../config/database.php';
include '../../model/inventory.php';

// instantiate database
$database = new Database();
$db = $database->getConnection();

// initialize object
if(isset($_GET['sessiontoken'])) {
    $inventory = new Inventory($db);
    $search = isset($_GET["s"]) ? $_GET['s'] : "";
} else {
    die();
}

$stmt = $inventory->read($search);
$num = $stmt->rowCount();

// check if more than 0 record found
if($num>0) {
    // inventory array
    $inventory_arr=array();
    $inventory_arr["inventory"]=array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);
        $inventory_item=array(
            "id" => $inventory_id,
            "serial_number" => $inventory_serial_number,
            "hcs_number" => $inventory_hcs_number,
            "purchase_date" => $inventory_date_purchase,
            "status" => $inventory_is_active ? "Active" : "Not Active",
            "notes" => html_entity_decode($inventory_notes),
            "terminal_id" => $terminal_id,
            "terminal_name" => $terminal_name,
            "device_id" => $device_id,
            "device_name" => $device_name
        );

        array_push($inventory_arr["inventory"], $inventory_item);
    }
    echo json_encode($inventory_arr);
} else {
    $error_arr["error"] = array("errorcode" => 500, "message" => "Inventory data not found.");
    echo json_encode($error_arr);
}
?>