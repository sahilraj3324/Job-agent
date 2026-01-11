'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSavedJobs, SavedJobFromAPI, unsaveJob } from '../../config/api';
import { mapApiJobToJob } from '../../config/mappers';
import JobCard from '../../components/JobCard';
import JobSkeleton from '../../components/JobSkeleton';
import { Job } from '../../types';

// Default user ID for demo purposes
const DEFAULT_USER_ID = 'demo-user';

export default function SavedJobsPage() {
    const [savedJobs, setSavedJobs] = useState<Array<{ savedAt: string; notes: string | null; job: Job | null }>>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSavedJobs = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getSavedJobs(DEFAULT_USER_ID);
            const mappedJobs = data.savedJobs.map(saved => ({
                savedAt: saved.savedAt,
                notes: saved.notes,
                job: saved.job ? mapApiJobToJob(saved.job) : null,
            }));
            setSavedJobs(mappedJobs);
        } catch (err) {
            console.error('Failed to fetch saved jobs:', err);
            setError('Failed to load saved jobs. Please try again.');
            setSavedJobs([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSavedJobs();
    }, []);

    const handleUnsave = async (jobId: string) => {
        try {
            await unsaveJob(DEFAULT_USER_ID, jobId);
            setSavedJobs(prev => prev.filter(s => s.job?.id !== jobId));
        } catch (err) {
            console.error('Failed to unsave job:', err);
        }
    };

    const validJobs = savedJobs.filter(s => s.job !== null);

    return (
        <div className="max-w-[1400px] mx-auto px-6 py-8">
            <div className="mb-8">
                <Link href="/" className="text-blue-500 hover:text-blue-600 font-medium inline-flex items-center gap-1 transition-colors">
                    ← Back to Jobs
                </Link>
            </div>

            <div className="text-center mb-12 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                    Your <span className="text-blue-500">Saved Jobs</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    Jobs you've saved for later review
                </p>
            </div>

            {error ? (
                <div className="text-center py-16 px-8 bg-red-50 rounded-xl border border-red-200 text-red-600">
                    <p className="font-semibold">{error}</p>
                    <button
                        onClick={fetchSavedJobs}
                        className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            ) : isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <JobSkeleton key={i} />
                    ))}
                </div>
            ) : validJobs.length === 0 ? (
                <div className="text-center py-20 px-8 bg-white rounded-xl border border-dashed border-slate-300">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">📑</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No saved jobs yet</h3>
                    <p className="text-slate-500 mb-6">
                        Start exploring and save jobs you're interested in
                    </p>
                    <Link
                        href="/"
                        className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                    >
                        Find Jobs
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {validJobs.map((saved) => (
                        <div key={saved.job!.id} className="relative">
                            <JobCard job={saved.job!} />
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleUnsave(saved.job!.id);
                                }}
                                className="absolute top-4 right-4 p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all"
                                title="Remove from saved"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
