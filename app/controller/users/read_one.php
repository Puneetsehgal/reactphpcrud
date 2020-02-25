<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
header("Access-Control-Allow-Headers: Content-Type");

// include database and object files
include '../../config/database.php';
include '../../model/user.php';

// instantiate database
$database = new Database();
$db = $database->getConnection();

// initialize object
$user = new User($db);

$user->id = isset($_GET['id']) && isset($_GET['sessiontoken']) ? $_GET['id'] : die();
$user->readOne();

// create array
if ($user->id) {
    $user_arr = array(
        "id" => $user->id,
        "name" => $user->name,
        "password" => $user->password,
        "firstname" => $user->firstname,
        "lastname" => $user->lastname,
        "useremail" => $user->useremail,
        "group" => $user->group, 
        "notes" => html_entity_decode($user->notes)
    );
    // make it json format
    echo json_encode($user_arr);
} else {
    $error_arr["error"] = array("errorcode" => 500, "message" => "User data not found.");
    echo json_encode($error_arr);
}
?>