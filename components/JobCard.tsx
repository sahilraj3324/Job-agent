import Link from 'next/link';
import { Job } from '../types';
import SaveJobButton from './SaveJobButton';

interface JobCardProps {
    job: Job;
    onClick?: (job: Job) => void; // Optional now, or removed if we fully switch
}

export default function JobCard({ job }: JobCardProps) {
    const isCompanySource = job.source === 'Company Website';

    return (
        <Link
            href={`/jobs/${job.id}`}
            className="bg-white border border-slate-200 rounded-xl p-6 cursor-pointer flex flex-col gap-4 relative overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:border-blue-500 transition-all duration-200"
        >
            <div className="flex items-start gap-4">
                <img src={job.logo} alt={`${job.company} logo`} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-1 leading-snug">{job.title}</h3>
                    <p className="text-sm font-medium text-slate-600">{job.company}</p>
                </div>
                <div className="flex items-center gap-2">
                    <SaveJobButton jobId={job.id} variant="icon" />
                    <span className={`text-[0.65rem] font-semibold px-2 py-1 rounded-md whitespace-nowrap border ${isCompanySource
                        ? 'bg-blue-100 text-blue-800 border-blue-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                        {job.source}
                    </span>
                </div>
            </div>

            <div className="flex-1">
                <div className="flex flex-wrap gap-2">
                    {job.tags.slice(0, 4).map((tag, index) => (
                        <span key={index} className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-md">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-200">
                <div className="flex flex-col gap-1">
                    <span className="text-sm text-slate-600 flex items-center gap-1">
                        📍 {job.location}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                        🕒 {job.postedAt}
                    </span>
                </div>
                <span className="bg-transparent text-blue-500 border border-blue-500 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-500 hover:text-white transition-all">
                    View Job
                </span>
            </div>
        </Link>
    );
}
