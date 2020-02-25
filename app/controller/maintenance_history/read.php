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
if(isset($_GET['sessiontoken'])) {
    $maintenance_history = new Maintenance_history($db);
    $search = isset($_GET["s"]) ? $_GET['s'] : "";
} else {
    die();
}
// query maintenance_history
$stmt = $maintenance_history->read($search);
$num = $stmt->rowCount();

// check if more than 0 record found
if($num>0) {
    // maintenance_history array
    $maintenance_history_arr=array();
    $maintenance_history_arr["maintenance_history"]=array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);
        $maintenance_history_item=array(
            "id" => $mh_id,
            "date" => $mh_date,
            "description" => $mh_description,
            "user_id" => $user_id,
            "user_name" => $user_name,
            "inventory_id" => $inventory_id,
            "serial_number" => $inventory_serial_number
        );

        array_push($maintenance_history_arr["maintenance_history"], $maintenance_history_item);
    }
    echo json_encode($maintenance_history_arr);
} else {
    $error_arr["error"] = array("errorcode" => 500, "message" => "Maintenance history data not found.");
    echo json_encode($error_arr);
}
?>