<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// include database and object files
include '../../config/database.php';
include '../../model/supplier.php';
 
// get database connection
$database = new Database();
$db = $database->getConnection();
 
// prepare supplier object
$supplier = new Supplier($db);
 
// get id of supplier to be edited
$data = json_decode(file_get_contents("php://input"), true);
 
// set ID property of supplier to be edited
$supplier->id = $data["id"];
 
// set supplier property values
$supplier->name = $data["name"];
$supplier->address = $data["address"];
$supplier->description = $data["description"];
$supplier->contact = $data["contact"];
$supplier->email = $data["email"];
 
// update the supplier
if($supplier->update()) {
    echo json_encode(
        array("message" => "Supplier was updated."));
}// if unable to update the supplier, tell the user
else {
    $error_arr["error"] = array("errorcode" => 500,"message" => "Unable to update the supplier.");
    echo json_encode($error_arr["error"]);
}
?>