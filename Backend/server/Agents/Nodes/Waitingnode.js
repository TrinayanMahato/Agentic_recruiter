// server/utils/cronJobs.js
const cron = require('node-cron');
const Job = require('../models/Job');
const { app } = require('../Agents/graph'); // Your compiled LangGraph

// Runs every day at midnight
cron.schedule('0 0 * * *', async () => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Find jobs posted 7+ days ago that haven't been processed
    const jobsToNotify = await Job.find({id:jobId});

    
        await app.invoke(
            { jobId: job._id.toString() }, 
            { configurable: { thread_id: job._id.toString() } }
        );
        
        // Update DB so we don't notify twice
        job.status = 'NOTIFIED_ADMIN';
        await job.save();
    
});