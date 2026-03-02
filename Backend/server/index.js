const express = require('express');
const app = express();
const connectDB = require('./config/db');

const client = require('./config/chromadb');
require('dotenv').config()
const PORT = process.env.PORT;


app.use(express.json());
async function initializeChroma() {
 
  const collection = await client.getOrCreateCollection({
    name: "JD_embeddings",
  });
  
  console.log("ChromaDB is ready!");
  return collection;
}

initializeChroma();
connectDB();


app.get('/', (req, res) => {
  res.send('Hello, World! Your API is alive.');
});


app.post('/data', (req, res) => {
  const receivedData = req.body;
  res.json({
    message: "Data received successfully!",
    data: receivedData
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});