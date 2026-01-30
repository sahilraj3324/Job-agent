'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import Link from 'next/link';
import { analyzeAndMatchResume, uploadPdfResume, AnalyzeAndMatchResponse, MatchingJob } from '../../config/api';

export default function ResumePage() {
    const [resumeText, setResumeText] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadMode, setUploadMode] = useState<'text' | 'pdf'>('text');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalyzeAndMatchResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAnalyze = async () => {
        if (uploadMode === 'text' && !resumeText.trim()) {
            setError('Please paste your resume text');
            return;
        }

        if (uploadMode === 'pdf' && !selectedFile) {
            setError('Please select a PDF file');
            return;
        }

        setIsAnalyzing(true);
        setError(null);

        try {
            let data: AnalyzeAndMatchResponse;

            if (uploadMode === 'pdf' && selectedFile) {
                data = await uploadPdfResume(selectedFile, 10);
            } else {
                data = await analyzeAndMatchResume(resumeText.trim(), 10);
            }

            setResult(data);
        } catch (err: any) {
            console.error('Analysis failed:', err);
            setError(err.message || 'Failed to analyze resume. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'application/pdf') {
                setSelectedFile(file);
                setUploadMode('pdf');
                setError(null);
            } else if (file.type === 'text/plain') {
                const text = await file.text();
                setResumeText(text);
                setUploadMode('text');
                setError(null);
            } else {
                setError('Please drop a PDF or text file');
            }
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.type === 'application/pdf') {
                setSelectedFile(file);
                setError(null);
            } else {
                setError('Please select a PDF file');
            }
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'from-emerald-400 to-emerald-600';
        if (score >= 60) return 'from-blue-400 to-blue-600';
        if (score >= 40) return 'from-amber-400 to-amber-600';
        return 'from-red-400 to-red-600';
    };

    const getScoreLabel = (score: number) => {
        if (score >= 90) return 'Exceptional';
        if (score >= 75) return 'Strong';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Needs Work';
        return 'Major Revision';
    };

    const resetForm = () => {
        setResult(null);
        setResumeText('');
        setSelectedFile(null);
        setUploadMode('text');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-6 shadow-lg shadow-blue-500/25">
                        <span className="animate-pulse">✨</span>
                        AI-Powered Resume Analysis
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                        Get Your Resume <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">Reviewed</span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Upload your resume (PDF) or paste text to get instant AI feedback with improvement suggestions and matching jobs
                    </p>
                </div>

                {!result ? (
                    /* Upload Section */
                    <div className="max-w-3xl mx-auto">
                        {/* Mode Toggle */}
                        <div className="flex justify-center mb-6">
                            <div className="inline-flex bg-white rounded-xl p-1 shadow-lg shadow-slate-200/50">
                                <button
                                    onClick={() => setUploadMode('text')}
                                    className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${uploadMode === 'text'
                                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                                            : 'text-slate-600 hover:text-slate-800'
                                        }`}
                                >
                                    📝 Paste Text
                                </button>
                                <button
                                    onClick={() => setUploadMode('pdf')}
                                    className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${uploadMode === 'pdf'
                                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                                            : 'text-slate-600 hover:text-slate-800'
                                        }`}
                                >
                                    📄 Upload PDF
                                </button>
                            </div>
                        </div>

                        <div
                            className={`relative bg-white rounded-2xl border-2 border-dashed transition-all duration-300 shadow-xl shadow-slate-200/50 ${isDragging
                                    ? 'border-blue-500 bg-blue-50 scale-[1.02]'
                                    : 'border-slate-200 hover:border-blue-300'
                                }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <div className="p-8">
                                <div className="flex items-center justify-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-800">
                                        {uploadMode === 'text' ? 'Paste Your Resume' : 'Upload Your Resume'}
                                    </h2>
                                </div>

                                {uploadMode === 'text' ? (
                                    <textarea
                                        ref={textareaRef}
                                        value={resumeText}
                                        onChange={(e) => setResumeText(e.target.value)}
                                        placeholder="Paste your resume text here... (or drag and drop a file)"
                                        className="w-full h-64 p-4 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-700 placeholder:text-slate-400 bg-slate-50/50"
                                    />
                                ) : (
                                    <div className="space-y-4">
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full h-48 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all"
                                        >
                                            {selectedFile ? (
                                                <>
                                                    <div className="w-16 h-16 mb-3 rounded-xl bg-emerald-100 flex items-center justify-center">
                                                        <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <p className="font-semibold text-slate-800">{selectedFile.name}</p>
                                                    <p className="text-sm text-slate-500 mt-1">
                                                        {(selectedFile.size / 1024).toFixed(1)} KB • Click to change
                                                    </p>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-16 h-16 mb-3 rounded-xl bg-slate-100 flex items-center justify-center">
                                                        <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                        </svg>
                                                    </div>
                                                    <p className="font-semibold text-slate-800">Drop your PDF here</p>
                                                    <p className="text-sm text-slate-500 mt-1">or click to browse</p>
                                                </>
                                            )}
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".pdf,application/pdf"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </div>
                                )}

                                {error && (
                                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {error}
                                    </div>
                                )}

                                <button
                                    onClick={handleAnalyze}
                                    disabled={isAnalyzing || (uploadMode === 'text' ? !resumeText.trim() : !selectedFile)}
                                    className={`w-full mt-6 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${isAnalyzing || (uploadMode === 'text' ? !resumeText.trim() : !selectedFile)
                                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5'
                                        }`}
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Analyzing Your Resume...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            Analyze Resume
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { icon: '🎯', title: 'Score & Feedback', desc: 'Get a detailed score with actionable improvements' },
                                { icon: '💼', title: 'Job Matching', desc: 'Find jobs that match your skills and experience' },
                                { icon: '🤖', title: 'ATS Optimization', desc: 'Tips to pass Applicant Tracking Systems' },
                            ].map((feature, i) => (
                                <div key={i} className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-slate-200/50 hover:bg-white hover:shadow-lg transition-all duration-300">
                                    <div className="text-3xl mb-3">{feature.icon}</div>
                                    <h3 className="font-bold text-slate-800 mb-1">{feature.title}</h3>
                                    <p className="text-slate-500 text-sm">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Results Section */
                    <div className="space-y-8">
                        {/* Back Button & Score Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <button
                                onClick={resetForm}
                                className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-500 transition-colors font-medium"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Analyze Another Resume
                            </button>

                            {/* Score Circle */}
                            <div className="flex items-center gap-6 bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50">
                                <div className="relative w-24 h-24">
                                    <svg className="w-24 h-24 transform -rotate-90">
                                        <circle cx="48" cy="48" r="40" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                                        <circle
                                            cx="48" cy="48" r="40" fill="none"
                                            className={`stroke-current text-${result.analysis.score >= 60 ? 'blue' : 'amber'}-500`}
                                            strokeWidth="8"
                                            strokeLinecap="round"
                                            strokeDasharray={`${(result.analysis.score / 100) * 251} 251`}
                                            style={{ stroke: `url(#scoreGradient)` }}
                                        />
                                        <defs>
                                            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" className={result.analysis.score >= 60 ? 'text-blue-400' : 'text-amber-400'} stopColor="currentColor" />
                                                <stop offset="100%" className={result.analysis.score >= 60 ? 'text-indigo-500' : 'text-orange-500'} stopColor="currentColor" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-2xl font-extrabold text-slate-800">{result.analysis.score}</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-slate-500 mb-1">Resume Score</div>
                                    <div className={`text-xl font-bold bg-gradient-to-r ${getScoreColor(result.analysis.score)} bg-clip-text text-transparent`}>
                                        {getScoreLabel(result.analysis.score)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20">
                            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                <span>📝</span> Summary
                            </h3>
                            <p className="text-blue-100 leading-relaxed">{result.analysis.summary}</p>
                        </div>

                        {/* Profile Info */}
                        <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50">
                            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                                <span>👤</span> Parsed Profile
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <div className="text-sm text-slate-500 mb-1">Primary Role</div>
                                    <div className="font-semibold text-slate-800">{result.parsedResume.primaryRole}</div>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <div className="text-sm text-slate-500 mb-1">Experience</div>
                                    <div className="font-semibold text-slate-800">
                                        {result.parsedResume.totalExperienceYears !== null
                                            ? `${result.parsedResume.totalExperienceYears} years`
                                            : 'Not specified'}
                                    </div>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <div className="text-sm text-slate-500 mb-1">Skills</div>
                                    <div className="font-semibold text-slate-800">{result.parsedResume.skills.length} identified</div>
                                </div>
                            </div>
                            {result.parsedResume.skills.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {result.parsedResume.skills.slice(0, 15).map((skill, i) => (
                                        <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                    {result.parsedResume.skills.length > 15 && (
                                        <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-sm">
                                            +{result.parsedResume.skills.length - 15} more
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Analysis Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Strengths */}
                            <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border-l-4 border-emerald-500">
                                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">💪</span>
                                    Strengths
                                </h3>
                                <ul className="space-y-3">
                                    {result.analysis.strengths.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-slate-600">
                                            <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Improvements */}
                            <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border-l-4 border-amber-500">
                                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">🔧</span>
                                    Improvements
                                </h3>
                                <ul className="space-y-3">
                                    {result.analysis.improvements.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-slate-600">
                                            <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Missing Elements */}
                            <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border-l-4 border-red-500">
                                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">❌</span>
                                    Missing Elements
                                </h3>
                                <ul className="space-y-3">
                                    {result.analysis.missingElements.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-slate-600">
                                            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* ATS Tips */}
                            <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border-l-4 border-blue-500">
                                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">🤖</span>
                                    ATS Optimization
                                </h3>
                                <ul className="space-y-3">
                                    {result.analysis.atsTips.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-slate-600">
                                            <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Matching Jobs */}
                        {result.matchingJobs.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50">
                                <h3 className="font-bold text-xl text-slate-800 mb-6 flex items-center gap-3">
                                    <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-lg">💼</span>
                                    Matching Jobs for You
                                    <span className="ml-auto text-sm font-normal text-slate-500">
                                        {result.matchingJobs.length} matches found
                                    </span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {result.matchingJobs.map((match: MatchingJob, i: number) => (
                                        <div key={i} className="group relative bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
                                            <div className="absolute top-4 right-4">
                                                <div className={`px-3 py-1 rounded-full text-sm font-bold ${match.percentage >= 80 ? 'bg-emerald-100 text-emerald-700' :
                                                        match.percentage >= 60 ? 'bg-blue-100 text-blue-700' :
                                                            'bg-slate-100 text-slate-600'
                                                    }`}>
                                                    {match.percentage}% match
                                                </div>
                                            </div>
                                            <div className="pr-24">
                                                <h4 className="font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
                                                    {match.job.role}
                                                </h4>
                                                <p className="text-slate-500 text-sm mb-3">{match.job.companyName}</p>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {match.job.location || 'Remote'}
                                                </span>
                                            </div>
                                            {match.job.skills && match.job.skills.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mb-4">
                                                    {match.job.skills.slice(0, 4).map((skill: string, j: number) => (
                                                        <span key={j} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                    {match.job.skills.length > 4 && (
                                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs">
                                                            +{match.job.skills.length - 4}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            {match.job.applyUrl && (
                                                <a
                                                    href={match.job.applyUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors"
                                                >
                                                    Apply Now
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                    </svg>
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {result.matchingJobs.length === 0 && (
                            <div className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                                    <span className="text-3xl">💼</span>
                                </div>
                                <h3 className="font-bold text-xl text-slate-800 mb-2">No Matching Jobs Yet</h3>
                                <p className="text-slate-500 max-w-md mx-auto">
                                    We don't have job listings that match your profile right now. Check back later or browse all available jobs.
                                </p>
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all"
                                >
                                    Browse All Jobs
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
