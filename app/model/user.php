<?php
session_start();
class User{

    // database connection and table name
    private $conn;
    private $table_name = "user";

    // object properties
    public $user_id;
    public $user_name;
    public $user_password;
    public $user_first_name;
    public $user_last_name;
    public $user_group;
    public $user_notes;

    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    // create the user
    function create(){

        $query = "Select u.user_name FROM " . $this->table_name . " u
                    WHERE 
                        u.user_name = :name OR u.user_email = :useremail";

        $checkstmt = $this->conn->prepare($query);

        $this->name=htmlspecialchars(strip_tags($this->name));
        $this->useremail=htmlspecialchars(strip_tags($this->useremail));

        $checkstmt->bindParam(':name', $this->name);
        $checkstmt->bindParam(':useremail', $this->useremail);

        $checkstmt->execute();

        // get retrieved result
        $result = $checkstmt->fetch(PDO::FETCH_ASSOC);

        if (isset($result["user_name"])) {
            return "duplicate";
        } else {
            // insert query
            $query = "INSERT INTO
                        " . $this->table_name . "
                        ( user_id, user_name, user_password, user_first_name, user_last_name, user_email, user_group, user_notes) VALUES (NULL,:name,:password,:firstname,:lastname, :useremail, :group,:notes)";

            // prepare query statement
            $stmt = $this->conn->prepare($query);

            // sanitize
            $this->name=htmlspecialchars(strip_tags($this->name));
            $this->password=htmlspecialchars(strip_tags($this->password));
            $this->firstname=htmlspecialchars(strip_tags($this->firstname));
            $this->lastname=htmlspecialchars(strip_tags($this->lastname));
            $this->useremail=htmlspecialchars(strip_tags($this->useremail));
            $this->group=htmlspecialchars(strip_tags($this->group));
            $this->notes=htmlspecialchars(strip_tags($this->notes));

            // bind new values
            $stmt->bindParam(':name', $this->name);
            $stmt->bindParam(':password', $this->password);
            $stmt->bindParam(':firstname', $this->firstname);
            $stmt->bindParam(':lastname', $this->lastname);
            $stmt->bindParam(':useremail', $this->useremail);
            $stmt->bindParam(':group', $this->group);
            $stmt->bindParam(':notes', $this->notes);

            // execute the query
            if($stmt->execute()){
                return true;
            }

            return false;
        }
    }

    // read users
    function read($search = NULL){
        // select all query
        $query = "SELECT
                    u.user_id, u.user_name, u.user_password, u.user_first_name, u.user_last_name, u.user_group, u.user_notes, u.user_email
                FROM
                    " . $this->table_name . " u
                WHERE 
                    u.user_name LIKE ? OR u.user_password LIKE ? OR u.user_first_name LIKE ? OR u.user_last_name LIKE ? OR u.user_group LIKE ? OR u.user_notes LIKE ? OR u.user_email LIKE ?
                ORDER BY
                    u.user_id DESC";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        $search = "%{$search}%";
        $stmt->bindParam(1, $search);
        $stmt->bindParam(2, $search);
        $stmt->bindParam(3, $search);
        $stmt->bindParam(4, $search);
        $stmt->bindParam(5, $search);
        $stmt->bindParam(6, $search);
        $stmt->bindParam(7, $search);

        // execute query
        $stmt->execute();

        return $stmt;
    }

    // read one user
    function readOne(){
        // query to read single record
        $query = "SELECT
                    u.user_id, u.user_name, u.user_password, u.user_first_name, u.user_last_name, u.user_group, u.user_notes, u.user_email
                FROM
                    " . $this->table_name . " u
                WHERE
                    u.user_id = ?
                LIMIT
                    0,1";

        // prepare query statement
        $stmt = $this->conn->prepare( $query );

        // bind id of user to be updated
        $stmt->bindParam(1, $this->id);

        // execute query
        $stmt->execute();

        // get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->name=$row["user_name"];
        $this->password=$row["user_password"];
        $this->firstname=$row["user_first_name"];
        $this->lastname=$row["user_last_name"];
        $this->useremail=$row["user_email"];
        $this->group=$row["user_group"];
        $this->notes=$row["user_notes"];
        $this->id=$row["user_id"];
    }

    // update user
    function update(){
        // check if the username already exists
        $query = "Select u.user_name, u.user_email FROM " . $this->table_name . " u
                    WHERE 
                        (u.user_name = :name OR u.user_email = :useremail) AND u.user_id <> :id";

        $checkstmt = $this->conn->prepare($query);

        $this->name=htmlspecialchars(strip_tags($this->name));
        $this->useremail=htmlspecialchars(strip_tags($this->useremail));
        $this->id=htmlspecialchars(strip_tags($this->id));

        $checkstmt->bindParam(':name', $this->name);
        $checkstmt->bindParam(':useremail', $this->useremail);
        $checkstmt->bindParam(':id', $this->id);

        $checkstmt->execute();

        // get retrieved result
        $result = $checkstmt->fetch(PDO::FETCH_ASSOC);

        if (isset($result["user_name"]) || isset($result["user_email"]) ) {
            return "duplicate";
        } else {
            // update query
            $query = "UPDATE
                        " . $this->table_name . "
                    SET 
                    user_name = :name, 
                    user_password = :password, 
                    user_first_name = :firstname, 
                    user_last_name = :lastname, 
                    user_email = :useremail, 
                    user_group = :group, 
                    user_notes = :notes
                    WHERE
                    user_id = :id";

            // prepare query statement
            $stmt = $this->conn->prepare($query);

            // sanitize
            $this->name=htmlspecialchars(strip_tags($this->name));
            $this->password=htmlspecialchars(strip_tags($this->password));
            $this->firstname=htmlspecialchars(strip_tags($this->firstname));
            $this->lastname=htmlspecialchars(strip_tags($this->lastname));
            $this->useremail=htmlspecialchars(strip_tags($this->useremail));
            $this->group=htmlspecialchars(strip_tags($this->group));
            $this->notes=htmlspecialchars(strip_tags($this->notes));
            $this->id=htmlspecialchars(strip_tags($this->id));

            // bind new values
            $stmt->bindParam(':name', $this->name);
            $stmt->bindParam(':password', $this->password);
            $stmt->bindParam(':firstname', $this->firstname);
            $stmt->bindParam(':lastname', $this->lastname);
            $stmt->bindParam(':useremail', $this->useremail);
            $stmt->bindParam(':group', $this->group);
            $stmt->bindParam(':notes', $this->notes);
            $stmt->bindParam(':id', $this->id);

            // execute the query
            if($stmt->execute()) {
                return true;
            }

            return false;
        }
    }

    // delete the user
    function delete(){
        // delete query
        $query = "DELETE FROM " . $this->table_name . " WHERE user_id = ?";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->id=htmlspecialchars(strip_tags($this->id));

        // bind id of user to delete
        $stmt->bindParam(1, $this->id);
    
        // execute query
        if($stmt->execute()){
            return true;
        }

        return false;
    }

    // login the user
    function login(){
        $query = "Select * FROM " . $this->table_name . " WHERE (user_name = :username OR user_email = :username) AND (user_password = :password)";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':username', $this->username);
        $stmt->bindParam(':password', $this->password);

        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->user_id = $row["user_id"];
        $this->user_name = $row["user_name"];
        $this->user_first_name = $row["user_first_name"];
        $this->user_last_name = $row["user_last_name"];
        $this->user_group = $row["user_group"];
        $this->useremail = $row["user_email"];
    }

    // change user password
    function changepassword(){
        $query = "UPDATE
        " . $this->table_name . "
         SET 
            user_password = :newPassword
                WHERE user_name = :username AND user_password = :oldPassword";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':username', $this->username);
        $stmt->bindParam(':oldPassword', $this->oldPassword);
        $stmt->bindParam(':newPassword', $this->newPassword);

        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // forgot user password
    function forgotPassword() {

        // generate random password
        $chars = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789";
        $i = 0;
        $pass = '' ;

        while ($i <= 8) {
            $num = mt_rand(0,61);
            $tmp = substr($chars, $num, 1);
            $pass = $pass . $tmp;
            $i++;
        };

        $newPassword = $pass;

        // check is user exists
        $query = "Select * FROM " . $this->table_name . " u
                    WHERE 
                        u.user_email = :useremail";

        $checkstmt = $this->conn->prepare($query);

        $this->useremail=htmlspecialchars(strip_tags($this->useremail));

        $checkstmt->bindParam(':useremail', $this->useremail);

        $checkstmt->execute();

        // get retrieved result
        $result = $checkstmt->fetch(PDO::FETCH_ASSOC);

        if (isset($result["user_email"])) {
            // update the user password with random generate password
            $query = "UPDATE
            " . $this->table_name . "
             SET 
                user_password = :newPassword
                    WHERE user_email = :useremail";
    
            $stmt = $this->conn->prepare($query);
    
            $stmt->bindParam(':useremail', $this->useremail);
            $stmt->bindParam(':newPassword', $newPassword);
     
            if($stmt->execute()) {
                // send an email to user with random generate password
                $message='<html><body>';
                $message .= '<div style="background:#990033; padding:10px; margin-bottom:10px; color: #f5f5f5;">';
                $message .='MAC Express';
                $message .= '</div>';
                $message .= '<table rules="all" style="border: none;" cellpadding="10">';
                $message .= "<tr style='border: none;'><td style='border: none;'><strong>Name:</strong> </td><td style='border: none;'>" . $result["user_first_name"]." ".$result["user_last_name"] . "</td></tr>";
                $message .= "<tr style='border: none;'><td style='border: none;'><strong>Email:</strong> </td><td style='border: none;'>" . $result['user_email'] . "</td></tr>";
                $message .= "<tr style='border: none;'><td style='border: none;'><strong>Message:</strong> </td><td style='border: none;'> Your temporary password is: ". $newPassword ."</td></tr>";
                $message .= "</table>";
                $message .= "</body></html>";
                $to = $result['user_email'];
                $subject = 'Forgot Password MAC Express';
                $headers = "From: MAC Express <noreply@macexpress.com>\r\n";
                $headers .= "MIME-Version: 1.0\r\n";
                $headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
                mail($to, $subject, $message, $headers);

                return true;
            }
            return false;
        }
        return false;
    }
}