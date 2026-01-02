const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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
