<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type");
// include database and object files
include '../../config/database.php';
include '../../model/locations.php';

// instantiate database and product object
$database = new Database();
$db = $database->getConnection();

if (isset($_GET['sessiontoken'])) {
    $location = new Location($db);
    $search = isset($_GET["s"]) ? $_GET['s'] : "";
} else {
    die();
}
// query locations
$stmt = $location->read($search);
$num = $stmt->rowCount();

// check if more than 0 record found
if($num>0) {
    // locations array
    $locations_arr=array();
    $locations_arr["locations"]=array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);
        $location_item=array(
            "id" => $location_id,
            "name" => $location_name,
            "status" => $location_is_active ? "Active" : "Not Active",
            "description" => html_entity_decode($location_description),
            "organization_id" => $organization_id,
            "organization_name" => $organization_name
        );

        array_push($locations_arr["locations"], $location_item);
    }
    echo json_encode($locations_arr);
} else {
    $error_arr["error"] = array("errorcode" => 500, "message" => "Locations data not found.");
    echo json_encode($error_arr);
}
?>