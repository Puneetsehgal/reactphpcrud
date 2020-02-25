<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type");

// include database and object files
include '../../config/database.php';
include '../../model/maintenance_history.php';
include '../../model/user.php';
include '../../model/inventory.php';

// instantiate database
$database = new Database();
$db = $database->getConnection();

// initialize object
$maintenance_history = new Maintenance_history($db);
$user = new User($db);
$inventory = new Inventory($db);

$maintenance_history ->id = isset($_GET['id']) && isset($_GET['sessiontoken']) ? $_GET['id'] : die();

// query maintenance_history
$stmt = $maintenance_history->readOne();

$stmtUsr = $user->read();
$numUsr = $stmtUsr->rowCount();

$stmtInv = $inventory->read();
$numInv = $stmtInv->rowCount();

// check if more than 0 record found
if($numUsr>0 && $numInv>0) {
    // maintenance_history array
    $maintenance_history_arr=array();
    $maintenance_history_arr["maintenance_history"]=array();
    
    $user_arr=array();
    $maintenance_history_arr["user"]=array();
    
    $inventory_arr=array();
    $maintenance_history_arr["inventory"]=array();

    // retrieve our table contents
    while ($row = $stmtUsr->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);
        $user_item=array(
            "id" => $user_id,
            "name" => $user_name,
        );
        array_push($user_arr, $user_item);
    }

    while ($row = $stmtInv->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);
        $inventory_item=array(
            "id" => $inventory_id,
            "serial_number" => $inventory_serial_number,
        );
        array_push($inventory_arr, $inventory_item);
    }

    $maintenance_history_item=array(
        "id" => $maintenance_history->id,
        "date" => $maintenance_history->date,
        "description" => $maintenance_history->description,
        "user_id" => $maintenance_history->user_id,
        "user_name" => $maintenance_history->user_name,
        "inventory_id" => $maintenance_history->inventory_id,
        "serial_number" => $maintenance_history->inventory_serial_number
    );

    $maintenance_history_arr["maintenance_history"] = $maintenance_history_item;
    $maintenance_history_arr["user"] = $user_arr;
    $maintenance_history_arr["inventory"] = $inventory_arr;
    
    echo json_encode($maintenance_history_arr);
}  else if (!$numUsr>0 || $numInv>0) {
    $error_arr["error"] = array( "errorcode" => 502, "message" => "No user or inventory found. Please add user or inventory first to add maintenance history.");
    echo json_encode($error_arr);
} else {
    $error_arr["error"] = array("errorcode" => 500, "message" => "Maintenance history data not found.");
    echo json_encode($error_arr);
}
?>