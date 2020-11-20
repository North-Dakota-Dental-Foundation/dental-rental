const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
    rejectUnauthenticated,
  } = require("../modules/authentication-middleware");

/**
 * GET route template
 */
router.get('/', (req, res) => {
    console.log("GET /inventory");
    const queryText = 'SELECT * from "equipment" order by name;';
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
    if (req.isAuthenticated() === false){
        res.sendStatus(403);
        return;
    }
const queryText = `INSERT INTO "equipment" ("equipment_item", "serial_number", "nddf_code") VALUES ($1,$2,$3)`;
const queryValue = [req.body.id];
pool
    .query(queryText,queryValue)
    .then ((result) => {
        res.sendStatus(201);
    })
    .catch((error) => {
        console.log(`Error on query to the list table ${error}`);
        res.sendStatus(500);
    });
});

router.put('/:id', (req, res) => {
    console.log("Updating Status of Equipment", id);
    let queryText = `UPDATE "equipment" SET "status" WHERE "id" = $1;`;
    pool   
        .query(queryText, [id])
        .then((result) => {
            console.log("Equipment Status was updated.", result);
            res.sendStatus(200);
        })
        .catch((error)=> {
            console.log(error);
        })

  });

  router.delete("/:id", rejectUnauthenticated, (req, res) => {
      console.log(req.user, req.params);
      console.log(
          `Deleting Equipment with ID ${req.params.id} by User ${req.user.name}`
      );
      let queryText = `DELETE FROM equipment WHERE id = $1;`;
      pool
        .query(queryText, [req.params.id])
        .then((result) => {
            res.sendStatus(204);
        })
        .catch((error) => {
            console.log("Error in deleting message,", error);
            res.sendStatus(500);

        });
  });

module.exports = router;