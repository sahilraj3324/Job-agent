import { FilterState } from '../types';

interface JobFiltersProps {
    filters: FilterState;
    onFilterChange: (newFilters: FilterState) => void;
}

export default function JobFilters({ filters, onFilterChange }: JobFiltersProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onFilterChange({ ...filters, [name]: value });
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col gap-6 h-fit sticky top-24">
            <h3 className="text-lg font-semibold text-slate-900 pb-4 border-b border-slate-200">Filter Jobs</h3>

            <div className="flex flex-col gap-2">
                <label htmlFor="role" className="text-sm font-medium text-slate-600">Role</label>
                <input
                    type="text"
                    id="role"
                    name="role"
                    placeholder="e.g. Software Engineer"
                    value={filters.role}
                    onChange={handleChange}
                    className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="location" className="text-sm font-medium text-slate-600">Location</label>
                <input
                    type="text"
                    id="location"
                    name="location"
                    placeholder="e.g. New York"
                    value={filters.location}
                    onChange={handleChange}
                    className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="type" className="text-sm font-medium text-slate-600">Job Type</label>
                <div className="relative">
                    <select
                        id="type"
                        name="type"
                        value={filters.type}
                        onChange={handleChange}
                        className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-900 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    >
                        <option value="">Any</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Onsite">Onsite</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
