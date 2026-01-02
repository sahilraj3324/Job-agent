'use client';

import { useState, useEffect } from 'react';
import { getCompanies, CompanyFromAPI } from '../config/api';
import CompanyCard from '../components/CompanyCard';
import CompanySkeleton from '../components/CompanySkeleton';

export default function Home() {
  const [companies, setCompanies] = useState<CompanyFromAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCompanies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCompanies();
      setCompanies(data);
    } catch (err) {
      console.error('Failed to fetch companies:', err);
      setError('Failed to load companies. Please try again.');
      setCompanies([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const filteredCompanies = searchQuery
    ? companies.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : companies;

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <div className="text-center mb-12 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Find Jobs Directly From <span className="text-blue-500">Company Websites</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8">
          Fresh jobs posted directly on company career pages
        </p>

        {/* Search */}
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-3 border border-slate-200 rounded-xl text-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
          />
        </div>
      </div>

      {error ? (
        <div className="text-center py-16 px-8 bg-red-50 rounded-xl border border-red-200 text-red-600">
          <p className="font-semibold">{error}</p>
          <button
            onClick={fetchCompanies}
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <CompanySkeleton key={i} />
          ))}
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="text-center py-20 px-8 bg-white rounded-xl border border-dashed border-slate-300">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🏢</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No companies found</h3>
          <p className="text-slate-500">
            {searchQuery ? 'Try a different search term.' : 'No companies with jobs available yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredCompanies.map((company) => (
            <CompanyCard key={company.name} company={company} />
          ))}
        </div>
      )}
    </div>
  );
}
