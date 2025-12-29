"use client";

import { useLanguage } from '@/context/LanguageContext';
// import LanguageSwitcher from './LanguageSwitcher'; // Removed
import { Shuffle, Gamepad2, Scale, Book } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Header() {
    const { t } = useLanguage();
    const router = useRouter();

    const handleRandom = async () => {
        // Fetch list of countries from an API route or just hardcode a few for "demo"
        // But to be correct, let's fetch the sitemap-like list or a new API.
        try {
            const res = await fetch('/api/countries');
            const countries = await res.json();
            const random = countries[Math.floor(Math.random() * countries.length)];
            router.push(`/country/${encodeURIComponent(random.displayName)}`);
        } catch (e) {
            console.error("Random failed");
        }
    };

    return (
        <header className="text-center space-y-4 pt-8 relative">
            <div className="absolute top-8 right-8 flex gap-4">
                <Link
                    href="/passport"
                    className="p-2 rounded-full bg-slate-800 text-amber-400 hover:bg-amber-900/50 transition-colors"
                    title="My Passport"
                >
                    <Book size={20} />
                </Link>
                <Link
                    href="/compare"
                    className="p-2 rounded-full bg-slate-800 text-purple-400 hover:bg-purple-900/50 transition-colors"
                    title="Compare Countries"
                >
                    <Scale size={20} />
                </Link>
                <Link
                    href="/quiz"
                    className="p-2 rounded-full bg-slate-800 text-emerald-400 hover:bg-emerald-900/50 transition-colors"
                    title="Play Quiz"
                >
                    <Gamepad2 size={20} />
                </Link>
                <button
                    onClick={handleRandom}
                    className="p-2 rounded-full bg-slate-800 text-cyan-400 hover:bg-cyan-900/50 transition-colors"
                    title="Random Country"
                >
                    <Shuffle size={20} />
                </button>
                {/* LanguageSwitcher Removed */}
            </div>

            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600 font-[family-name:var(--font-outfit)]">
                {t.title}
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                {t.subtitle}
            </p>
        </header>
    );
}
