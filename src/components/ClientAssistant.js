"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import the Provider and Component with SSR disabled
const AssistantProvider = dynamic(
    () => import('@/context/AssistantContext').then(mod => mod.AssistantProvider),
    { ssr: false }
);

const AIAssistant = dynamic(
    () => import('@/components/AIAssistant'),
    { ssr: false }
);

export default function ClientAssistant() {
    return (
        <Suspense fallback={null}>
            <AssistantProvider>
                <AIAssistant />
            </AssistantProvider>
        </Suspense>
    );
}
