const recruiterGraph = require("../Agents/Langraph");
const multer = require("multer");
const path = require("path");
const Job = require("../Mongo schemas/job");

// Multer config for JD uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "server/public/Job");
    },
    filename: (req, file, cb) => {
        cb(null, `jd-${Date.now()}${path.extname(file.originalname)}`);
    },
});
exports.uploadJD = multer({ storage });

// Upload JD + create job + invoke LangGraph
const uploadJob = async (req, res) => {
    try {
        const { title } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Please upload a JD file" });
        }

        // 1. Save the job in the DB
        const newJob = await Job.create({
            title,
            jdFileUrl: req.file.path,
        });

        // 2. Use the new job's _id as the thread_id for LangGraph
        const config = {
            configurable: { thread_id: newJob._id.toString() }
        };

        // 3. Invoke the graph with jdLink and jobId in the initial state
        await recruiterGraph.invoke(
            { jdLink: req.file.path, jobId: newJob._id.toString() },
            config
        );

        res.status(201).json({
            message: "Job created and graph invoked successfully!",
            jobId: newJob._id,
            threadId: newJob._id.toString(),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const adminConnections = new Map();


const connectAdminStream = async (req, res) => {

    const adminId = req.params.id;


    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');


    adminConnections.set(adminId, res);

    console.log(`Connection established for Admin: ${adminId}`);


    req.on('close', () => {
        adminConnections.delete(adminId);
        console.log(`Admin ${adminId} disconnected and removed from Map.`);
    });
};


const shortlistCandidates = async (req, res) => {
    try {
        const { threadId } = req.body;

        const config = {
            configurable: { thread_id: threadId }
        };

        // Inject reupload: "no" to ensure it routes to shortlist_candidates
        await recruiterGraph.invoke({ reupload: "no" }, config);

        res.status(200).json({ message: "Shortlisting started successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Reject JD and resubmit — reinvokes graph from extracting_requirements with new JD
const rejectAndResubmitJD = async (req, res) => {
    try {
        const { threadId } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Please upload a new JD file" });
        }

        const config = {
            configurable: { thread_id: threadId }
        };

        // Reinvoke the graph with the new jdLink in state, and set reupload to "yes" for conditional router
        await recruiterGraph.invoke({ jdLink: req.file.path, reupload: "yes" }, config);

        res.status(200).json({ message: "New JD submitted and graph restarted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// SSE Map for interview schedule push — stores adminId → res
const interviewConnections = new Map();

const connectInterviewStream = async (req, res) => {
    const userId = req.params.userId;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    interviewConnections.set(userId, res);

    console.log(`Interview stream connected for Admin: ${userId}`);

    req.on('close', () => {
        interviewConnections.delete(userId);
        console.log(`Admin ${userId} disconnected from interview stream.`);
    });
};

module.exports = {
    adminConnections,
    connectAdminStream,
    uploadJob,
    shortlistCandidates,
    rejectAndResubmitJD,
    interviewConnections,
    connectInterviewStream
};