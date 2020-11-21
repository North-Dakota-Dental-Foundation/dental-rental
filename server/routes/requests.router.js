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
router.post("/", rejectUnauthenticated, async (req, res) => {
  if (req.isAuthenticated() === false) {
    res.sendStatus(403);
    return;
  }
  // requests, equipment, equipment_request table
  //
  // practices, poses,    practices_poses
  try {
    const {
      company,
      address,
      point_of_contact,
      email,
      phone_number,
      city,
      state,
      zip,
      start_date,
      end_date,
      purpose,
      equipment_in_request,
    } = req.body;

    console.log(
      company,
      address,
      point_of_contact,
      email,
      phone_number,
      city,
      state,
      zip,
      start_date,
      end_date,
      purpose,
      equipment_in_request
    );

    const status = "PENDING";

    //equipment, company, address, point_of_contact, email, phone_number, city, state, zip
    // start date, end date, purpose, status

    const newRequest = await pool.query(
      "INSERT INTO requests (company, address, point_of_contact, email, phone_number, city, state, zip, start_date, end_date, purpose, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *",
      [
        company,
        address,
        point_of_contact,
        email,
        phone_number,
        city,
        state,
        zip,
        start_date,
        end_date,
        purpose,
        status,
      ]
    );

    const requestId = newRequest.rows[0].id;
    console.log("new request id", requestId);

    // for each equipment item in the equipment_in_request variable, link the request and each equipment item
    // by inserting into the equipment_requests junction table
    equipment_in_request.map(async (equipmentObj) => {
      console.log(equipmentObj.id);
      const newEquipmentRequest = await pool.query(
        "INSERT INTO equipment_requests (equipment_id, request_id) VALUES ($1,$2) RETURNING *",
        [equipmentObj.id, requestId]
      );
    });
    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(500);
    console.error(err.message);
  }
}); // End of POST route

/**
 * PUT route template
 */

//pending, rejected, approved, completed
router.put("/:id", rejectUnauthenticated, (req, res) => {
  console.log("Updating Request Status", id);
  let queryText = `UPDATE "requests" SET "status" WHERE "id" = $1;`;
  pool
    .query(queryText, [id])
    .then((result) => {
      console.log("Request Status has been updated.", result);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log(error);
    });

  res.send(200);
}); // End of PUT route

router.delete("/:id", rejectUnauthenticated, (req, res) => {
  console.log(req.requests, req.params);
  console.log(
    `Deleting Equipment with ID ${req.params.id} by User ${req.requests.name}`
  );
  let queryText = `DELETE FROM requests WHERE id = $1;`;
  pool
    .query(queryText, [req.params.id])
    .then((result) => {
      res.sendStatus(204);
    })
    .catch((error) => {
      console.log("Error in deleting request,", error);
      res.sendStatus(500);
    });
});

module.exports = router;
