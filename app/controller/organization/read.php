<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type");

// include database and object files
include '../../config/database.php';
include '../../model/organization.php';

// instantiate database
$database = new Database();
$db = $database->getConnection();

// initialize object
if(isset($_GET['sessiontoken'])) {
    $organization = new Organization($db);
    $search = isset($_GET["s"]) ? $_GET['s'] : "";
} else {
    die();
}

// query organizations
$stmt = $organization->read($search);
$num = $stmt->rowCount();

// check if more than 0 record found
if($num>0) {
    // organizations array
    $organizations_arr=array();
    $organizations_arr["organizations"]=array();

    // retrieve our table contents
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);
        $organization_item=array(
            "id" => $organization_id,
            "name" => $organization_name,
            "status" => $organization_is_active ? "Active" : "Not Active",
            "description" => html_entity_decode($organization_description)
        );
        array_push($organizations_arr["organizations"], $organization_item);
    }
    echo json_encode($organizations_arr);
} else {
    $error_arr["error"] = array("errorcode" => 500, "message" => "Organizations data not found.");
    echo json_encode($error_arr);
}
?>