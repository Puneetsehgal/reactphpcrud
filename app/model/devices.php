<?php
class Device{

    // database connection and table name
    private $conn;
    private $table_name = "device";

    // object properties
    public $device_id;
    public $device_name;
    public $device_description;
    public $supplier_id;

    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    // create the decives
    function create(){
        // insert query
        $query = "INSERT INTO
                    " . $this->table_name . "
                    (device_id, device_name, device_description, supplier_id) VALUES (NULL,:name,:description, :supplier_id)";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->name=htmlspecialchars(strip_tags($this->name));
        $this->description=htmlspecialchars(strip_tags($this->description));
        $this->supplier_id=htmlspecialchars(strip_tags($this->supplier_id));

        // bind new values
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':supplier_id', $this->supplier_id);

        // execute the query
        if($stmt->execute()){
            return true;
        }

        return false;
    }

    // read devices
    function read($search = NULL){
        // select all query
        $query = "SELECT
                  s.supplier_name as supplier_name, d.supplier_id, d.device_id, d.device_name, d.device_description
                FROM
                    " . $this->table_name . " d
                LEFT JOIN
                    supplier s
                        ON d.supplier_id = s.supplier_id
                WHERE
                    d.device_name LIKE ? OR d.device_description LIKE ? OR s.supplier_name LIKE ?
                ORDER BY
                    d.device_id DESC";
                    
        // prepare query statement
        $stmt = $this->conn->prepare($query);

        $search = "%{$search}%";
        $stmt->bindParam(1, $search);
        $stmt->bindParam(2, $search);
        $stmt->bindParam(3, $search);

        // execute query
        $stmt->execute();

        return $stmt;
    }

    // read one decives
    function readOne(){
        // query to read single record
        $query = "SELECT
                   s.supplier_name as supplier_name, d.supplier_id, d.device_id, d.device_name, d.device_description
                FROM
                    " . $this->table_name . " d
                LEFT JOIN
                    supplier s
                         ON d.supplier_id = s.supplier_id
                WHERE
                    d.device_id = ?
                LIMIT
                    0,1";

        // prepare query statement
        $stmt = $this->conn->prepare( $query );

        // bind id of decive to be updated
        $stmt->bindParam(1, $this->id);

        // execute query
        $stmt->execute();

        // get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->id = $row["device_id"];
        $this->name = $row["device_name"];
        $this->description = $row['device_description'];
        $this->supplier_id = $row['supplier_id'];
        $this->supplier_name = $row['supplier_name'];
    }

    // update the devices
    function update(){
        // update query
        $query = "UPDATE
                    " . $this->table_name . "
                SET
                    device_name = :name,
                    device_description = :description,
                    supplier_id = :supplier_id
                WHERE
                     device_id = :id";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->name=htmlspecialchars(strip_tags($this->name));
        $this->description=htmlspecialchars(strip_tags($this->description));
        $this->supplier_id=htmlspecialchars(strip_tags($this->supplier_id));
        $this->id=htmlspecialchars(strip_tags($this->id));

        // bind new values
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':supplier_id', $this->supplier_id);
        $stmt->bindParam(':id', $this->id);

        // execute the query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // delete the decive
    function delete(){
        // delete query
        $query = "DELETE FROM " . $this->table_name . " WHERE device_id = ?";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->id=htmlspecialchars(strip_tags($this->id));

        // bind id of device to delete
        $stmt->bindParam(1, $this->id);
    
        // execute query
        if($stmt->execute()){
            return true;
        }

        return false;
    }
}