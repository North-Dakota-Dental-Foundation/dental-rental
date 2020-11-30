const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const { request } = require("express");

/**
 * GET route
 */
router.get("/", rejectUnauthenticated, async (req, res) => {
  try {
    const allRequests = await pool.query(
    `SELECT "requests".id, "requests".company, "requests".address, "requests".point_of_contact, "requests".email, "requests".phone_number, "requests".city, "requests".state, "requests".zip, TO_CHAR("requests".start_date, 'mm/dd/yyyy') AS start_date, TO_CHAR("requests".end_date, 'mm/dd/yyyy') AS end_date, TO_CHAR("requests".applied_date, 'mm/dd/yyyy') AS applied_date, "requests".purpose, "requests".status FROM "requests" ORDER BY "requests".status;`);
    res.send(allRequests.rows);
  } catch (error) {
    res.sendStatus(500);
    console.error(error.message);
  }
}); // End of GET route

router.get("/all-equipment", rejectUnauthenticated, async (req, res) => {
  try {
    const allRequests = await pool.query(
      `SELECT id from "requests";`
    );
    const allRequestIds = allRequests.rows.map((obj) => {
      return obj.id;
    });
    // create an object of all requests with corresponding equipment items per request
    let allRequestsObj = {};
    for (let i = 0; i < allRequestIds.length; i++) {
      try {
        const allEquipmentPerRequest = await pool.query('SELECT "equipment".equipment_item FROM "equipment" JOIN "equipment_requests" ON "equipment_requests"."equipment_id" = "equipment"."id" JOIN "requests" ON "requests"."id" = "equipment_requests"."request_id" WHERE "requests".id = ($1)', [allRequestIds[i]]);
        allRequestsObj[allRequestIds[i]] = allEquipmentPerRequest.rows;
      } catch (error) {
        console.log(error);
      }
    }
    res.send([allRequestsObj]);
  } catch (error) {
    res.sendStatus(500);
    console.log(error)
  }
});

/**
 * POST route
 */
router.post("/", rejectUnauthenticated, async (req, res) => {
  if (req.isAuthenticated() === false) {
    res.sendStatus(403);
    return;
  }
  try {
    const {
      company, //string
      address, //string
      point_of_contact, //string
      email, //string
      phone_number, //number
      city, //string
      state, //string
      zip, //number
      start_date, //string
      end_date, //string
      applied_date,
      purpose, //string
      equipment_in_request, //arr of equipment in a particular request
    } = req.body;

    if( !(company && //string
      address && //string
      point_of_contact && //string
      email && //string
      phone_number && //number
      city && //string
      state && //string
      zip && //number
      start_date && //string
      end_date && //string
      purpose && //string
      applied_date && //string
      equipment_in_request)) {
      console.log('in error if');
      throw 'Error: there exists at least one parameter that is invalid.';
      }

    const status = "PENDING";

    const newRequest = await pool.query(
      "INSERT INTO requests (company, address, point_of_contact, email, phone_number, city, state, zip, start_date, end_date, applied_date, purpose, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *",
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
        applied_date,
        purpose,
        status,
      ]
    );

    const requestId = newRequest.rows[0].id;
    console.log("new request id", requestId);

    // for each equipment item in the equipment_in_request variable, link the request and each equipment item
    // by inserting into the equipment_requests junction table
    equipment_in_request.map(async (equipmentObj) => {
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
 * PUT route
 */
//pending, rejected, approved, completed
router.put("/:id", rejectUnauthenticated, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  let queryText = `UPDATE "requests" SET "status" = $1 WHERE "id" = $2;`;
  pool
    .query(queryText, [status, id])
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log(error);
    });
}); // End of PUT route

/**
 * DELETE route
 */
router.delete("/:id", rejectUnauthenticated, (req, res) => {
  // console.log(req.requests, req.params);
  // console.log(
  //   `Deleting Equipment with ID ${req.params.id} by User ${req.requests.name}`
  // );
  const { id } = req.params;

  //note: must delete from junction table first due to foreign key constraints
  let queryText_1 = `DELETE FROM "equipment_requests" WHERE "request_id" = $1;`;
  pool
    .query(queryText_1, [id])
    .then((result) => {
      console.log(
        "Successfully deleted request reference in equipment_requests junction table"
      );
    })
    .catch((error) => {
      console.log("Error in deleting request,", error);
      res.sendStatus(500);
    });

  let queryText_2 = `DELETE FROM "requests" WHERE "id" = $1;`;
  pool
    .query(queryText_2, [id])
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("Error in deleting request,", error);
      res.sendStatus(500);
    });
}); // End of DELETE route

module.exports = router;
