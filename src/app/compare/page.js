"use client";

import nextDynamic from 'next/dynamic';
import { Suspense } from 'react';

const CompareContent = nextDynamic(
    () => import('@/components/CompareContent'),
    { ssr: false }
);

export const dynamic = 'force-dynamic';

export default function ComparePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0f172a] p-8 text-white flex justify-center items-center">Modül Yükleniyor...</div>}>
            <CompareContent />
        </Suspense>
    );
}
