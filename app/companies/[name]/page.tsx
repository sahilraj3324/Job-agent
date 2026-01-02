'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { getCompanyJobs } from '../../../config/api';
import { mapApiJobToJob } from '../../../config/mappers';
import { Job } from '../../../types';
import JobList from '../../../components/JobList';

interface PageProps {
    params: Promise<{ name: string }>;
}

export default function CompanyJobsPage({ params }: PageProps) {
    const { name } = use(params);
    const decodedName = decodeURIComponent(name);

    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const apiJobs = await getCompanyJobs(decodedName);
                setJobs(apiJobs.map(mapApiJobToJob));
            } catch (err) {
                console.error('Failed to fetch company jobs:', err);
                setError('Failed to load jobs for this company.');
                setJobs([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobs();
    }, [decodedName]);

    return (
        <div className="max-w-[1400px] mx-auto px-6 py-8">
            <div className="mb-8">
                <Link href="/" className="text-blue-500 hover:text-blue-600 font-medium inline-flex items-center gap-1 transition-colors">
                    ← Back to Companies
                </Link>
            </div>

            <div className="mb-10">
                <div className="flex items-center gap-4 mb-4">
                    <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(decodedName.replace(/\s+/g, '+'))}&background=random&color=fff&size=80`}
                        alt={`${decodedName} logo`}
                        className="w-16 h-16 rounded-xl"
                    />
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">{decodedName}</h1>
                        <p className="text-slate-500">
                            {isLoading ? 'Loading...' : `${jobs.length} ${jobs.length === 1 ? 'job' : 'jobs'} available`}
                        </p>
                    </div>
                </div>
            </div>

            {error ? (
                <div className="text-center py-16 px-8 bg-red-50 rounded-xl border border-red-200 text-red-600">
                    <p className="font-semibold">{error}</p>
                </div>
            ) : (
                <JobList jobs={jobs} isLoading={isLoading} />
            )}
        </div>
    );
}
