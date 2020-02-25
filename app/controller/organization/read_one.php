<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
header("Access-Control-Allow-Headers: Content-Type");

// include database and object files
include '../../config/database.php';
include '../../model/organization.php';

// instantiate database
$database = new Database();
$db = $database->getConnection();

// initialize object
$organization = new Organization($db);

// set ID property of organization to be edited
$organization ->id = isset($_GET['id']) && isset($_GET['sessiontoken']) ? $_GET['id'] : die();

// read the details of organization to be edited
$organization ->readOne();

if ($organization->id) {
    $organization_arr = array(
        "id" => $organization->id,
        "name" => $organization->name,
        "status" => $organization->status ? "Active" : "Not Active",
        "description" => html_entity_decode($organization->description)
    );
    // make it json format
    echo json_encode($organization_arr);
} else {
    $error_arr["error"] = array("errorcode" => 500, "message" => "Organization data not found.");
    echo json_encode($error_arr);
}
?>