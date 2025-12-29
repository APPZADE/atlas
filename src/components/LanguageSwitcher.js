"use client";
import { useLanguage } from '@/context/LanguageContext';

export default function LanguageSwitcher() {
    const { language, toggleLanguage } = useLanguage();

    return (
        <div className="flex gap-2 bg-slate-900/50 p-1 rounded-full border border-white/10 backdrop-blur-md">
            <button
                onClick={() => toggleLanguage('tr')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition ${language === 'tr' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
                TR
            </button>
            <button
                onClick={() => toggleLanguage('en')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition ${language === 'en' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
                EN
            </button>
        </div>
    );
}
