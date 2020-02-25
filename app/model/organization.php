<?php
class Organization{

    // database connection and table name
    private $conn;
    private $table_name = "organization";

    // object properties
    public $organization_id;
    public $organization_name;
    public $organization_description;  
    public $organization_is_active;

    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    // create the organization
    public function create()
    {
        // insert query
        $query = "INSERT INTO
                    " . $this->table_name . "
                    (organization_id, organization_name, organization_description, organization_is_active) VALUES (NULL,:name,:description,:status)";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->status = htmlspecialchars(strip_tags($this->status));
        $this->description = htmlspecialchars(strip_tags($this->description));
       
        // bind new values
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':status', $this->status);
        $stmt->bindParam(':description', $this->description);

        // execute the query
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // read organizations
    function read($search = NULL){
        // select all query
        $query = "SELECT
                    o.organization_id, o.organization_name, o.organization_is_active, o.organization_description
                FROM
                    " . $this->table_name . " o
                WHERE 
                    o.organization_name LIKE ? OR o.organization_description LIKE ?
                ORDER BY
                    o.organization_id DESC";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        $search=htmlspecialchars(strip_tags($search));
        $search = "%{$search}%";
        $stmt->bindParam(1, $search);
        $stmt->bindParam(2, $search);

        // execute query
        $stmt->execute();

        return $stmt;
    }

    // read one organization
    function readOne(){
        // query to read single record
        $query = "SELECT
                    o.organization_id, o.organization_name,o.organization_description, o.organization_is_active
                FROM
                    " . $this->table_name . " o
                WHERE
                    o.organization_id = ?
                LIMIT
                    0,1";

        // prepare query statement
        $stmt = $this->conn->prepare( $query );

        // bind id of organization to be updated
        $stmt->bindParam(1, $this->id);

        // execute query
        $stmt->execute();

        // get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->id = $row["organization_id"];
        $this->name = $row["organization_name"];
        $this->description = $row['organization_description'];
        $this->status = $row['organization_is_active'];
    }

    // update the organization
    public function update()
    {
        // update query
        $query = "UPDATE
                    " . $this->table_name . "
                SET
                    organization_name = :name,
                    organization_description = :description,
                    organization_is_active = :status
                WHERE
                    organization_id = :id";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->status = htmlspecialchars(strip_tags($this->status));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->id = htmlspecialchars(strip_tags($this->id));

        // bind new values
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':status', $this->status);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':id', $this->id);

        // execute the query
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // delete the organization
    function delete(){
        // delete query
        $query = "DELETE FROM " . $this->table_name . " WHERE organization_id = ?";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->id=htmlspecialchars(strip_tags($this->id));

        // bind id of organization to delete
        $stmt->bindParam(1, $this->id);
    
        // execute query
        if($stmt->execute()){
            return true;
        }

        return false;
    }
}