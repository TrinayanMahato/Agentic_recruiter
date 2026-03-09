const express = require('express');
const {
    connectAdminStream,
    uploadJD,
    uploadJob,
    shortlistCandidates,
    rejectAndResubmitJD,
    connectInterviewStream
} = require('../controller/Admin_controller.js');

const router = express.Router();

// SSE — admin subscribes to applicant count updates
router.get('/stream/:id', connectAdminStream);

// Upload JD, create job in DB, and invoke LangGraph
router.post('/upload-job', uploadJD.single('jd'), uploadJob);

// Admin approves shortlisting — resumes graph at shortlisting node
router.post('/shortlist', shortlistCandidates);

// Admin rejects JD, uploads a new one — reinvokes graph from extracting_requirements
router.post('/reject-jd', uploadJD.single('jd'), rejectAndResubmitJD);

// SSE — admin subscribes to real-time interview schedule pushes
router.get('/interview-stream/:userId', connectInterviewStream);

module.exports = router;