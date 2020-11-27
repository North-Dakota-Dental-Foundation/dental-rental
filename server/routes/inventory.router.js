const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
let moment = require("moment");

/**
 * GET all inventory
 */
router.get("/", (req, res) => {
  console.log("GET /inventory");
  const queryText = 'SELECT * from "equipment" order by equipment_item;';
  pool
    .query(queryText)
    .then((result) => res.send(result.rows))
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});



/**
 * GET all inventory, filtered by status
 */
router.get('/filterinv/:equipment_status?', (req, res) => { // "req.params" should come in as a number
  console.log("GET filtered inventory from /api/inventory/filterinv");

  const equipmentStatus = req.params.equipment_status || 0;

  console.log(`Equipment status = ${equipmentStatus}`);

  if (req.params.equipment_status == 0) { // Sets the SQL code that will be querried
    SQLStatus = 'Available';
  } else if (req.params.equipment_status == 1) {
    SQLStatus = 'Checked-Out';
  } else if (req.params.equipment_status == 2) {
    SQLStatus = 'Shipped';
  } else if (req.params.equipment_status == 3) {
    SQLStatus = 'In-Inspection';
  } else if (req.params.equipment_status == 4) {
    SQLStatus = 'Missing';
  }

  const queryText = 'SELECT * FROM "equipment" WHERE equipment_status = $1 ORDER BY "equipment_item";'; //Must recieve set equipment status string
  pool
    .query(queryText, [SQLStatus]) // Pass in "SQL" string as a search parameter
    .then((result) => res.send(result.rows))
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});



/**
 * GET (technically a POST) all equipment by date range
 */
router.post("/all-inventory-by-date-range/", (req, res) => {
  const { endDate, startDate } = req.body; //date format: yyyy-mm-dd
  const startDateBuffered = moment(startDate).subtract(2, "week").format();
  const endDateBuffered = moment(endDate).add(2, "week").format();
  console.log(startDateBuffered, endDateBuffered);

  const queryText = `SELECT "equipment".* FROM "equipment" WHERE "equipment".id NOT IN (SELECT DISTINCT "equipment".id FROM "equipment" JOIN "equipment_requests" ON "equipment_requests"."equipment_id" = "equipment"."id" JOIN "requests" ON "requests"."id" = "equipment_requests"."request_id" WHERE "requests".start_date <= ($1) AND "requests".end_date >= ($2) AND "requests".status IN ('PENDING', 'APPROVED') )`;
  pool
    .query(queryText, [endDateBuffered, startDateBuffered])
    .then((result) => res.send(result.rows))
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
}); // end of GET

/**
 * POST an inventory item
 */
router.post("/", rejectUnauthenticated, (req, res) => {
  console.log("POST /inventory");

  const { equipment_item, serial_number, nddf_code } = req.body;
  const equipment_status = "AVAILABLE";

  if (req.isAuthenticated() === false) {
    res.sendStatus(403);
    return;
  }
  const queryText = `INSERT INTO "equipment" ("equipment_item", "equipment_status", "serial_number", "nddf_code") VALUES ($1,$2,$3,$4)`;
  pool
    .query(queryText, [
      equipment_item,
      equipment_status,
      serial_number,
      nddf_code,
    ])
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((error) => {
      console.log(`Error on query to the list table ${error}`);
      res.sendStatus(500);
    });
});

// FUTURE FEATURE (TODO): The ability to edit any of the equipment properties
router.put("/:id", (req, res) => {
  const { id } = req.params;
  let { equipment_status } = req.body;
  equipment_status = equipment_status.toUpperCase();
  console.log("Updating Status of Equipment", id);
  let queryText = `UPDATE "equipment" SET "equipment_status" = $1 WHERE "id" = $2;`;
  pool
    .query(queryText, [equipment_status, id])
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.delete("/:id", rejectUnauthenticated, (req, res) => {
  const { id } = req.params;
  console.log(`Deleting Equipment with ID ${id}`);
  let queryText = `DELETE FROM "equipment" WHERE "id" = $1;`;
  pool
    .query(queryText, [id])
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("Error in deleting inventory,", error);
      res.sendStatus(500);
    });
});

module.exports = router;
