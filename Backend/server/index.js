const express = require('express');
const app = express();
const connectDB = require('./config/db');

const client = require('./config/chromadb');
require('dotenv').config()
const PORT = process.env.PORT;
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});