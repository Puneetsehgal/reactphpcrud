<?php
class Inventory
{

    // database connection and table name
    private $conn;
    private $table_name = "inventory";

    // object properties
    public $inventory_id;
    public $inventory_serial_number;
    public $inventory_hcs_number;
    public $inventory_date_purchase;
    public $inventory_is_active;
    public $inventory_notes;
    public $terminal_id;
    public $device_id;

    // constructor with $db as database connection
    public function __construct($db)
    {
        $this->conn = $db;
    }

    // create the inventory
    public function create()
    {
        $query = "Select inventory_serial_number FROM " . $this->table_name . "
                    WHERE 
                        inventory_serial_number = :serial_number";

        $checkstmt = $this->conn->prepare($query);
        $this->serial_number=htmlspecialchars(strip_tags($this->serial_number));
        $checkstmt->bindParam(':serial_number', $this->serial_number);

        $checkstmt->execute();

        // get retrieved result
        $result = $checkstmt->fetch(PDO::FETCH_ASSOC);

        if (isset($result["inventory_serial_number"])) {
        return "duplicate";
        } else {
            // insert query
            $query = "INSERT INTO
                        " . $this->table_name . "
                        (inventory_id, inventory_serial_number, inventory_hcs_number, inventory_date_purchase, inventory_is_active, inventory_notes, terminal_id, device_id) VALUES (NULL,:serial_number,:hcs_number,:purchase_date,:status,:notes,:terminal,:device)";

            // prepare query statement
            $stmt = $this->conn->prepare($query);

            // sanitize
            $this->serial_number = htmlspecialchars(strip_tags($this->serial_number));
            $this->hcs_number = htmlspecialchars(strip_tags($this->hcs_number));
            $this->purchase_date = htmlspecialchars(strip_tags($this->purchase_date));
            $this->status = htmlspecialchars(strip_tags($this->status));
            $this->notes = htmlspecialchars(strip_tags($this->notes));
            $this->terminal = htmlspecialchars(strip_tags($this->terminal));
            $this->device = htmlspecialchars(strip_tags($this->device));

            // bind new values
            $stmt->bindParam(':serial_number', $this->serial_number);
            $stmt->bindParam(':hcs_number', $this->hcs_number);
            $stmt->bindParam(':purchase_date', $this->purchase_date);
            $stmt->bindParam(':status', $this->status);
            $stmt->bindParam(':notes', $this->notes);
            $stmt->bindParam(':terminal', $this->terminal);
            $stmt->bindParam(':device', $this->device);

            // execute the query
            if ($stmt->execute()) {
                return true;
            }

            return false;
        }
    }

    // read inventory
    public function read($search = NULL)
    {
        // select all query
        $query = "SELECT
                    t.terminal_name as terminal_name, d.device_name as device_name, i.inventory_id, i.inventory_serial_number, i.inventory_hcs_number, i.inventory_date_purchase, i.inventory_is_active, i.inventory_notes, i.terminal_id, i.device_id
                FROM
                    " . $this->table_name . " i
                    LEFT JOIN
                        terminal t
                            ON i.terminal_id = t.terminal_id
                    LEFT JOIN
                        device d
                            ON i.device_id = d.device_id 
                    WHERE
                        t.terminal_name LIKE ? OR d.device_name LIKE ? OR i.inventory_id LIKE ? OR i.inventory_serial_number LIKE ? OR i.inventory_hcs_number LIKE ? OR i.inventory_date_purchase LIKE ? OR i.inventory_notes LIKE ?
                    ORDER BY
                        i.inventory_id DESC";

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

    // read one inventory
    public function readOne()
    {
        // query to read single record
        $query = "SELECT
                    t.terminal_name as terminal_name, t.location_id, l.location_name as location_name, l.organization_id, o.organization_name as organization_name, d.device_name as device_name, d.supplier_id, s.supplier_name as supplier_name, i.inventory_id, i.inventory_serial_number, i.inventory_hcs_number, i.inventory_date_purchase, i.inventory_is_active, i.inventory_notes, i.terminal_id, i.device_id
                    FROM
                         " . $this->table_name . " i
                    LEFT JOIN
                        terminal t
                            ON i.terminal_id = t.terminal_id
                    LEFT JOIN
                        device d
                            ON i.device_id = d.device_id
                    LEFT JOIN
                        supplier s
                            ON d.supplier_id = s.supplier_id
                    LEFT JOIN
                        location l
                            ON t.location_id = l.location_id
                    LEFT JOIN
                        organization o
                            ON l.organization_id = o.organization_id
                    WHERE
                        i.inventory_id = ?
                    LIMIT
                        0,1";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // bind id of inventory to be updated
        $stmt->bindParam(1, $this->id);

        // execute query
        $stmt->execute();

        // get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->id = $row["inventory_id"];
        $this->serial_number = $row["inventory_serial_number"];
        $this->hcs_number = $row["inventory_hcs_number"];
        $this->purchase_date = $row["inventory_date_purchase"];
        $this->status = $row["inventory_is_active"];
        $this->notes = $row["notes"];
        $this->terminal_id = $row["terminal_id"];
        $this->terminal_name = $row["terminal_name"];
        $this->device_id = $row["device_id"];
        $this->device_name = $row["device_name"];
        $this->supplier_id = $row["supplier_id"];
        $this->supplier_name = $row["supplier_name"];
        $this->location_id = $row["location_id"];
        $this->location_name = $row["location_name"];
        $this->organization_id = $row["organization_id"];
        $this->organization_name = $row["organization_name"];
    }

    // update the location
    public function update()
    {
        $query = "Select inventory_serial_number FROM " . $this->table_name . "
                    WHERE 
                        inventory_serial_number = :serial_number AND inventory_id <> :id";

        $checkstmt = $this->conn->prepare($query);

        $this->serial_number=htmlspecialchars(strip_tags($this->serial_number));
        $this->id=htmlspecialchars(strip_tags($this->id));

        $checkstmt->bindParam(':serial_number', $this->serial_number);
        $checkstmt->bindParam(':id', $this->id);
        $checkstmt->execute();

        // get retrieved row
        $result = $checkstmt->fetch(PDO::FETCH_ASSOC);

        if (isset($result["inventory_serial_number"])) {
            return "duplicate";
        } else {
            // update query
            $query = "UPDATE
                        " . $this->table_name . "
                    SET
                    inventory_serial_number = :serial_number,
                    inventory_hcs_number = :hcs_number,
                    inventory_date_purchase = :purchase_date,
                    inventory_is_active = :status,
                    inventory_notes = :notes,
                    terminal_id = :terminal,
                    device_id = :device
                    WHERE
                    inventory_id = :id";

            // prepare query statement
            $stmt = $this->conn->prepare($query);

            // sanitize
            $this->id = htmlspecialchars(strip_tags($this->id));
            $this->serial_number = htmlspecialchars(strip_tags($this->serial_number));
            $this->hcs_number = htmlspecialchars(strip_tags($this->hcs_number));
            $this->purchase_date = htmlspecialchars(strip_tags($this->purchase_date));
            $this->status = htmlspecialchars(strip_tags($this->status));
            $this->notes = htmlspecialchars(strip_tags($this->notes));
            $this->terminal = htmlspecialchars(strip_tags($this->terminal));
            $this->device = htmlspecialchars(strip_tags($this->device));

            // bind new values
            $stmt->bindParam(':serial_number', $this->serial_number);
            $stmt->bindParam(':hcs_number', $this->hcs_number);
            $stmt->bindParam(':purchase_date', $this->purchase_date);
            $stmt->bindParam(':status', $this->status);
            $stmt->bindParam(':notes', $this->notes);
            $stmt->bindParam(':terminal', $this->terminal);
            $stmt->bindParam(':device', $this->device);
            $stmt->bindParam(':id', $this->id);

            // execute the query
            if ($stmt->execute()) {
                return true;
            }

            return false;
        }
    }

    // delete the inventory
    public function delete()
    {
        // delete query
        $query = "DELETE FROM " . $this->table_name . " WHERE inventory_id = ?";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->id = htmlspecialchars(strip_tags($this->id));

        // bind id of inventory to delete
        $stmt->bindParam(1, $this->id);

        // execute query
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }
}
