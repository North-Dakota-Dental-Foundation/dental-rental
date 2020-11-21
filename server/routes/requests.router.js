const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

/**
 * GET route template
 */
router.get("/", rejectUnauthenticated, (req, res) => {
  const queryText = 'SELECT * from "requests"';
  pool
    .query(queryText)
    .then((result) => res.send(result.rows))
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
}); // End of GET route

/**
 * POST route template
 */
router.post("/", rejectUnauthenticated, (req, res) => {
  if (req.isAuthenticated() === false) {
    res.sendStatus(403);
    return;
  }
  res.send(201);
}); // End of POST route

/**
 * PUT route template
 */
router.put("/", rejectUnauthenticated, (req, res) => {
  console.log("IN PUT");
  res.send(200);
}); // End of PUT route

module.exports = router;
