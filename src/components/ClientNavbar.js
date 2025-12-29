"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Navbar = dynamic(
    () => import('@/components/Navbar'),
    { ssr: false }
);

export default function ClientNavbar() {
    return (
        <Suspense fallback={null}>
            <Navbar />
        </Suspense>
    );
}
