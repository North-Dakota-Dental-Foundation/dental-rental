const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

// GET all users route
router.get('/allusers', rejectUnauthenticated, (req, res) => {
    console.log('Retrieving all users from dental_rental database');
    let queryText = (`
    SELECT "id", "firstname", "lastname", "username", "phonenumber", "super_admin" FROM "user";
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

  // DELETE user route
router.delete('/deleteuser/:id', rejectUnauthenticated,(req, res) => {
    console.log(`Deleting user with ID ${req.params.id} from dental_rental database`);
    let queryText = `DELETE FROM "user" WHERE "id" = $1`;
    pool.query(queryText, [req.params.id])
      .then(result => {
        res.sendStatus(204);
      })
      .catch(err => {
        console.log('Error deleting user', err);
        res.sendStatus(418);
      });
  });

module.exports = router;