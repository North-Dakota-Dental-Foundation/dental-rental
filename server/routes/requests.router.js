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

    const status = "pending";

    //equipment, company, address, point_of_contact, email, phone_number, city, state, zip
    // start date, end date, purpose, status

    //INSERT A REQUEST INTO requests table

    // UNCOMMENT BELOW:

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

    // //grab newPractice.rows.id to get the PRACTICE_ID
    // const practiceId = newPractice.rows[0].id;

    // //give order to the array of poses. this MUST be done due to the asynchronous nature of the map() method below
    // //the order of poses in the array does not guarantee that they will be inserted into the pose table in the same order
    // //solution: create a order column that keeps track of this for a given practice of a certain user
    // poses = poses.map((poseObj, index) => {
    //   poseObj["pose_order"] = index;
    //   return poseObj;
    // });

    // //for each pose in the pose array above,
    // //select the poses ID from the poses table
    // //INSERT INTO junction table with pose_id, practice_id, and pose_time
    // poses.map(async (poseObj) => {
    //   const result = await pool.query(
    //     "SELECT id FROM poses WHERE pose_name=$1",
    //     [poseObj.pose_name]
    //   );
    //   const poseId = result.rows[0].id;
    //   const poseTimeForGivenPractice = poseObj.time;
    //   const orderOfGivenPose = poseObj.pose_order;
    //   const newPracticePose = await pool.query(
    //     "INSERT INTO practices_poses (practice_id, pose_id, pose_time, pose_order) VALUES ($1,$2,$3,$4) RETURNING *",
    //     [practiceId, poseId, poseTimeForGivenPractice, orderOfGivenPose]
    //   );
    // });

    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(500);
    console.error(err.message);
  }
}); // End of POST route

/**
 * PUT route template
 */
router.put("/", rejectUnauthenticated, (req, res) => {
  console.log("IN PUT");
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
