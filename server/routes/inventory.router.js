const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

/**
 * GET route template
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
 * POST route template
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
  const { equipment_status } = req.body;
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
