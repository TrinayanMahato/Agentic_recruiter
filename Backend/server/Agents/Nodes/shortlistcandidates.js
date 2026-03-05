const client = require("../../config/chromadb.js");
const Applicants = require("../../Mongo schemas/applicants.js");
const Shortlisted = require("../../Mongo schemas/Shortlisted_candidates.js");
const mongoose = require("mongoose"); // Needed for ObjectId conversion

const shortlistingNode = async (state) => {
    const requirementVectors = state.topRequirements;

    if (!requirementVectors || requirementVectors.length === 0) return state;

    try {
        const resumeCollection = await client.getCollection({ name: "resume_embeddings" });
        let allCandidateIds = [];

        // 1. Get 10 results for each of the 5 requirement vectors
        for (const vector of requirementVectors) {
            // FIX: Renamed this variable to avoid shadowing 'allCandidateIds'
            const queryResponse = await resumeCollection.query({
                queryEmbeddings: [vector],
                nResults: 10,
            });

            // Extract IDs from the first (and only) query result
            const idsFromThisQuery = queryResponse.metadatas[0].map(m => m.applicantId);
            allCandidateIds = [...allCandidateIds, ...idsFromThisQuery];
        }

        // 2. Frequency Map (same as your logic)
        const frequencyMap = allCandidateIds.reduce((acc, id) => {
            acc[id] = (acc[id] || 0) + 1;
            return acc;
        }, {});

        // 3. Get top 10 IDs
        const top10Ids = Object.keys(frequencyMap)
            .sort((a, b) => frequencyMap[b] - frequencyMap[a])
            .slice(0, 10);

        // 4. FIX: Convert String IDs to MongoDB ObjectIds to ensure the find() works
        const objectIds = top10Ids.map(id => new mongoose.Types.ObjectId(id));

        const candidatesFromDb = await Applicants.find({ _id: { $in: objectIds } });

        // 5. Save to Shortlisted Schema
        const shortlistedEntries = candidatesFromDb.map(c => ({
            name: c.name,
            email: c.email,
            applicantId: c._id,
            interviewTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }));

        if (shortlistedEntries.length > 0) {
            await Shortlisted.insertMany(shortlistedEntries);
        }

        // 6. Update Graph State
        return {
            ...state,
            shortlistedCandidates: shortlistedEntries,
            applicationStatus: "READY_FOR_REVIEW"
        };

    } catch (error) {
        console.error("Error during shortlisting:", error);
        return state;
    }
};

module.exports = shortlistingNode;