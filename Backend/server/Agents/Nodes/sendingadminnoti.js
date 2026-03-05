const Job = require('../../Mongo schemas/job.js'); // Adjust path based on your folder structure
const { broadcastCountToAll } = require('../../utility_functions/sse.js');

/**
 * Node: sendingadminnoti
 * Retrieves the job applicant count and triggers the SSE broadcast.
 */
const sendingAdminNoti = async (state) => {
    // 1. Extract jobId from the graph state
    // Note: Since RecruiterState uses { value: null }, check if you access it via state.jobId or state.jobId.value
    const jobId = state.jobId;

    if (!jobId) {
        console.error("No jobId found in graph state.");
        return state;
    }

    try {
        // 2. Retrieve the job document from MongoDB
        const job = await Job.findById(jobId);

        if (!job) {
            console.error(`Job with ID ${jobId} not found in database.`);
            return state;
        }

        // 3. Extract the count from the schema field 'applicantCount'
        const count = job.applicantCount;

        // 4. Trigger the SSE broadcast to all connected admins
        // This uses the utility function you just created
        broadcastCountToAll(count);

        console.log(`Node execution: Notified admins of ${count} applicants for job ${job.title}`);

        // 5. Update the state to reflect that the admin has been notified
        return {
            ...state,
            applicationStatus: "NOTIFIED_ADMIN"
        };

    } catch (error) {
        console.error("Error in sendingadminnoti node:", error);
        // Return original state if the database or broadcast fails
        return state;
    }
};

module.exports = sendingAdminNoti;