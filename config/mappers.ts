import { Job } from '../types';
import { JobFromAPI, JobDetailFromAPI } from './api';

/**
 * Transform API job to frontend Job type
 */
export function mapApiJobToJob(apiJob: JobFromAPI): Job {
    return {
        id: apiJob.id,
        title: apiJob.role,
        company: apiJob.companyName,
        location: apiJob.location,
        type: deriveJobType(apiJob.location),
        salary: '', // Not provided by this API
        postedAt: formatPostedAt(apiJob.postedAt),
        description: '',
        requirements: [],
        logo: generateLogo(apiJob.companyName),
        tags: apiJob.skills.slice(0, 4),
        applyUrl: apiJob.applyUrl,
        source: apiJob.source === 'company_website' ? 'Company Website' : 'Google Jobs',
        experience: '',
    };
}

/**
 * Transform API job detail to frontend Job type
 */
export function mapApiJobDetailToJob(apiJob: JobDetailFromAPI): Job {
    return {
        id: apiJob.id,
        title: apiJob.role,
        company: apiJob.companyName,
        location: apiJob.location,
        type: deriveJobType(apiJob.location),
        salary: '',
        postedAt: formatPostedAt(apiJob.postedAt),
        description: apiJob.description,
        requirements: extractRequirements(apiJob.description),
        logo: generateLogo(apiJob.companyName),
        tags: apiJob.skills,
        applyUrl: apiJob.applyUrl,
        source: apiJob.source === 'company_website' ? 'Company Website' : 'Google Jobs',
        experience: formatExperience(apiJob.minExperience, apiJob.maxExperience),
    };
}

function deriveJobType(location: string): string {
    const l = location.toLowerCase();
    if (l.includes('remote')) return 'Remote';
    if (l.includes('hybrid')) return 'Hybrid';
    return 'Onsite';
}

function formatPostedAt(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
}

function generateLogo(companyName: string): string {
    const encoded = encodeURIComponent(companyName.replace(/\s+/g, '+'));
    const colors = ['0D8ABC', 'FF5722', '673AB7', '4CAF50', 'E91E63', '3F51B5'];
    const colorIndex = companyName.length % colors.length;
    return `https://ui-avatars.com/api/?name=${encoded}&background=${colors[colorIndex]}&color=fff`;
}

function formatExperience(min: number | null, max: number | null): string {
    if (min === null && max === null) return 'Not specified';
    if (min !== null && max !== null) return `${min}-${max} Years`;
    if (min !== null) return `${min}+ Years`;
    if (max !== null) return `Up to ${max} Years`;
    return 'Not specified';
}

function extractRequirements(description: string): string[] {
    // Simple extraction: split by newlines and filter for bullet-like items
    const lines = description.split('\n');
    return lines
        .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•') || line.trim().startsWith('*'))
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .filter(line => line.length > 10)
        .slice(0, 6);
}
