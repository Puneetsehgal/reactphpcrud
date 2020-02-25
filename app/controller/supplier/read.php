<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type");

// include database and object files
include '../../config/database.php';
include '../../model/supplier.php';

// instantiate database
$database = new Database();
$db = $database->getConnection();

// initialize object
if(isset($_GET['sessiontoken'])) {
    $supplier = new Supplier($db);
    $search = isset($_GET["s"]) ? $_GET['s'] : "";
} else {
    die();
}

// query supplier
$stmt = $supplier->read($search);
$num = $stmt->rowCount();

// check if more than 0 record found
if($num>0) {
    // supplier array
    $supplier_arr=array();
    $supplier_arr["supplier"]=array();

    // retrieve our table contents
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);
        $supplier_item=array(
            "id" => $supplier_id,
            "name" => $supplier_name,
            "address" => $supplier_address,
            "contact" => $supplier_contact,
            "email" => $supplier_email,
            "description" => html_entity_decode($supplier_description)
        );
        array_push($supplier_arr["supplier"], $supplier_item);
    }
    echo json_encode($supplier_arr);
} else {
    $error_arr["error"] = array("errorcode" => 500, "message" => "Suppliers data not found.");
    echo json_encode($error_arr);
}
?>