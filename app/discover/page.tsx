'use client';

import { useState } from 'react';
import Link from 'next/link';
import { discoverCompanies, runDiscovery, DiscoveryLog, DiscoveredCompany, CompanyDiscoveryResult } from '../../config/api';

type Phase = 'idle' | 'discovering_companies' | 'finding_jobs' | 'complete';

export default function DiscoverPage() {
    const [phase, setPhase] = useState<Phase>('idle');
    const [searchQuery, setSearchQuery] = useState('');

    // Company discovery state
    const [discoveredCompanies, setDiscoveredCompanies] = useState<DiscoveredCompany[]>([]);
    const [companyLogs, setCompanyLogs] = useState<Array<{ step: string; message: string; timestamp: string }>>([]);

    // Job discovery state
    const [jobLogs, setJobLogs] = useState<DiscoveryLog[]>([]);
    const [summary, setSummary] = useState<{
        targetSuccessful: number;
        actualSuccessful: number;
        totalProcessed: number;
        totalJobs: number;
        totalNewJobs: number;
        completed: boolean;
    } | null>(null);

    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const handleStartDiscovery = async () => {
        if (phase !== 'idle') return;

        // Reset state
        setDiscoveredCompanies([]);
        setCompanyLogs([]);
        setJobLogs([]);
        setSummary(null);

        try {
            // Phase 1: Discover companies using AI agent
            setPhase('discovering_companies');
            setStatusMessage('🔍 AI Agent discovering companies from YC directory...');

            const companyResult = await discoverCompanies(searchQuery || undefined, 50);
            setDiscoveredCompanies(companyResult.companies);
            setCompanyLogs(companyResult.logs);
            setStatusMessage(`✓ Found ${companyResult.summary.discovered} companies (${companyResult.summary.newCompanies} new)`);

            // Small delay to show results
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Phase 2: Run job discovery until 10 companies with jobs found
            setPhase('finding_jobs');
            setStatusMessage('🚀 Finding jobs from discovered companies...');

            const jobResult = await runDiscovery(10);
            setJobLogs(jobResult.logs);
            setSummary(jobResult.summary);

            setPhase('complete');
            setStatusMessage(jobResult.summary.completed
                ? `✅ Complete! Found ${jobResult.summary.totalJobs} jobs from ${jobResult.summary.actualSuccessful} companies`
                : `⚠️ Found ${jobResult.summary.actualSuccessful} companies with jobs (target: 10)`
            );
        } catch (error) {
            console.error('Discovery failed:', error);
            setStatusMessage('❌ Discovery failed. Please try again.');
            setPhase('idle');
        }
    };

    const handleReset = () => {
        setPhase('idle');
        setDiscoveredCompanies([]);
        setCompanyLogs([]);
        setJobLogs([]);
        setSummary(null);
        setStatusMessage(null);
    };

    const successfulJobLogs = jobLogs.filter(l => l.status === 'success');
    const otherJobLogs = jobLogs.filter(l => l.status !== 'success');

    const isRunning = phase !== 'idle' && phase !== 'complete';

    return (
        <div className="max-w-[1200px] mx-auto px-6 py-8">
            <div className="mb-8">
                <Link href="/" className="text-blue-500 hover:text-blue-600 font-medium inline-flex items-center gap-1 transition-colors">
                    ← Back to Jobs
                </Link>
            </div>

            {/* Header */}
            <div className="text-center mb-8 py-6">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                    🤖 AI Job <span className="text-blue-500">Discovery Agent</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-6">
                    AI agent discovers companies from YC directory, then finds jobs until 10 companies with openings are found.
                </p>

                {/* Search Query Input */}
                {phase === 'idle' && (
                    <div className="max-w-md mx-auto mb-6">
                        <input
                            type="text"
                            placeholder="Optional: Search for specific companies (e.g., 'AI startups', 'fintech')"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                        />
                    </div>
                )}

                {/* Main Action Button */}
                <div className="flex items-center justify-center gap-4">
                    {phase === 'complete' ? (
                        <button
                            onClick={handleReset}
                            className="px-8 py-4 rounded-xl text-lg font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
                        >
                            🔄 Start New Discovery
                        </button>
                    ) : (
                        <button
                            onClick={handleStartDiscovery}
                            disabled={isRunning}
                            className={`px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-lg hover:shadow-xl ${isRunning
                                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                : 'bg-emerald-500 hover:bg-emerald-600 text-white hover:-translate-y-1'
                                }`}
                        >
                            {isRunning ? (
                                <span className="flex items-center gap-3">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    {phase === 'discovering_companies' ? 'Discovering Companies...' : 'Finding Jobs...'}
                                </span>
                            ) : (
                                '🚀 Start AI Discovery'
                            )}
                        </button>
                    )}
                </div>

                {/* Status Message */}
                {statusMessage && (
                    <div className={`mt-6 inline-block px-6 py-3 rounded-xl text-lg font-semibold ${isRunning ? 'bg-blue-100 text-blue-700 animate-pulse' : 'bg-slate-100 text-slate-700'
                        }`}>
                        {statusMessage}
                    </div>
                )}
            </div>

            {/* Phase Progress */}
            {phase !== 'idle' && (
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${phase === 'discovering_companies' ? 'bg-blue-100 text-blue-700 animate-pulse' : 'bg-emerald-100 text-emerald-700'}`}>
                        <span className="font-bold">1.</span> Discover Companies
                        {phase !== 'discovering_companies' && <span>✓</span>}
                    </div>
                    <span className="text-slate-300">→</span>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${phase === 'finding_jobs' ? 'bg-blue-100 text-blue-700 animate-pulse' : phase === 'complete' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                        <span className="font-bold">2.</span> Find Jobs
                        {phase === 'complete' && <span>✓</span>}
                    </div>
                </div>
            )}

            {/* Company Discovery Logs */}
            {companyLogs.length > 0 && (
                <div className="mb-8 bg-slate-900 rounded-xl p-4 font-mono text-sm">
                    <h3 className="text-emerald-400 font-bold mb-2">📡 Company Discovery Logs</h3>
                    <div className="space-y-1 max-h-[150px] overflow-y-auto">
                        {companyLogs.map((log, i) => (
                            <div key={i} className="text-slate-300">
                                <span className="text-slate-500">[{log.step}]</span> {log.message}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Discovered Companies */}
            {discoveredCompanies.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">
                        🏢 Discovered Companies ({discoveredCompanies.length})
                        <span className="ml-2 text-sm font-normal text-emerald-600">
                            {discoveredCompanies.filter(c => c.isNew).length} new
                        </span>
                    </h3>
                    <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto p-4 bg-slate-50 rounded-xl border border-slate-200">
                        {discoveredCompanies.slice(0, 50).map((company, i) => (
                            <a
                                key={i}
                                href={company.homepageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:scale-105 ${company.isNew
                                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                    : 'bg-white text-slate-600 border border-slate-200'
                                    }`}
                            >
                                {company.name}
                                {company.industry && <span className="ml-1 text-xs opacity-60">• {company.industry}</span>}
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Job Discovery Summary */}
            {summary && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-slate-900">{summary.totalProcessed}</div>
                        <div className="text-sm text-slate-500">Processed</div>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-emerald-700">{summary.actualSuccessful}</div>
                        <div className="text-sm text-emerald-600">With Jobs</div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-blue-700">{summary.totalJobs}</div>
                        <div className="text-sm text-blue-600">Total Jobs</div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-purple-700">{summary.totalNewJobs}</div>
                        <div className="text-sm text-purple-600">New Jobs</div>
                    </div>
                    <div className={`rounded-xl p-4 text-center ${summary.completed ? 'bg-emerald-100 border border-emerald-300' : 'bg-amber-100 border border-amber-300'}`}>
                        <div className="text-3xl font-bold">{summary.completed ? '✓' : '○'}</div>
                        <div className="text-sm">{summary.completed ? 'Complete' : 'Partial'}</div>
                    </div>
                </div>
            )}

            {/* Companies with Jobs */}
            {successfulJobLogs.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <span className="bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">✓</span>
                        Companies with Jobs ({successfulJobLogs.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {successfulJobLogs.map((log, i) => (
                            <div key={i} className="border rounded-xl p-4 bg-emerald-100 text-emerald-800 border-emerald-200">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-bold text-lg">{log.company}</h3>
                                    <span className="text-sm font-semibold bg-white/50 px-2 py-1 rounded-lg">
                                        {log.jobsFound} jobs
                                    </span>
                                </div>
                                <p className="text-sm mb-2">{log.message}</p>
                                {log.careerPage && (
                                    <a href={log.careerPage} target="_blank" rel="noopener noreferrer" className="text-xs underline opacity-75 hover:opacity-100">
                                        {log.careerPage}
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Other Results */}
            {otherJobLogs.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-slate-700 mb-3">Other Results ({otherJobLogs.length})</h2>
                    <div className="bg-slate-50 rounded-xl border border-slate-200 divide-y divide-slate-200 max-h-[300px] overflow-y-auto">
                        {otherJobLogs.map((log, i) => (
                            <div key={i} className="p-3 flex items-center gap-3 text-sm">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${log.status === 'no_jobs' ? 'bg-amber-100 text-amber-800 border-amber-200' : log.status === 'error' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                    {log.status === 'no_jobs' ? '○' : log.status === 'error' ? '⚠' : '✗'}
                                </span>
                                <span className="font-medium text-slate-900 min-w-[150px]">{log.company}</span>
                                <span className="text-slate-500 flex-1">{log.message}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {phase === 'idle' && discoveredCompanies.length === 0 && (
                <div className="text-center py-16 px-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <div className="text-6xl mb-4">🤖</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">AI Discovery Agent Ready</h3>
                    <p className="text-slate-500 mb-4">
                        The agent will automatically discover companies from YC directory and find their job openings.
                    </p>
                    <p className="text-sm text-slate-400">
                        No pre-seeded company list required - the agent finds companies dynamically!
                    </p>
                </div>
            )}
        </div>
    );
}

