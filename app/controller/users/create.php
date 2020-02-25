<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// include database and object files
include '../../config/database.php';
include '../../model/user.php';

// get database connection
$database = new Database();
$db = $database->getConnection();

$user = new User($db);

$data = json_decode(file_get_contents("php://input"), true);

if(isset($data["name"])) {
    $user->name = $data["name"];
    $user->password = $data["password"];
    $user->firstname = $data["firstname"];
    $user->lastname = $data["lastname"];
    $user->useremail = $data["useremail"];
    $user->group = $data["group"]; 
    $user->notes = $data["notes"];
} else {
    die();
}

// create the user
if($user->create() === "duplicate") {
    $error_arr["error"] = array("errorcode" => 502,"message" => "Username/Email already exists.");
    echo json_encode($error_arr["error"]);
} elseif ($user->create() !== false) {
    echo json_encode(
        array("message" => "Success: User created."));
// if unable to added the user
} else {
    $error_arr["error"] = array("errorcode" => $user->create(),"message" => "Unable to create a user.");
    echo json_encode($error_arr["error"]);
}
?>