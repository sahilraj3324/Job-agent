import { getJob, getJobs } from '../../../config/api';
import { mapApiJobDetailToJob } from '../../../config/mappers';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    try {
        const jobs = await getJobs();
        return jobs.map((job) => ({ id: job.id }));
    } catch {
        return [];
    }
}

export default async function JobPage({ params }: PageProps) {
    const { id } = await params;

    let job;
    try {
        const apiJob = await getJob(id);
        job = mapApiJobDetailToJob(apiJob);
    } catch {
        notFound();
    }

    return (
        <div className="max-w-[1000px] mx-auto px-6 py-12">
            <div className="mb-8">
                <Link href="/" className="text-blue-500 hover:text-blue-600 font-medium inline-flex items-center gap-1 transition-colors">
                    ← Back to Jobs
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                {/* Header Section */}
                <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row gap-8 items-start">
                    <img src={job.logo} alt={`${job.company} logo`} className="w-20 h-20 rounded-2xl object-cover bg-slate-50 border border-slate-100" />
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">{job.title}</h1>
                        <p className="text-lg text-slate-600 font-medium mb-4">{job.company} • {job.location}</p>

                        <div className="flex flex-wrap gap-3">
                            <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-blue-100">
                                {job.type}
                            </span>
                            <span className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-purple-100">
                                {job.experience} Experience
                            </span>
                            {job.salary && (
                                <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-emerald-100">
                                    {job.salary}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-4">About the Job</h2>
                            {job.description ? (
                                <div
                                    className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-ul:space-y-1 prose-a:text-blue-500 prose-a:no-underline hover:prose-a:underline"
                                    dangerouslySetInnerHTML={{ __html: job.description }}
                                />
                            ) : (
                                <p className="text-slate-600">No description available.</p>
                            )}
                        </section>
                    </div>

                    <aside className="space-y-8">
                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 space-y-6">
                            <h3 className="font-bold text-slate-900">Job Overview</h3>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wide mb-1">Posted</p>
                                    <p className="text-slate-900 font-semibold">{job.postedAt}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wide mb-1">Employment Type</p>
                                    <p className="text-slate-900 font-semibold">{job.type}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wide mb-1">Experience</p>
                                    <p className="text-slate-900 font-semibold">{job.experience}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wide mb-1">Location</p>
                                    <p className="text-slate-900 font-semibold">{job.location}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wide mb-1">Source</p>
                                    <p className="text-slate-900 font-semibold">{job.source}</p>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-200">
                                <h4 className="font-bold text-slate-900 mb-3">Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {job.tags.map((tag, i) => (
                                        <span key={i} className="bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded-md text-sm font-medium">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <a
                            href={job.applyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full bg-blue-600 text-white text-center font-bold text-lg py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Apply on Company Website
                        </a>
                    </aside>
                </div>
            </div>
        </div>
    );
}
