// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://job-agent-backend.vercel.app';

// --- Types matching Backend Schema ---

export interface JobFromAPI {
    id: string;
    companyName: string;
    role: string;
    location: string;
    skills: string[];
    applyUrl: string;
    source: 'company_website' | 'google_jobs';
    postedAt: string;
}

export interface JobDetailFromAPI extends JobFromAPI {
    minExperience: number | null;
    maxExperience: number | null;
    description: string;
}

// --- API Functions ---

export async function getJobs(params?: {
    role?: string;
    location?: string;
    source?: 'company_website' | 'google_jobs';
}): Promise<JobFromAPI[]> {
    const url = new URL(`${API_BASE_URL}/jobs`);

    if (params?.role) url.searchParams.set('role', params.role);
    if (params?.location) url.searchParams.set('location', params.location);
    if (params?.source) url.searchParams.set('source', params.source);

    const response = await fetch(url.toString(), {
        cache: 'no-store', // Ensure fresh data
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch jobs: ${response.statusText}`);
    }

    return response.json();
}

export async function getJob(id: string): Promise<JobDetailFromAPI> {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch job: ${response.statusText}`);
    }

    return response.json();
}

// --- Company Types ---

export interface CompanyFromAPI {
    name: string;
    jobCount: number;
    logo: string;
}

// --- Company API Functions ---

export async function getCompanies(): Promise<CompanyFromAPI[]> {
    const response = await fetch(`${API_BASE_URL}/companies`, {
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch companies: ${response.statusText}`);
    }

    return response.json();
}

export async function getCompanyJobs(companyName: string): Promise<JobFromAPI[]> {
    const response = await fetch(`${API_BASE_URL}/companies/${encodeURIComponent(companyName)}/jobs`, {
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch company jobs: ${response.statusText}`);
    }

    return response.json();
}

// --- Discovery API Functions ---

export interface DiscoveryStatus {
    totalCompanies: number;
    companiesWithCareerPage: number;
    companiesCheckedToday: number;
    pendingCompanies: number;
}

export interface DiscoveryResult {
    company: string;
    careerPage: string;
    jobsFound: number;
    newJobs: number;
    jobs: Array<{ id: string; title: string; companyName: string; location: string }>;
}

export async function seedCompanies(): Promise<{ message: string; total: number }> {
    const response = await fetch(`${API_BASE_URL}/discovery/seed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error(`Failed to seed companies: ${response.statusText}`);
    }

    return response.json();
}

export interface DiscoveredCompany {
    name: string;
    homepageUrl: string;
    industry?: string;
    isNew: boolean;
}

export interface CompanyDiscoveryResult {
    summary: {
        discovered: number;
        newCompanies: number;
        totalInDatabase: number;
    };
    companies: DiscoveredCompany[];
    logs: Array<{ step: string; message: string; timestamp: string }>;
}

export async function discoverCompanies(query?: string, count: number = 30): Promise<CompanyDiscoveryResult> {
    const response = await fetch(`${API_BASE_URL}/discovery/discover-companies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, count }),
    });

    if (!response.ok) {
        throw new Error(`Failed to discover companies: ${response.statusText}`);
    }

    return response.json();
}

export interface DiscoveryLog {
    company: string;
    status: 'success' | 'no_jobs' | 'no_career_page' | 'error';
    message: string;
    jobsFound: number;
    newJobs: number;
    careerPage?: string;
    timestamp: string;
}

export interface DiscoveryRunResult {
    summary: {
        targetSuccessful: number;
        actualSuccessful: number;
        totalProcessed: number;
        totalJobs: number;
        totalNewJobs: number;
        completed: boolean;
    };
    logs: DiscoveryLog[];
}

export async function runDiscovery(targetSuccessful: number = 10): Promise<DiscoveryRunResult> {
    const response = await fetch(`${API_BASE_URL}/discovery/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetSuccessful }),
    });

    if (!response.ok) {
        throw new Error(`Failed to run discovery: ${response.statusText}`);
    }

    return response.json();
}

export async function getDiscoveryStatus(): Promise<DiscoveryStatus> {
    const response = await fetch(`${API_BASE_URL}/discovery/status`, {
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error(`Failed to get discovery status: ${response.statusText}`);
    }

    return response.json();
}

export interface CleanupResult {
    message: string;
    deletedJobs: number;
    deletedCompanies: number;
    deletedCompanyNames: string[];
}

export async function cleanupEmptyCompanies(): Promise<CleanupResult> {
    const response = await fetch(`${API_BASE_URL}/discovery/cleanup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error(`Failed to cleanup: ${response.statusText}`);
    }

    return response.json();
}

// --- Saved Jobs API Functions ---

export interface SavedJobFromAPI {
    id: string;
    savedAt: string;
    notes: string | null;
    job: JobFromAPI | null;
}

export async function saveJob(userId: string, jobId: string, notes?: string): Promise<{ message: string; savedJobId: string }> {
    const response = await fetch(`${API_BASE_URL}/saved-jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, jobId, notes }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Failed to save job: ${response.statusText}`);
    }

    return response.json();
}

export async function unsaveJob(userId: string, jobId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/saved-jobs/${jobId}?userId=${encodeURIComponent(userId)}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(`Failed to unsave job: ${response.statusText}`);
    }
}

export async function getSavedJobs(userId: string): Promise<{ count: number; savedJobs: SavedJobFromAPI[] }> {
    const response = await fetch(`${API_BASE_URL}/saved-jobs?userId=${encodeURIComponent(userId)}`, {
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error(`Failed to get saved jobs: ${response.statusText}`);
    }

    return response.json();
}

export async function isJobSaved(userId: string, jobId: string): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/saved-jobs/check/${jobId}?userId=${encodeURIComponent(userId)}`, {
        cache: 'no-store',
    });

    if (!response.ok) {
        return false;
    }

    const data = await response.json();
    return data.isSaved;
}
