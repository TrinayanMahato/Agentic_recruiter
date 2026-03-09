import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminStream = () => {
    const [messages, setMessages] = useState([]);
    const [status, setStatus] = useState("Connecting...");
    const [newJdFile, setNewJdFile] = useState(null);

    const handleProceed = async () => {
        const threadId = localStorage.getItem("threadId");
        if (!threadId) {
            alert("No Thread ID found! Did you upload a JD first?");
            return;
        }

        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/admin/shortlist`, { threadId });
            alert("Successfully unpaused the graph! Shortlisting candidates now.");
            setMessages([]); // Clear messages to signify action taken
        } catch (error) {
            console.error("Proceed error:", error);
            alert("Failed to proceed: " + (error.response?.data?.message || error.message));
        }
    };

    const handleReupload = async () => {
        const threadId = localStorage.getItem("threadId");
        if (!threadId) {
            alert("No Thread ID found! Did you upload a JD first?");
            return;
        }
        if (!newJdFile) {
            alert("Please select a new JD file to upload first!");
            return;
        }

        const formData = new FormData();
        formData.append("jd", newJdFile);
        formData.append("threadId", threadId);

        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/admin/reject-jd`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            alert("New JD submitted! The AI is restarting the pipeline.");
            setMessages([]); // Clear messages
            setNewJdFile(null); // Reset file input
        } catch (error) {
            console.error("Reupload error:", error);
            alert("Failed to re-upload JD: " + (error.response?.data?.message || error.message));
        }
    };

    useEffect(() => {
        // You can dynamically get adminId from auth context or local storage. Using a mock ID here.
        const adminId = "admin-123";

        const eventSource = new EventSource(`${import.meta.env.VITE_API_BASE_URL}/api/admin/stream/${adminId}`);

        eventSource.onopen = () => {
            setStatus("Connected to Admin Stream (Live)");
        };

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("Admin Stream Event:", data);
                setMessages((prev) => [...prev, data]);
            } catch (error) {
                // Handle plain text messages if they aren't JSON
                setMessages((prev) => [...prev, { raw: event.data }]);
            }
        };

        eventSource.onerror = (error) => {
            console.error("SSE Connection Error:", error);
            setStatus("Connection Error / Disconnected");
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101622] min-h-screen p-8 font-sans text-slate-900 dark:text-slate-100">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                    <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#1152d4]">podcasts</span>
                        Admin Notifications Stream
                    </h1>
                    <div className="flex items-center gap-2 mb-6">
                        <div className={`w-2.5 h-2.5 rounded-full ${status.includes("Connected") ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{status}</span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 min-h-[300px] max-h-[500px] overflow-y-auto space-y-3">
                        {messages.length === 0 ? (
                            <p className="text-slate-400 text-center py-10 font-medium">Waiting for notifications...</p>
                        ) : (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    {messages.map((msg, index) => (
                                        <div key={index} className="bg-white dark:bg-slate-900 p-3 rounded shadow-sm text-sm border-l-4 border-[#1152d4]">
                                            <pre className="whitespace-pre-wrap font-mono text-xs">{JSON.stringify(msg, null, 2)}</pre>
                                        </div>
                                    ))}
                                </div>

                                {/* HUMAN IN THE LOOP DECISION UI */}
                                <div className="bg-[#f8f9fc] dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 mt-6">
                                    <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-200">
                                        Required Action: Do you want to proceed with shortlisting, or change the JD?
                                    </h3>

                                    <div className="flex flex-col gap-5">
                                        {/* YES: PROCEED */}
                                        <button
                                            onClick={handleProceed}
                                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-5 rounded-lg transition-colors w-full sm:w-auto text-left flex items-center justify-center sm:justify-start gap-2 shadow-sm"
                                        >
                                            <span className="material-symbols-outlined">check_circle</span>
                                            Yes, Proceed with Shortlisting
                                        </button>

                                        {/* NO: RE-UPLOAD */}
                                        <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                                            <p className="font-semibold text-sm mb-3">No, I want to change the JD:</p>
                                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                                <input
                                                    type="file"
                                                    onChange={(e) => setNewJdFile(e.target.files[0])}
                                                    className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-sm w-full sm:w-[300px] text-slate-700 dark:text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#1152d4] hover:file:bg-blue-100"
                                                />
                                                <button
                                                    onClick={handleReupload}
                                                    className="bg-[#1152d4] hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors whitespace-nowrap shadow-sm w-full sm:w-auto"
                                                >
                                                    Upload & Restart
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminStream;
