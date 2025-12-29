"use client";

import { useState, useEffect } from 'react';
// import { useLanguage } from '@/context/LanguageContext'; // Removed
import { BookOpen, Volume2, VolumeX } from 'lucide-react';

export default function CountryDescription({ summaries }) {
    const [speaking, setSpeaking] = useState(false);

    // summaries is object { tr: "...", en: "..." }
    const text = summaries.tr || summaries.en || "Açıklama bulunamadı.";

    useEffect(() => {
        // Cancel speech if unmounting or text changes
        window.speechSynthesis.cancel();
        setSpeaking(false);
    }, [text]);

    const toggleSpeech = () => {
        if (speaking) {
            window.speechSynthesis.cancel();
            setSpeaking(false);
        } else {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'tr-TR';
            utterance.onend = () => setSpeaking(false);
            window.speechSynthesis.speak(utterance);
            setSpeaking(true);
        }
    };

    return (
        <div className="glass-panel p-8 rounded-3xl mb-8 border-l-4 border-cyan-500 relative">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3 text-cyan-400">
                    <BookOpen size={24} />
                    <h2 className="text-xl font-bold uppercase tracking-wider">
                        Hakkında
                    </h2>
                </div>

                <button
                    onClick={toggleSpeech}
                    className={`p-2 rounded-full transition-colors ${speaking ? 'bg-cyan-500 text-white animate-pulse' : 'bg-slate-800 text-cyan-400 hover:bg-slate-700'}`}
                    title="Listen"
                >
                    {speaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
            </div>

            <p className="text-lg leading-relaxed text-slate-200">
                {text}
            </p>
            <div className="mt-4 text-xs text-slate-500 text-right">
                Source: Wikipedia
            </div>
        </div>
    );
}
