<?php
class Terminal
{

    // database connection and table name
    private $conn;
    private $table_name = "terminal";

    // object properties
    public $terminal_id;
    public $terminal_reg_number;
    public $terminal_name;
    public $terminal_network_address;
    public $terminal_network_name;
    public $terminal_mac_address;
    public $terminal_is_active;
    public $terminal_description;
    public $location_id;

    // constructor with $db as database connection
    public function __construct($db)
    {
        $this->conn = $db;
    }

    // create the terminal
    public function create()
    {
        $query = "Select terminal_reg_number FROM " . $this->table_name . "
                    WHERE 
                        terminal_reg_number = :reg_number ";

        $checkstmt = $this->conn->prepare($query);

        $this->reg_number=htmlspecialchars(strip_tags($this->reg_number));

        $checkstmt->bindParam(':reg_number', $this->reg_number);

        $checkstmt->execute();

        // get retrieved result
        $result = $checkstmt->fetch(PDO::FETCH_ASSOC);

        if (isset($result["terminal_reg_number"])) {
            return "duplicate";
        } else {
        // insert query
            $query = "INSERT INTO
                        " . $this->table_name . "
                        (terminal_id, terminal_reg_number, terminal_name, terminal_network_address, terminal_network_name, terminal_mac_address, terminal_is_active, terminal_description, location_id) VALUES (NULL,:reg_number,:name,:network_address,:network_name,:mac_address,:status,:description,:location_id)";

            // prepare query statement
            $stmt = $this->conn->prepare($query);

            // sanitize
            $this->reg_number = htmlspecialchars(strip_tags($this->reg_number));
            $this->name = htmlspecialchars(strip_tags($this->name));
            $this->network_address = htmlspecialchars(strip_tags($this->network_address));
            $this->network_name = htmlspecialchars(strip_tags($this->network_name));
            $this->mac_address = htmlspecialchars(strip_tags($this->mac_address));
            $this->status = htmlspecialchars(strip_tags($this->status));
            $this->description = htmlspecialchars(strip_tags($this->description));
            $this->location_id = htmlspecialchars(strip_tags($this->location_id));

            // bind new values
            $stmt->bindParam(':reg_number', $this->reg_number);
            $stmt->bindParam(':name', $this->name);
            $stmt->bindParam(':network_address', $this->network_address);
            $stmt->bindParam(':network_name', $this->network_name);
            $stmt->bindParam(':mac_address', $this->mac_address);
            $stmt->bindParam(':status', $this->status);
            $stmt->bindParam(':description', $this->description);
            $stmt->bindParam(':location_id', $this->location_id);

            // execute the query
            if ($stmt->execute()) {
                return true;
            }

            return false;
        }
    }

    // read terminals
    public function read($search = NULL)
    {
        // select all query
        $query = "SELECT
                    l.location_name as location_name, t.terminal_id, t.terminal_reg_number, t.terminal_network_address, t.terminal_network_name, t.terminal_mac_address, t.location_id, t.terminal_name, t.terminal_is_active, t.terminal_description
                FROM
                    " . $this->table_name . " t
                    LEFT JOIN
                        location l
                            ON t.location_id = l.location_id
                    WHERE
                        l.location_name LIKE ? OR t.terminal_reg_number LIKE ? OR t.terminal_network_address LIKE ? OR t.terminal_network_name LIKE ? OR t.terminal_mac_address LIKE ? OR t.terminal_name LIKE ? OR t.terminal_description LIKE ?
                    ORDER BY
                        t.terminal_id DESC";

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

    // read one terminal
    public function readOne()
    {
        // query to read single record
        $query = "SELECT
                    l.location_name as location_name, t.terminal_id, t.terminal_reg_number, t.terminal_network_address, t.terminal_network_name, t.terminal_mac_address, t.location_id, t.terminal_name, t.terminal_is_active, t.terminal_description
                FROM
                    " . $this->table_name . " t
                LEFT JOIN
                    location l
                        ON t.location_id = l.location_id
                WHERE
                    t.terminal_id = ?
                LIMIT
                    0,1";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // bind id of terminal to be updated
        $stmt->bindParam(1, $this->id);

        // execute query
        $stmt->execute();

        // get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->id = $row["terminal_id"];
        $this->reg_number = $row["terminal_reg_number"];
        $this->name = $row['terminal_name'];
        $this->network_address = $row['terminal_network_address'];
        $this->network_name = $row['terminal_network_name'];
        $this->mac_address = $row['terminal_mac_address'];
        $this->status = $row['terminal_is_active'];
        $this->description = $row['terminal_description'];
        $this->location_id = $row['location_id'];
        $this->location_name = $row['location_name'];

     }

    // update the terminal
    public function update()
    {
        // check if the terminal reg number already exists
        $query = "Select terminal_reg_number FROM " . $this->table_name . "
                    WHERE 
                        terminal_reg_number = :reg_number AND terminal_id <> :id";

        $checkstmt = $this->conn->prepare($query);

        $this->reg_number=htmlspecialchars(strip_tags($this->reg_number));
        $this->id=htmlspecialchars(strip_tags($this->id));

        $checkstmt->bindParam(':reg_number', $this->reg_number);
        $checkstmt->bindParam(':id', $this->id);

        $checkstmt->execute();

        // get retrieved result
        $result = $checkstmt->fetch(PDO::FETCH_ASSOC);

        if (isset($result["terminal_reg_number"])) {
            return "duplicate";
        } else {
            // update query
            $query = "UPDATE
                        " . $this->table_name . "
                    SET
                        terminal_name = :name,
                        terminal_reg_number = :reg_number,
                        terminal_network_address = :network_address,
                        terminal_network_name = :network_name,
                        terminal_mac_address = :mac_address,
                        terminal_is_active = :status,
                        terminal_description = :description,
                        location_id = :location_id
                    WHERE
                        terminal_id = :id";

            // prepare query statement
            $stmt = $this->conn->prepare($query);

            // sanitize
            $this->name = htmlspecialchars(strip_tags($this->name));
            $this->reg_number = htmlspecialchars(strip_tags($this->reg_number));
            $this->network_address = htmlspecialchars(strip_tags($this->network_address));
            $this->network_name = htmlspecialchars(strip_tags($this->network_name));
            $this->mac_address = htmlspecialchars(strip_tags($this->mac_address));
            $this->status = htmlspecialchars(strip_tags($this->status));
            $this->description = htmlspecialchars(strip_tags($this->description));
            $this->location_id = htmlspecialchars(strip_tags($this->location_id));
            $this->id = htmlspecialchars(strip_tags($this->id));

            // bind new values
            $stmt->bindParam(':name', $this->name);
            $stmt->bindParam(':reg_number', $this->reg_number);
            $stmt->bindParam(':network_address', $this->network_address);
            $stmt->bindParam(':network_name', $this->network_name);
            $stmt->bindParam(':mac_address', $this->mac_address);
            $stmt->bindParam(':status', $this->status);
            $stmt->bindParam(':description', $this->description);
            $stmt->bindParam(':location_id', $this->location_id);
            $stmt->bindParam(':id', $this->id);

            // execute the query
            if ($stmt->execute()) {
                return true;
            }

            return false;
        }
    }

    // delete the terminal
    public function delete()
    {
        // delete query
        $query = "DELETE FROM " . $this->table_name . " WHERE terminal_id = ?";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->id = htmlspecialchars(strip_tags($this->id));

        // bind id of terminal to delete
        $stmt->bindParam(1, $this->id);

        // execute query
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }
}
