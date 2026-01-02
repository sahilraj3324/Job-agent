export default function JobSkeleton() {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-4 animate-pulse">
            {/* Header */}
            <div className="flex items-start gap-4">
                {/* Logo */}
                <div className="w-12 h-12 rounded-lg bg-slate-200" />
                <div className="flex-1 space-y-2">
                    {/* Title */}
                    <div className="h-5 bg-slate-200 rounded w-3/4" />
                    {/* Company */}
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>
                {/* Badge */}
                <div className="w-20 h-6 bg-slate-200 rounded" />
            </div>

            {/* Tags */}
            <div className="flex gap-2">
                <div className="h-6 w-16 bg-slate-200 rounded" />
                <div className="h-6 w-20 bg-slate-200 rounded" />
                <div className="h-6 w-14 bg-slate-200 rounded" />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                <div className="space-y-1">
                    <div className="h-4 w-24 bg-slate-200 rounded" />
                    <div className="h-3 w-16 bg-slate-200 rounded" />
                </div>
                <div className="h-9 w-24 bg-slate-200 rounded-lg" />
            </div>
        </div>
    );
}
