<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// include database and object file
include '../../config/database.php';
include '../../model/supplier.php';

// get database connection
$database = new Database();
$db = $database->getConnection();

// prepare supplier object
$supplier = new Supplier($db);

// get supplier id
$data = json_decode(file_get_contents("php://input"), true);

// set supplier id to be deleted
$supplier->id = $data["id"];

// delete the supplier
if($supplier->delete()) {
    echo json_encode(
        array("message" => "Supplier has been deleted")
    );
} // if unable to delete the supplier
else {
    $error_arr["error"] = array("errorcode" => 500,"message" => "Unable to delete the supplier.");
    echo json_encode($error_arr["error"]);
}
?>