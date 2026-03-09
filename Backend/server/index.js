const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

const connectDB = require('./config/db');

const client = require('./config/chromadb');
const applicantRouter = require('./routes/Applicant_router');
const adminRouter = require('./routes/Admin_router');
require('dotenv').config();
const PORT = process.env.port || 3000;
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(express.json());
async function initializeChroma() {

  const collection = await client.getOrCreateCollection({
    name: "JD_embeddings",
  });

  const resumeCollection = await client.getOrCreateCollection({
    name: "resume_embeddings",
  });

  console.log("ChromaDB is ready!");
  return collection;
}

initializeChroma();
connectDB();

app.use("/api/applicants", applicantRouter);
app.use("/api/admin", adminRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});