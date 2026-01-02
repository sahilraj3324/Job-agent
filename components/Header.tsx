import Link from 'next/link';

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 h-[70px] z-50 bg-white/70 backdrop-blur-md border-b border-slate-200 transition-all duration-300">
            <div className="max-w-[1400px] mx-auto h-full px-6 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold text-slate-900 tracking-tight">
                    Job<span className="text-blue-500">Hunt</span>
                </Link>
                <nav className="hidden md:flex gap-8">
                    <Link href="/" className="text-[0.95rem] font-medium text-slate-600 hover:text-blue-500 transition-colors">Find Jobs</Link>
                    <Link href="#" className="text-[0.95rem] font-medium text-slate-600 hover:text-blue-500 transition-colors">Companies</Link>
                    <Link href="#" className="text-[0.95rem] font-medium text-slate-600 hover:text-blue-500 transition-colors">Salaries</Link>
                </nav>
                <div className="flex items-center gap-4">
                    <button className="text-[0.95rem] font-semibold text-slate-600 hover:text-slate-900 transition-colors px-4 py-2">Sign In</button>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:-translate-y-px shadow-sm hover:shadow-md">Post a Job</button>
                </div>
            </div>
        </header>
    );
}
