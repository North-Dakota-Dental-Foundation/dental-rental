const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

/**
 * GET route template
 */
router.get('/', rejectUnauthenticated, (req, res) => {
    res.send(200);
    console.log('Hello world!')
});// End of GET route


/**
 * POST route template
 */
router.post("/", rejectUnauthenticated, (req, res) => {
  console.log("IN POST");
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
