const cron = require('node-cron');
const Job = require('../../Mongo schemas/job');
const Applicant = require('../../Mongo schemas/applicants');
const recruiterGraph = require('../Langraph');

// This node receives the graph 'state' and schedules a cron job 
const waitingNode = async (state) => {
    console.log(`Scheduling daily check for job: ${state.jobId}`);

    // Schedule a cron job for this specific workflow execution
    const task = cron.schedule('0 * * * * *', async () => {
        console.log("Running check for 7-day mature jobs...");

        // 1. Calculate the exact time 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        try {
            // 2. Find the job by state.jobId
            const job = await Job.findById(state.jobId);

            if (job) {
                // To test immediately, you can remove the check or set it to a future date
                // if (job.createdAt <= sevenDaysAgo) {
                state.matchCount = job.applicantCount; // Use correct field from schema
                const config = {
                    configurable: { thread_id: state.jobId.toString() }
                };

                // Stop this specific cron job so it doesn't keep running every day
                task.stop();

                // Resume the graph execution
                await recruiterGraph.invoke(state, config);
                // }
            }
        } catch (error) {
            console.error("Cron Job Error:", error);
        }
    });

    // Return state to let LangGraph know this node finished.
    // The graph will pause here because of interruptAfter: ["waitingnode"]
    return state;
};

module.exports = waitingNode;
