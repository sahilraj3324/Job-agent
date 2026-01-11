'use client';

import { useState, useEffect } from 'react';
import { saveJob, unsaveJob, isJobSaved } from '../config/api';

interface SaveJobButtonProps {
    jobId: string;
    userId?: string;
    variant?: 'icon' | 'button';
    className?: string;
}

// Default user ID for demo purposes (in production, use auth)
const DEFAULT_USER_ID = 'demo-user';

export default function SaveJobButton({
    jobId,
    userId = DEFAULT_USER_ID,
    variant = 'icon',
    className = '',
}: SaveJobButtonProps) {
    const [isSaved, setIsSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkSaved = async () => {
            try {
                const saved = await isJobSaved(userId, jobId);
                setIsSaved(saved);
            } catch (error) {
                console.error('Failed to check saved status:', error);
            } finally {
                setIsChecking(false);
            }
        };
        checkSaved();
    }, [userId, jobId]);

    const handleToggleSave = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isLoading) return;

        setIsLoading(true);
        try {
            if (isSaved) {
                await unsaveJob(userId, jobId);
                setIsSaved(false);
            } else {
                await saveJob(userId, jobId);
                setIsSaved(true);
            }
        } catch (error) {
            console.error('Failed to toggle save:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isChecking) {
        return (
            <button
                className={`${className} opacity-50 cursor-wait`}
                disabled
            >
                {variant === 'icon' ? (
                    <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                ) : (
                    'Loading...'
                )}
            </button>
        );
    }

    if (variant === 'icon') {
        return (
            <button
                onClick={handleToggleSave}
                disabled={isLoading}
                className={`p-2 rounded-lg transition-all hover:scale-110 ${className} ${isSaved
                    ? 'text-blue-500 bg-blue-50 hover:bg-blue-100'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                    } ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
                title={isSaved ? 'Unsave job' : 'Save job'}
            >
                <svg
                    className="w-5 h-5"
                    fill={isSaved ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                </svg>
            </button>
        );
    }

    return (
        <button
            onClick={handleToggleSave}
            disabled={isLoading}
            className={`w-full px-4 py-3 rounded-xl font-semibold transition-all ${className} ${isSaved
                    ? 'bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200'
                    : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                } ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
        >
            {isLoading ? (
                <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving...
                </span>
            ) : isSaved ? (
                <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    Saved
                </span>
            ) : (
                <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    Save Job
                </span>
            )}
        </button>
    );
}
