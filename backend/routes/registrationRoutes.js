const express = require("express");
const router = express.Router();
const { verifyToken } = require("./verifyToken");
const {
  createRegistration,
  getAllRegistrations
} = require("../controllers/registrationController");

router.post("/preregister", createRegistration);
router.get("/registrations", verifyToken, getAllRegistrations);

module.exports = router;