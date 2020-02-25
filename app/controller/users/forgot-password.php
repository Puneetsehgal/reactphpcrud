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

$user->useremail = $data["useremail"];

// call for forgetPassword function
if($user->forgotPassword()) {
    echo json_encode(
        array("message" => "Success. We have sent you an email with a temporary password")
    );
}
else {
    echo json_encode(
        array("errorcode" => 500, "message" => "We cannot find an account with that username and password")
    );
}
?>