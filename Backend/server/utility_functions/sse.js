const { adminConnections } = require("../controller/Admin_controller.js");

const broadcastCountToAll = (count) => {
    const payload = {
        type: "COUNT_UPDATE",
        count: count,
        timestamp: new Date().toISOString()
    };


    adminConnections.forEach((res, adminId) => {
        try {
            // Write to the specific stream
            res.write(`data: ${JSON.stringify(payload)}\n\n`);
            console.log(`Broadcast sent to Admin: ${adminId}`);
        } catch (error) {
            console.error(`Failed to send to Admin ${adminId}:`, error);

        }
    });

    console.log(`Broadcast complete. Total recipients: ${adminConnections.size}`);
};

module.exports = { broadcastCountToAll };