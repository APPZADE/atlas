import Skeleton from '@/components/Skeleton';

export default function Loading() {
    return (
        <div className="min-h-screen bg-[#0f172a] p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Skeleton */}
                <div className="flex flex-col items-center space-y-4 pt-8">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-16 w-3/4 md:w-1/2" />
                    <Skeleton className="h-6 w-1/2 md:w-1/3" />
                </div>

                {/* Search Bar Skeleton */}
                <div className="max-w-2xl mx-auto">
                    <Skeleton className="h-14 w-full rounded-2xl" />
                </div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(9)].map((_, i) => (
                        <Skeleton key={i} className="h-48 rounded-2xl" />
                    ))}
                </div>
            </div>
        </div>
    );
}
