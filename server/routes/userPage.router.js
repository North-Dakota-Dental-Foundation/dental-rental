const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

// GET all users route
router.get('/allusers', (req, res) => {
    console.log('Retrieving all users from dental_rental database');
    let queryText = (`
    SELECT "firstname", "lastname", "username", "phonenumber", "super_admin" FROM "user";
    `)
    pool.query(queryText)
    .then(result => {
      res.send(result.rows);
    })
      .catch(error => {
        console.log('Error obtaining users', error);
        res.sendStatus(418);
      });
  });

module.exports = router;