const Applicant = require("../Mongo schemas/applicants");
const Job = require("../Mongo schemas/job");
const multer = require("multer");
const path = require("path");
const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const { OpenAIEmbeddings } = require("@langchain/openai");
const { v4: uuidv4 } = require("uuid");
const chromaClient = require("../config/chromadb");

// --- MULTER CONFIGURATION ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // This assumes your 'public' folder is inside 'server'
    cb(null, "server/public/Resume");
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
    const { name, email, jobId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a resume" });
    }

    const newApplicant = await Applicant.create({
      name,
      email,
      resume: req.file.path,
    });

    // Extract the job by jobId and increment applicantCount by 1
    const job = await Job.findById(jobId);
    job.applicantCount = job.applicantCount + 1;
    await job.save();

    // --- EMBEDDING LOGIC ---
    // 1. Load the PDF
    const documentLoader = new PDFLoader(req.file.path);
    const rawDocs = await documentLoader.load();

    // 2. Split the text into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splitDocs = await textSplitter.splitDocuments(rawDocs);

    // 3. Prepare arrays for ChromaDB
    const ids = [];
    const embeddings = [];
    const metadatas = [];
    const documents = [];

    const embeddingsModel = new OpenAIEmbeddings();

    // 4. Process each chunk
    for (const doc of splitDocs) {
      const chunkId = uuidv4();
      const vector = await embeddingsModel.embedQuery(doc.pageContent);

      ids.push(chunkId);
      embeddings.push(vector);

      // Link the vector to the MongoDB Applicant schema
      metadatas.push({
        applicantId: newApplicant._id.toString()
      });

      documents.push(doc.pageContent);
    }

    // 5. Save to Chroma
    const collection = await chromaClient.getCollection({ name: "resume_embeddings" });
    await collection.add({
      ids: ids,
      embeddings: embeddings,
      metadatas: metadatas,
      documents: documents,
    });
    // --- END ELMBEDDING LOGIC ---

    res.status(201).json({
      message: "Applicant registered successfully and resume embedded!",
      data: newApplicant,
    });
  } catch (error) {
    console.error("Error during applicant creation or embedding:", error);
    res.status(500).json({ error: error.message });
  }
};

// --- YOU CAN NOW ADD ADMIN FUNCTIONS BELOW USING THE SAME STYLE ---
// exports.createAdmin = async (req, res) => { ... }