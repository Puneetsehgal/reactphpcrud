<?php
session_start();
class Database{
 
    // specify your own database credentials
    // private $host = "localhost";
    // private $db_name = "mac_express_inv";
    // private $username = "root";
    // private $password = "mysql";
    private $host= "mysql.hostinger.com";
    private $db_name = "u707314810_mac";
    private $username = "u707314810_root";
    private $password = "mysqlmac";
    public $conn;
 
    // get the database connection
    public function getConnection(){
 
        $this->conn = null;
 
        try{
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
        }catch(PDOException $exception){
            echo "Connection error: " . $exception->getMessage();
        }
        return $this->conn;
    }
}
?>