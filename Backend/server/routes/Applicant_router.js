const express = require("express");
const router = express.Router();

// Destructure the named exports from your controller file
const { upload, createApplicant } = require("../controller/Applicants_controller");

// Route for applicant registration
router.post("/register", upload.single("resume"), createApplicant);

module.exports = router;