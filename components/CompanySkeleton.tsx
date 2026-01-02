export default function CompanySkeleton() {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col items-center gap-4 animate-pulse">
            <div className="w-16 h-16 rounded-xl bg-slate-200" />
            <div className="space-y-2 w-full text-center">
                <div className="h-5 bg-slate-200 rounded w-3/4 mx-auto" />
                <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto" />
            </div>
            <div className="h-4 w-20 bg-slate-200 rounded" />
        </div>
    );
}
