<?php
session_start();
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


// include database and object file
include '../../config/database.php';
include '../../model/user.php';

// get database connection
$database = new Database();
$db = $database->getConnection();

// prepare user object
$user = new User($db);

$data = json_decode(file_get_contents("php://input"), true);

$user->username = $data["username"];
$user->oldPassword = $data["oldPassword"]; // current password
$user->newPassword = $data["newPassword"]; // new password

// change user password
if($user->changepassword()) {
    echo json_encode(
        array("message" => "Success: User password updated."));
}
else {
    echo json_encode(
        array("errorcode" => 500, "message" => "Unable to change the password")
    );
}
?>