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

$data = json_decode(file_get_contents("php://input"), true);

// set supplier property values
if(isset($data["name"])) {
    $supplier->name = $data["name"];
    $supplier->address = $data["address"];
    $supplier->contact = $data["contact"];
    $supplier->email = $data["email"];
    $supplier->description = $data["description"];
} else {
    die();
}
// create the supplier
if($supplier->create()) {
    echo json_encode(
        array(
            "message" => "Supplier was added."
        )
    );
}// if unable to added the supplier, tell the user
else {
    $error_arr["error"] = array("errorcode" => 500,"message" => "Unable to add the supplier.");
    echo json_encode($error_arr["error"]);
}
?>