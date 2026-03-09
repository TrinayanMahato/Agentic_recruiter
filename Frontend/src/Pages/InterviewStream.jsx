import React, { useEffect, useState } from 'react';

const InterviewStream = () => {
    const [messages, setMessages] = useState([]);
    const [status, setStatus] = useState("Connecting...");

    useEffect(() => {
        // You can dynamically get userId from auth context or local storage. Using a mock ID here.
        const userId = "user-123";

        const eventSource = new EventSource(`${import.meta.env.VITE_API_BASE_URL}/api/admin/interview-stream/${userId}`);

        eventSource.onopen = () => {
            setStatus("Connected to Interview Stream (Live)");
        };

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("Interview Stream Event:", data);
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
                        <span className="material-symbols-outlined text-green-500">event_available</span>
                        Interview Scheduling Stream
                    </h1>
                    <div className="flex items-center gap-2 mb-6">
                        <div className={`w-2.5 h-2.5 rounded-full ${status.includes("Connected") ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{status}</span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 min-h-[300px] max-h-[500px] overflow-y-auto space-y-3">
                        {messages.length === 0 ? (
                            <p className="text-slate-400 text-center py-10 font-medium">Your Interview Schedules</p>
                        ) : (
                            messages.map((msg, index) => (
                                <div key={index} className="bg-white dark:bg-slate-900 p-3 rounded shadow-sm text-sm border-l-4 border-green-500">
                                    <pre className="whitespace-pre-wrap font-mono text-xs">{JSON.stringify(msg, null, 2)}</pre>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewStream;
