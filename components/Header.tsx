'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cleanupEmptyCompanies } from '../config/api';

export default function Header() {
    const router = useRouter();
    const [isCleaning, setIsCleaning] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const handleCleanup = async () => {
        if (isCleaning) return;

        setIsCleaning(true);
        setStatusMessage('Cleaning up...');

        try {
            const result = await cleanupEmptyCompanies();
            setStatusMessage(`✓ Deleted ${result.deletedCompanies} companies, ${result.deletedJobs} old jobs`);

            // Clear message after 5 seconds
            setTimeout(() => setStatusMessage(null), 5000);
        } catch (error) {
            console.error('Cleanup failed:', error);
            setStatusMessage('Cleanup failed. Please try again.');
            setTimeout(() => setStatusMessage(null), 3000);
        } finally {
            setIsCleaning(false);
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-[70px] z-50 bg-white/70 backdrop-blur-md border-b border-slate-200 transition-all duration-300">
            <div className="max-w-[1400px] mx-auto h-full px-6 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold text-slate-900 tracking-tight">
                    Job<span className="text-blue-500">Hunt</span>
                </Link>
                <nav className="hidden md:flex gap-8">
                    <Link href="/" className="text-[0.95rem] font-medium text-slate-600 hover:text-blue-500 transition-colors">Find Jobs</Link>
                    <Link href="/saved" className="text-[0.95rem] font-medium text-slate-600 hover:text-blue-500 transition-colors">Saved Jobs</Link>
                    <Link href="/discover" className="text-[0.95rem] font-medium text-slate-600 hover:text-blue-500 transition-colors">Discover</Link>
                </nav>
                <div className="flex items-center gap-3">
                    {statusMessage && (
                        <span className="text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg animate-pulse">
                            {statusMessage}
                        </span>
                    )}
                    <button
                        onClick={handleCleanup}
                        disabled={isCleaning}
                        className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md ${isCleaning
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-red-100 hover:bg-red-200 text-red-700 border border-red-200 hover:-translate-y-px'
                            }`}
                    >
                        {isCleaning ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Cleaning...
                            </span>
                        ) : (
                            '🧹 Clear Empty'
                        )}
                    </button>
                    <Link
                        href="/discover"
                        className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md bg-emerald-500 hover:bg-emerald-600 text-white hover:-translate-y-px"
                    >
                        🔍 Discover Jobs
                    </Link>
                </div>
            </div>
        </header>
    );
}
