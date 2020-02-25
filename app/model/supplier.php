<?php
class Supplier{

    // database connection and table name
    private $conn;
    private $table_name = "supplier";

    // object properties
    public $supplier_id;
    public $supplier_name;
    public $supplier_address;
    public $supplier_contact;
    public $supplier_email;
    public $supplier_description;

    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    // create the supplier
    function create(){
        // insert query
        $query = "INSERT INTO
                    " . $this->table_name . "
                    (supplier_id, supplier_name, supplier_address, supplier_contact, supplier_email, supplier_description) VALUES (NULL,:name,:address,:contact,:email,:description)";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->name=htmlspecialchars(strip_tags($this->name));
        $this->address=htmlspecialchars(strip_tags($this->address));
        $this->contact=htmlspecialchars(strip_tags($this->contact));
        $this->email=htmlspecialchars(strip_tags($this->email));
        $this->description=htmlspecialchars(strip_tags($this->description));

        // bind new values
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':address', $this->address);
        $stmt->bindParam(':contact', $this->contact);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':description', $this->description);

        // execute the query
        if($stmt->execute()){
            return true;
        }

        return false;
    }

    // read suppliers
    function read($search = NULL){
        // select all query
        $query = "SELECT
                    s.supplier_id, s.supplier_name, s.supplier_address, s.supplier_contact, s.supplier_email, s.supplier_description
                FROM
                    " . $this->table_name . " s
                WHERE
                    s.supplier_name LIKE ? OR s.supplier_address LIKE ? OR s.supplier_contact LIKE ? OR s.supplier_email LIKE ? OR s.supplier_description LIKE ?
                ORDER BY
                    s.supplier_id DESC";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        $search = "%{$search}%";
        $stmt->bindParam(1, $search);
        $stmt->bindParam(2, $search);
        $stmt->bindParam(3, $search);
        $stmt->bindParam(4, $search);
        $stmt->bindParam(5, $search);
        // execute query
        $stmt->execute();

        return $stmt;
    }

    // read one supplier
    function readOne(){
        // query to read single record
        $query = "SELECT
                    s.supplier_id, s.supplier_name, s.supplier_address, s.supplier_contact, s.supplier_email, s.supplier_description
                FROM
                    " . $this->table_name . " s
                WHERE
                    s.supplier_id = ?
                LIMIT
                    0,1";

        // prepare query statement
        $stmt = $this->conn->prepare( $query );

        // bind id of supplier to be updated
        $stmt->bindParam(1, $this->id);

        // execute query
        $stmt->execute();

        // get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->id = $row["supplier_id"];
        $this->name = $row["supplier_name"];
        $this->address = $row['supplier_address'];
        $this->contact = $row["supplier_contact"];
        $this->email = $row["supplier_email"];
        $this->description = $row['supplier_description'];
    }

    // update the supplier
    public function update()
    {
        // update query
        $query = "UPDATE
                    " . $this->table_name . "
                SET
                    supplier_name = :name,
                    supplier_address = :address,
                    supplier_contact = :contact,
                    supplier_email = :email,
                    supplier_description = :description
                WHERE
                    supplier_id = :id";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->address = htmlspecialchars(strip_tags($this->address));
        $this->contact = htmlspecialchars(strip_tags($this->contact));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->id = htmlspecialchars(strip_tags($this->id));

        // bind new values
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':address', $this->address);
        $stmt->bindParam(':contact', $this->contact);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':id', $this->id);

        // execute the query
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // delete the supplier
    function delete(){
        // delete query
        $query = "DELETE FROM " . $this->table_name . " WHERE supplier_id = ?";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->id=htmlspecialchars(strip_tags($this->id));

        // bind id of supplier to delete
        $stmt->bindParam(1, $this->id);
    
        // execute query
        if($stmt->execute()){
            return true;
        }

        return false;
    }
}