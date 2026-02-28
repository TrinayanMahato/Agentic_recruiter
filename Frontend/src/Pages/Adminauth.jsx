import React from 'react';
import { Link } from 'react-router-dom';

const AdminAuth = () => {
    return (
        <div className="font-sans bg-blue-50 dark:bg-[#101622] min-h-screen flex flex-col">
            {/* Navigation Header */}
            <header className="w-full bg-white/80 dark:bg-[#101622]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 fixed top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#1152d4]">
                        <div className="w-8 h-8 bg-[#1152d4] rounded-lg flex items-center justify-center text-white">
                            <span className="material-symbols-outlined">shield_person</span>
                        </div>
                        <h1 className="text-slate-900 dark:text-slate-100 text-xl font-bold tracking-tight">TechNova Systems</h1>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main
                className="flex-1 flex items-center justify-center pt-16 px-4"
                style={{
                    backgroundColor: '#eff6ff',
                    backgroundImage: 'radial-gradient(#1152d411 1px, transparent 1px), radial-gradient(#1152d411 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    backgroundPosition: '0 0, 20px 20px'
                }}
            >
                <div className="w-full max-w-[440px]">
                    {/* Login Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        {/* Card Header Image & Brand */}
                        <div className="relative h-32 bg-[#1152d4]/10 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 opacity-20" style={{ backgroundSize: '40px 40px' }}></div>
                            <div className="relative flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-full shadow-md flex items-center justify-center text-[#1152d4]">
                                    <span className="material-symbols-outlined !text-3xl">admin_panel_settings</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Admin Access</h2>
                                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Secure authentication for TechNova Systems</p>
                            </div>

                            <form className="space-y-6">
                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">mail</span>
                                        <input className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#1152d4]/20 focus:border-[#1152d4] outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400" placeholder="admin@technova.com" type="email" />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                                    </div>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
                                        <input className="w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#1152d4]/20 focus:border-[#1152d4] outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400" placeholder="••••••••" type="password" />
                                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1152d4] transition-colors" type="button">
                                            <span className="material-symbols-outlined">visibility</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Sign In Button */}
                                <Link to="/admin" className="w-full bg-[#1152d4] hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
                                    <span>Sign In</span>
                                    <span className="material-symbols-outlined text-lg">login</span>
                                </Link>
                            </form>

                            {/* Footer Links */}
                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                                <a className="text-sm font-medium text-[#1152d4] hover:underline" href="#">Forgot your password?</a>
                                <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-400 uppercase tracking-widest">
                                    <span>Encrypted</span>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                    <span>Secure Node</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Help */}
                    <p className="text-center mt-8 text-slate-500 dark:text-slate-400 text-xs">
                        © 2024 TechNova Systems. Authorized Personnel Only.
                    </p>
                </div>
            </main>

            {/* Footer Decoration */}
            <footer className="py-6 px-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200" style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuDRpzyTPhFk60i1eLxF-ZeGhpfWnMr6xhkoOdhUDQzcvHvvmHtuvCJQrSOoFd4PE9CscRA67k0nMOA4PLK2NjHY4QDAzW7qfxCxCZpIb3h-pDy8rHsz6sMHk1H5WKDE7DxC9oIiXdMpmM88x3Mgrjilx_FMyNn0PDTrrhVso17xXHfXhf6yH0i7-ZsXXuaDZnwo4iVzsgEQ5PfOS9yceL6lsdwA3micuVhMw6_fCOdBpH7UuxS4Ve7PRfaolkyXVPwfRRsE6CS3q7w)' }}></div>
                            <div className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-300" style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuCpOU2luXaSm4AycjlbuceGzPi9a6E9rxzouV6LA1F0BYPJEBVNx6LClPikJ7IBDGGdfVu95aGePueX9fS9i9HDUDaqeywjSvKVRHoMh0005YOw-_XmhbTQaZToyJZktAy2RvxURVs3S7wHLIf5j22Mn0RzMO2J4EUVxIjoSDDARTAxWL4PYQfleUQswHdQb3zfxjij9kEbiTD8FShBby6_R8NOaXSWUyI17zDOhCdczGCVloKdyiF3m_bFFPwGIgXvWXyqNBibZ_g)' }}></div>
                            <div className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-400" style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuCSu5hYqIQnws4q2Ke7sGtpP8BtiDx2GTR82mTMAUlYY1F0aayme_KL6GFcQR1MJ3Nq1I8OZyc8j3yMQ60LCbRPDPbhYfjef3pGgxOEdqX1tXV5RAVzD-WKdVZy108QwsE9R2qVcPIfRLyGQMpj2C043mZH1fprpzcJ4TpFvxqP5VLS198KlMpTnnijXcNC5Zwitgl3o8phLlNwvgNFd8PcV1fHsEdxpkG1n6Z6aIRkuP1z-Jsqlxeqvz7Lnrxs6tdvtjzZgg0So9M)' }}></div>
                        </div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">System Uptime 99.9%</p>
                    </div>
                    <div className="flex gap-6">
                        <a className="text-xs text-slate-400 hover:text-[#1152d4]" href="#">Privacy Policy</a>
                        <a className="text-xs text-slate-400 hover:text-[#1152d4]" href="#">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AdminAuth;
