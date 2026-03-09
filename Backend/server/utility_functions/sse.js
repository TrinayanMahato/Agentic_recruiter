const { adminConnections, interviewConnections } = require("../controller/Admin_controller.js");
const InterviewSchedule = require("../Mongo schemas/interview_scheduled.js");

const broadcastCountToAll = (count) => {
    const payload = {
        type: "COUNT_UPDATE",
        count: count,
        timestamp: new Date().toISOString()
    };


    adminConnections.forEach((res, adminId) => {
        try {
            res.write(`data: ${JSON.stringify(payload)}\n\n`);
            console.log(`Broadcast sent to Admin: ${adminId}`);
        } catch (error) {
            console.error(`Failed to send to Admin ${adminId}:`, error);
        }
    });

    console.log(`Broadcast complete. Total recipients: ${adminConnections.size}`);
};

// Fetches all interview data from DB and pushes to every connected admin via SSE
const broadcastInterviewData = async () => {
    try {
        const interviews = await InterviewSchedule.find({});

        const payload = {
            type: "INTERVIEW_SCHEDULED",
            data: interviews,
            timestamp: new Date().toISOString()
        };

        interviewConnections.forEach((res, userId) => {
            try {
                res.write(`data: ${JSON.stringify(payload)}\n\n`);
                console.log(`Interview data sent to Admin: ${userId}`);
            } catch (error) {
                console.error(`Failed to send interview data to Admin ${userId}:`, error);
            }
        });

        console.log(`Interview broadcast complete. Total recipients: ${interviewConnections.size}`);
    } catch (error) {
        console.error("broadcastInterviewData error:", error);
    }
};

module.exports = { broadcastCountToAll, broadcastInterviewData };