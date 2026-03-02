const { ChromaClient } = require('chromadb');

const client = new ChromaClient({ path: "http://localhost:8000" });

// Export the client so other files can use it
module.exports = client;