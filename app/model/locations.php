<?php
session_start();
class Location
{

    // database connection and table name
    private $conn;
    private $table_name = "location";

    // object properties
    public $location_id;
    public $organization_id;
    public $location_name;
    public $location_is_active;
    public $location_description;

    // constructor with $db as database connection
    public function __construct($db)
    {
        $this->conn = $db;
    }

    // create the location
    public function create()
    {
        // insert query
        $query = "INSERT INTO
                    " . $this->table_name . "
                    (location_id, location_name, location_is_active, location_description, organization_id) VALUES (NULL,:name,:status,:description,:organization_id)";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->status = htmlspecialchars(strip_tags($this->status));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->organization_id = htmlspecialchars(strip_tags($this->organization_id));

        // bind new values
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':status', $this->status);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':organization_id', $this->organization_id);

        // execute the query
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // read locations
    public function read($search = NULL)
    {
        // select all query
        $query = "SELECT
                    o.organization_name as organization_name, l.location_id, l.organization_id, l.location_name, l.location_is_active, l.location_description
                FROM
                    " . $this->table_name . " l
                    LEFT JOIN
                        organization o
                            ON l.organization_id = o.organization_id
                    WHERE 
                    l.location_name LIKE ? OR l.location_description LIKE ? OR o.organization_name LIKE ?
                    ORDER BY
                    l.location_id DESC";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        $search=htmlspecialchars(strip_tags($search));

        $search = "%{$search}%";
        $stmt->bindParam(1, $search);
        $stmt->bindParam(2, $search);
        $stmt->bindParam(3, $search);

        // execute query
        $stmt->execute();

        return $stmt;
    }

    // read one location
    public function readOne()
    {
        // query to read single record
        $query = "SELECT
                    o.organization_name as organization_name, l.location_id, l.organization_id, l.location_name, l.location_is_active, l.location_description
                FROM
                    " . $this->table_name . " l
                     LEFT JOIN
                        organization o
                            ON l.organization_id = o.organization_id
                WHERE
                    l.location_id = ?
                LIMIT
                    0,1";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // bind id of location to be updated
        $stmt->bindParam(1, $this->id);

        // execute query
        $stmt->execute();

        // get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->id = $row["location_id"];
        $this->name = $row["location_name"];
        $this->status = $row['location_is_active'];
        $this->description = $row['location_description'];
        $this->organization_id = $row['organization_id'];
        $this->organization_name = $row['organization_name'];
    }

    // update the location
    public function update()
    {
        // update query
        $query = "UPDATE
                    " . $this->table_name . "
                SET
                    location_name = :name,
                    location_is_active = :status,
                    location_description = :description,
                    organization_id = :organization_id
                WHERE
                    location_id = :id";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->status = htmlspecialchars(strip_tags($this->status));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->organization_id = htmlspecialchars(strip_tags($this->organization_id));
        $this->id = htmlspecialchars(strip_tags($this->id));

        // bind new values
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':status', $this->status);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':organization_id', $this->organization_id);
        $stmt->bindParam(':id', $this->id);

        // execute the query
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // delete the location
    public function delete()
    {
        // delete query
        $query = "DELETE FROM " . $this->table_name . " WHERE location_id = ?";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->id = htmlspecialchars(strip_tags($this->id));

        // bind id of location to delete
        $stmt->bindParam(1, $this->id);

        // execute query
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }
}
