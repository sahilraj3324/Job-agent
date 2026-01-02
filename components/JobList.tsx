import { Job } from '../types';
import JobCard from './JobCard';
import JobSkeleton from './JobSkeleton';

interface JobListProps {
    jobs: Job[];
    isLoading: boolean;
    onJobClick?: (job: Job) => void;
}

export default function JobList({ jobs, isLoading }: JobListProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
                {[...Array(6)].map((_, i) => (
                    <JobSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (jobs.length === 0) {
        return (
            <div className="text-center py-20 px-8 bg-white rounded-xl border border-dashed border-slate-300">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🔍</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No jobs found</h3>
                <p className="text-slate-500 max-w-sm mx-auto">
                    We couldn't find any jobs matching your criteria. Try adjusting your filters or search terms.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
            {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
            ))}
        </div>
    );
}
