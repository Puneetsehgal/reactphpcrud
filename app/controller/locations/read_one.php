<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
header("Access-Control-Allow-Headers: Content-Type");

// include database and object files
include '../../config/database.php';
include '../../model/locations.php';
include '../../model/organization.php';

// instantiate database
$database = new Database();
$db = $database->getConnection();

// initialize object
$location = new Location($db);
$organization = new Organization($db);

$location ->id = isset($_GET['id']) && isset($_GET['sessiontoken']) ? $_GET['id'] : die();

$location ->readOne();

$stmtOrg = $organization->read();
$numOrg = $stmtOrg->rowCount();

if ($location->id && $numOrg>0) {
    $location_arr = array();
    $location_arr["location"] = array();

    $organizations_arr=array();
    $location_arr["organizations"]=array();

    while ($row = $stmtOrg->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);
        $organization_item=array(
            "id" => $organization_id,
            "name" => $organization_name,
        );
        array_push($organizations_arr, $organization_item);
    }

    $location_item = array(
        "id" => $location->id,
        "name" => $location->name,
        "status" => $location->status ? "Active" : "Not Active",
        "description" => html_entity_decode($location->description),
        "organization_id" => $location->organization_id,
        "organization_name" => $location->organization_name
    );

    $location_arr["location"] =  $location_item;
    $location_arr["organizations"] = $organizations_arr;
    
    echo json_encode($location_arr);
} else if (!$numOrg>0) {
    $error_arr["error"] = array("errorcode" => 502, "message" => "No organizations found. Please add organizations first to add location.");
    echo json_encode($error_arr);
} else {
    $error_arr["error"] = array("errorcode" => 500, "message" => "Location data not found.");
    echo json_encode($error_arr);
}
?>