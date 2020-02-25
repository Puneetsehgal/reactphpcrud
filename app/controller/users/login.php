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

$user->username = $data["username"]; // username or useremail
$user->password = $data["password"];

$user->login();

$token = md5(rand(1000,9999)); // generate session token
$_SESSION["sessiontoken"] = $token; // set session token 

if($user->user_id) {
    $user_array = array(
        "id" => $user->user_id,
        "username" => $user->user_name,
        "first_name" => $user->user_first_name,
        "last_name" => $user->user_last_name,
        "useremail" => $user->useremail,
        "group" => $user->user_group,
        "sessiontoken" => $_SESSION["sessiontoken"]
    );
   echo json_encode($user_array);
}
else {
    echo json_encode(
        array("errorcode" => 500, "message" => "We cannot find an account with that username and password")
    );
}
?>