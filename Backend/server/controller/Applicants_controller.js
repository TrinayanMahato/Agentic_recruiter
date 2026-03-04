const Applicant = require("../Mongo schemas/applicants");
const multer = require("multer");
const path = require("path");

// --- MULTER CONFIGURATION ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // This assumes your 'public' folder is inside 'server'
    cb(null, "server/public/uploads"); 
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// We export the upload middleware so the router can use it
exports.upload = multer({ storage: storage });

// --- APPLICANT CONTROLLER ---

exports.createApplicant = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a resume" });
    }

    const newApplicant = await Applicant.create({
      name,
      email,
      resume: req.file.path, 
    });

    res.status(201).json({
      message: "Applicant registered successfully!",
      data: newApplicant,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- YOU CAN NOW ADD ADMIN FUNCTIONS BELOW USING THE SAME STYLE ---
// exports.createAdmin = async (req, res) => { ... }