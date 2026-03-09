import React, { useState } from 'react';
import axios from 'axios';

const Admin = () => {
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!title || !file) {
            alert("Please provide both a Job Title and a JD PDF file.");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("title", title);
        formData.append("jd", file);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/admin/upload-job`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const data = response.data;

            // Save IDs to local storage
            localStorage.setItem("jobId", data.jobId);
            localStorage.setItem("threadId", data.threadId);
            alert("JD Uploaded and graph processing started successfully!");
            setTitle("");
            setFile(null);
        } catch (error) {
            console.error("Upload error:", error);
            const errorMsg = error.response?.data?.message || error.response?.data?.error || "Failed to upload JD";
            alert(`Error: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101622] text-slate-900 dark:text-slate-100 min-h-screen font-sans flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3 sticky top-0 z-50">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3 text-[#1152d4]">
                        <span className="material-symbols-outlined text-3xl font-bold">corporate_fare</span>
                        <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-tight">Admin Portal</h2>
                    </div>
                    <nav className="hidden md:flex items-center gap-6">
                        <a className="text-[#1152d4] text-sm font-semibold border-b-2 border-[#1152d4] pb-1" href="#">Dashboard</a>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-1.5 gap-2 border border-slate-200 dark:border-slate-700">
                        <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
                        <input className="bg-transparent border-none focus:ring-0 text-sm w-48 placeholder:text-slate-400 focus:outline-none" placeholder="Search postings..." type="text" />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <button className="flex items-center gap-2 p-1 pl-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 transition-colors">
                            <span className="text-sm font-medium hidden md:block">Alex Rivera</span>
                            <div className="h-8 w-8 rounded-full bg-[#1152d4]/10 flex items-center justify-center overflow-hidden">
                                <img alt="User Profile" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQiOmvQP4LZ4Tz2kW3WpyCk0Vs78FF5JpkdaM4n6vgUOe2VgUOQvTvLcx6R1fnG9wuykzT-Je--Uk-ROzz6RVwtymXJTmuv3dnBp2hPA7n6MhT_vB4Z8-qa3doGbGjwScpvgfs0EK8wsHMOp8X6BU5WvLYFF9obmIE6FjCp5FvWafXj9ng_MR_B15G5c0-YYO6ODTCYStBH0Sbe5z1HRSZDnJX_WR9bhCPG31cICxvxIHsMG-CMb0ubWKqC5HB5d4v2IDwtXev5sI" />
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Job Management Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage active job postings and analyze applicant performance.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Upload Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#1152d4]">upload_file</span>
                                    Upload Job Description (JD)
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Job Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#1152d4] focus:ring-1 focus:ring-[#1152d4] outline-none transition-all"
                                        placeholder="e.g. Senior Full Stack Engineer"
                                    />
                                </div>
                                <div className="group relative flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 py-12 px-6 transition-all hover:border-[#1152d4]/50 hover:bg-[#1152d4]/5">
                                    <div className="bg-white dark:bg-slate-900 p-4 rounded-full shadow-sm mb-4 text-[#1152d4]">
                                        <span className="material-symbols-outlined text-4xl">picture_as_pdf</span>
                                    </div>
                                    <h3 className="text-slate-900 dark:text-slate-100 text-lg font-semibold mb-1">
                                        {file ? file.name : "Drag and drop JD here"}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Support for PDF files up to 10MB</p>
                                    <button className="bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-6 py-2 rounded-lg border border-slate-200 dark:border-slate-600 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm">
                                        Select File
                                    </button>
                                    <input aria-label="Upload job description" className="absolute inset-0 opacity-0 cursor-pointer" type="file" onChange={handleFileChange} />
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="bg-[#1152d4] hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                                        <span>{loading ? "Submitting..." : "Submit JD"}</span>
                                        <span className="material-symbols-outlined text-sm">send</span>
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Stats */}
                    <div className="space-y-6">
                        {/* Stats Card */}
                        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Applicants</h2>
                                <span className="material-symbols-outlined text-[#1152d4]/40">groups</span>
                            </div>
                            <div className="flex items-baseline gap-3">
                                <p className="text-5xl font-black text-[#1152d4]">0</p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Admin;
