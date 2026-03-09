import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Applicant = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const jobId = localStorage.getItem("jobId");
        if (!jobId) {
            alert("No active job posting found. (jobId missing)");
            return;
        }

        if (!name || !email || !resume) {
            alert("Please fill in all fields and upload your resume.");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("resume", resume);
        formData.append("jobId", jobId);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/applicants/register`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 201) {
                alert("Application submitted successfully!");
                setName("");
                setEmail("");
                setResume(null);
            }
        } catch (error) {
            console.error("Submission error:", error);
            const errorMsg = error.response?.data?.message || error.response?.data?.error || "Failed to submit application";
            alert(`Error: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="bg-[#f8f9fc] dark:bg-[#0d121b] text-slate-900 dark:text-slate-100 font-sans antialiased min-h-screen flex flex-col">
            {/* Navbar */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0d121b]/80 backdrop-blur-md">
                <div className="px-6 md:px-12 lg:px-40 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                        <div className="w-8 h-8 text-[#1152d4]">
                            <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" fill="currentColor"></path>
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold tracking-tight">TechNova Systems</h2>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/adminauth" className="text-slate-600 hover:text-[#1152d4] dark:text-slate-300 dark:hover:text-[#1152d4] text-sm font-medium transition-colors border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-lg">Admin Login</Link>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow w-full px-6 md:px-12 lg:px-40 py-10 flex justify-center">
                <div className="flex flex-col max-w-4xl w-full">
                    {/* Job Header */}
                    <div className="mb-8">
                        <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                            <div className="flex flex-col gap-2">
                                <span className="inline-flex w-fit items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-[#1152d4] dark:bg-blue-900/30 dark:text-blue-200">Engineering Team</span>
                                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">Senior Full Stack Engineer</h1>
                                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mt-1">
                                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                                    <span className="text-base">San Francisco, CA (Remote)</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                            We are looking for a Senior Full Stack Engineer to join our core product team. You will be responsible for building scalable web applications and shaping the future of our tech stack. You'll work with modern technologies like React, Node.js, and TypeScript in a fast-paced agile environment.
                        </p>
                    </div>

                    {/* Download JD Box */}
                    <div className="mb-12">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#151b26] p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 text-[#1152d4]">
                                    <span className="material-symbols-outlined text-[28px]">description</span>
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Detailed Job Description</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Download the full PDF for offline viewing and sharing.</p>
                                </div>
                            </div>
                            <a className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm font-bold text-slate-900 dark:text-white" href="/JD.pdf" download>
                                <span>Download PDF</span>
                                <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                            </a>
                        </div>
                    </div>

                    {/* Application Form */}
                    <div className="bg-white dark:bg-[#151b26] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 md:p-10">
                        <div className="mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Apply for this position</h2>
                            <p className="text-slate-500 dark:text-slate-400">Please fill out the form below to submit your application.</p>
                        </div>

                        <form className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="name">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                                        <span className="material-symbols-outlined text-[20px]">person</span>
                                    </div>
                                    <input
                                        className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#1152d4] focus:ring-1 focus:ring-[#1152d4] outline-none transition-all"
                                        id="name"
                                        placeholder="Jane Doe"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="email">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                                        <span className="material-symbols-outlined text-[20px]">mail</span>
                                    </div>
                                    <input
                                        className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#1152d4] focus:ring-1 focus:ring-[#1152d4] outline-none transition-all"
                                        id="email"
                                        placeholder="jane.doe@example.com"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Resume Upload */}
                            <div className="flex flex-col gap-3 mt-2">
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Resume/CV (Upload)</span>
                                <div className="relative flex flex-col items-center justify-center w-full min-h-[180px] rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-[#1152d4] transition-all cursor-pointer group">
                                    <input
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        type="file"
                                        onChange={(e) => setResume(e.target.files[0])}
                                        required
                                    />
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                                        <div className="mb-3 p-3 rounded-full bg-white dark:bg-slate-700 shadow-sm text-[#1152d4] group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-[32px]">cloud_upload</span>
                                        </div>
                                        <p className="mb-1 text-sm text-slate-900 dark:text-white font-medium">
                                            {resume ? resume.name : "Click to upload or drag and drop"}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">PDF, DOCX or TXT (MAX. 5MB)</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    className="w-full rounded-lg bg-[#1152d4] py-4 px-8 text-base font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                >
                                    {loading ? "Submitting Application..." : "Submit Application"}
                                </button>
                                <p className="text-center text-xs text-slate-400 mt-4">By clicking submit, you agree to our Terms of Service and Privacy Policy.</p>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Applicant;
