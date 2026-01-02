import Link from 'next/link';
import { CompanyFromAPI } from '../config/api';

interface CompanyCardProps {
    company: CompanyFromAPI;
}

export default function CompanyCard({ company }: CompanyCardProps) {
    return (
        <Link
            href={`/companies/${encodeURIComponent(company.name)}`}
            className="bg-white border border-slate-200 rounded-xl p-6 cursor-pointer flex flex-col items-center text-center gap-4 hover:-translate-y-1 hover:shadow-lg hover:border-blue-500 transition-all duration-200"
        >
            <img
                src={company.logo}
                alt={`${company.name} logo`}
                className="w-16 h-16 rounded-xl object-cover bg-slate-100"
            />
            <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{company.name}</h3>
                <p className="text-sm text-slate-500">
                    {company.jobCount} {company.jobCount === 1 ? 'job' : 'jobs'} available
                </p>
            </div>
            <span className="text-blue-500 text-sm font-medium">View Jobs →</span>
        </Link>
    );
}
