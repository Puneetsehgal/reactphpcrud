<?php
session_start();
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type");

// include database and object files
include '../../config/database.php';
include '../../model/user.php';

// instantiate database
$database = new Database();
$db = $database->getConnection();

// initialize object
if (isset($_GET['sessiontoken'])) {
    $user = new User($db);
    $search = isset($_GET["s"]) ? $_GET['s'] : "";
} else {
    die();
}
// query user
$stmt = $user->read($search);
$num = $stmt->rowCount();

// check if more than 0 record found
if($num>0) {
    // user array
    $user_arr=array();
    $user_arr["user"]=array();

    // retrieve our table contents
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);
        $user_item=array(
            "id" => $user_id,
            "name" => $user_name,
            "password" => $user_password,
            "firstname" => $user_first_name,
            "lastname" => $user_last_name,
            "useremail" => $user_email,
            "group" => $user_group, 
            "notes" => html_entity_decode($user_notes)
        );
        array_push($user_arr["user"], $user_item);
    }
    echo json_encode($user_arr);
} else {
    $error_arr["error"] = array("errorcode" => 500, "message" => "User data not found.");
    echo json_encode($error_arr);
}
?>