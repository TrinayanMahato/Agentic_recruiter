const { v4: uuidv4 } = require('uuid'); 
const { OpenAIEmbeddings } = require("@langchain/openai");
const client = require("../../config/chromadb"); 

const embeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-3-small", 
});

const storeJDEmbeddingsNode = async (state) => {
    console.log("--- Storing JD Requirements with Minimal Metadata ---");

    const requirements = state.topRequirements; 
    if (!requirements || requirements.length === 0) {
        throw new Error("No requirements found in state to embed.");
    }

    try {
        const collection = await client.getCollection({
            name: "JD_embeddings",
        });

        // 1. Generate 5 separate vectors for each requirement
        const vectors = await embeddings.embedDocuments(requirements);

        // 2. Generate unique UUIDs for each vector
        const ids = requirements.map(() => uuidv4());

        // 3. Store in ChromaDB with simplified metadata
        await collection.add({
            ids: ids,
            embeddings: vectors,
            metadatas: requirements.map(() => ({ 
                source: state.jdLink, // Link to the original JD PDF
                createdAt: new Date().toISOString() // Precise timestamp
            })),
            documents: requirements // Keep the raw requirement text for visibility
        });

        console.log(`✅ Stored ${requirements.length} requirement vectors successfully.`);

        return {
            matchCount: state.matchCount 
        };

    } catch (error) {
        console.error("❌ Error in storeJDEmbeddingsNode:", error);
        throw error;
    }
};

module.exports = storeJDEmbeddingsNode;