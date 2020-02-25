<?php
class Maintenance_history
{

    // database connection and table name
    private $conn;
    private $table_name = "maintenance_history";

    // object properties
    public $mh_id;
    public $mh_date;
    public $mh_description;
    public $user_id;
    public $inventory_id;

    // constructor with $db as database connection
    public function __construct($db)
    {
        $this->conn = $db;
    }

    // create the maintenance history
    public function create()
    {
        // insert query
        $query = "INSERT INTO
                    " . $this->table_name . "
                    ( mh_id, mh_date, mh_description, user_id, inventory_id) VALUES (NULL,:date,:description,:user_id, :inventory_id)";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->date = htmlspecialchars(strip_tags($this->date));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));
        $this->inventory_id = htmlspecialchars(strip_tags($this->inventory_id));

        // bind new values
        $stmt->bindParam(':date', $this->date);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':user_id', $this->user_id);
        $stmt->bindParam(':inventory_id', $this->inventory_id);

        // execute the query
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // read maintenance history
    public function read($search = NULL)
    {
        // select all query
        $query = "SELECT
                    u.user_name as user_name, i.inventory_serial_number as inventory_serial_number, m.mh_id, m.mh_date, m.mh_description
                FROM
                    " . $this->table_name . " m
                    LEFT JOIN
                        user u
                            ON m.user_id = u.user_id
                    LEFT JOIN
                        inventory i
                            ON m.inventory_id = i.inventory_id
                    WHERE
                        u.user_name LIKE ? OR i.inventory_serial_number LIKE ? OR m.mh_date LIKE ? OR m.mh_description LIKE ?
                    ORDER BY
                        m.mh_id DESC";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        $search = "%{$search}%";
        $stmt->bindParam(1, $search);
        $stmt->bindParam(2, $search);
        $stmt->bindParam(3, $search);
        $stmt->bindParam(4, $search);

        // execute query
        $stmt->execute();

        return $stmt;
    }

    // read one maintenance history
    public function readOne()
    {
        // query to read single record
        $query = "SELECT
                    u.user_name as user_name, i.inventory_serial_number as inventory_serial_number, m.mh_id, m.mh_date, m.mh_description, m.user_id, m.inventory_id
                FROM
                    " . $this->table_name . " m
                    LEFT JOIN
                        user u
                            ON m.user_id = u.user_id
                    LEFT JOIN
                        inventory i
                            ON m.inventory_id = i.inventory_id
                    WHERE
                        m.mh_id = ?
                    LIMIT
                        0,1";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // bind id of maintenance history to be updated
        $stmt->bindParam(1, $this->id);

        // execute query
        $stmt->execute();

        // get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->id = $row["mh_id"];
        $this->date = $row["mh_date"];
        $this->description = $row['mh_description'];
        $this->user_id = $row['user_id'];
        $this->user_name = $row['user_name'];
        $this->inventory_id = $row['inventory_id'];
        $this->inventory_serial_number = $row['inventory_serial_number'];
    }

    // update the maintenance history
    public function update()
    {
        // update query
        $query = "UPDATE
                    " . $this->table_name . "
                SET
                    mh_date = :date,
                    mh_description = :description,
                    user_id = :user_id,
                    inventory_id = :inventory_id
                WHERE
                    mh_id = :id";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->date = htmlspecialchars(strip_tags($this->date));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));
        $this->inventory_id = htmlspecialchars(strip_tags($this->inventory_id));

        // bind new values
        $stmt->bindParam(':date', $this->date);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':user_id', $this->user_id);
        $stmt->bindParam(':inventory_id', $this->inventory_id);
        $stmt->bindParam(':id', $this->id);

        // execute the query
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // delete the maintenance history
    public function delete()
    {
        // delete query
        $query = "DELETE FROM " . $this->table_name . " WHERE mh_id = ?";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->id = htmlspecialchars(strip_tags($this->id));

        // bind id of maintenance history to delete
        $stmt->bindParam(1, $this->id);

        // execute query
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }
}
