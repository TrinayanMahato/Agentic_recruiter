// Define the Map outside the function to persist across requests
const adminConnections = new Map();

const connectAdminStream = async (req, res) => {
    // 1. Get adminId from the request parameters (e.g. /stream/:id)
    const adminId = req.params.id;

    // 2. Set SSE Headers immediately to keep the connection open
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 3. Store the ID and Response object in the Map
    adminConnections.set(adminId, res);

    console.log(`Connection established for Admin: ${adminId}`);

    // 4. Handle Disconnection
    req.on('close', () => {
        adminConnections.delete(adminId);
        console.log(`Admin ${adminId} disconnected and removed from Map.`);
    });
};

module.exports = {
    adminConnections,
    connectAdminStream
};