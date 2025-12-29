import Skeleton from '@/components/Skeleton';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Loading() {
    return (
        <div className="min-h-screen bg-[#0f172a] p-8 pb-20">
            <div className="max-w-6xl mx-auto">
                <div className="inline-flex items-center text-cyan-400/50 mb-8">
                    <ArrowLeft className="mr-2" size={20} />
                    Loading...
                </div>

                {/* Hero Skeleton */}
                <div className="relative overflow-hidden rounded-3xl bg-slate-900/50 border border-white/5 p-8 md:p-12 mb-8 animate-pulse">
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-8">
                        {/* Flag Placeholder */}
                        <div className="w-full md:w-1/3 h-48 bg-slate-800/50 rounded-xl" />

                        <div className="flex-1 w-full space-y-4">
                            <Skeleton className="h-16 w-3/4" />
                            <Skeleton className="h-8 w-1/2" />
                            <div className="flex gap-4 mt-6">
                                <Skeleton className="h-10 w-24 rounded-full" />
                                <Skeleton className="h-10 w-24 rounded-full" />
                                <Skeleton className="h-10 w-24 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detail Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl h-48 animate-pulse">
                            <Skeleton className="h-8 w-1/3 mb-6" />
                            <div className="space-y-4">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
