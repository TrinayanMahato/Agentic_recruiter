const cron = require('node-cron');
const Job = require('./Mongo schemas/job');
const Applicant = require('./Mongo schemas/applicants');
const recruiterGraph = require('./Agents/Langraph');

// This cron job checks the database every day at Midnight ('0 0 * * *')
const startCronJobs = () => {
    // For testing purposes during development, you might want to use '* * * * *' (every minute)
    // and adjust the sevenDaysAgo variable below to test the wait logic.
    cron.schedule('0 0 * * *', async () => {
        console.log("Running daily check for 7-day mature jobs...");

        // 1. Calculate the exact time 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        try {
            // 2. Find all jobs that have been WAITING for longer than 7 days
            const jobsReadyToProcess = await Job.find({ _id: jobId });
            state.matchCount = jobsReadyToProcess.Applicant;




        } catch (error) {
            console.error("Cron Job Error:", error);
        }
    });
};

module.exports = startCronJobs;
