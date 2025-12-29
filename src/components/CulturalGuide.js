"use client";

import { motion } from 'framer-motion';
import { Utensils, MapPin, MessageCircle } from 'lucide-react';
import { culturalData } from '@/lib/cultural-data';

export default function CulturalGuide({ countryName }) {
    // English name usually matches our key in cultural-data.
    // If countryName is translated, we might need a map.
    // For now assuming countryName passed is the English/API name ("Turkey", "Italy").
    // Wait, we localized names to Turkish in previous steps?
    // RestCountries API returns 'name.common' in English often, or localized.
    // Let's assume keys are English for simplicity or check both.

    // Actually our static data keys are english: Turkey, Italy.
    // But our UI is displaying "Türkiye" (maybe).
    // Let's try to match loosely or use a helper.

    const data = culturalData[countryName] || culturalData[Object.keys(culturalData).find(k => k === countryName)] || null;

    if (!data) return (
        <div className="mt-12 p-6 glass-panel-premium rounded-3xl text-center text-slate-500">
            <p>Bu ülke için henüz detaylı kültürel rehber hazır değil.</p>
        </div>
    );

    return (
        <div className="mt-12 space-y-8">
            <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-8 font-[family-name:var(--font-orbitron)]">
                KÜLTÜREL REHBER
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Food */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-panel-premium p-6 rounded-3xl border-t-4 border-orange-500"
                >
                    <div className="flex items-center gap-3 mb-4 text-orange-400">
                        <Utensils size={24} />
                        <h3 className="text-xl font-bold">Mutfak</h3>
                    </div>
                    <ul className="space-y-4">
                        {data.cuisine.map((item, i) => (
                            <li key={i} className="bg-white/5 p-3 rounded-xl hover:bg-white/10 transition">
                                <div className="font-bold text-white">{item.name}</div>
                                <div className="text-sm text-slate-400">{item.desc}</div>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Sights */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-panel-premium p-6 rounded-3xl border-t-4 border-cyan-500"
                >
                    <div className="flex items-center gap-3 mb-4 text-cyan-400">
                        <MapPin size={24} />
                        <h3 className="text-xl font-bold">Gezilecek Yerler</h3>
                    </div>
                    <ul className="space-y-4">
                        {data.sights.map((item, i) => (
                            <li key={i} className="bg-white/5 p-3 rounded-xl hover:bg-white/10 transition">
                                <div className="font-bold text-white">{item.name}</div>
                                <div className="text-sm text-slate-400">{item.desc}</div>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Phrases */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-panel-premium p-6 rounded-3xl border-t-4 border-pink-500"
                >
                    <div className="flex items-center gap-3 mb-4 text-pink-400">
                        <MessageCircle size={24} />
                        <h3 className="text-xl font-bold">Sözlük</h3>
                    </div>
                    <ul className="space-y-4">
                        {data.phrases.map((item, i) => (
                            <li key={i} className="bg-white/5 p-3 rounded-xl hover:bg-white/10 transition flex justify-between items-center">
                                <div>
                                    <div className="font-bold text-white">{item.original}</div>
                                    <div className="text-xs text-pink-400">{item.pron}</div>
                                </div>
                                <div className="text-sm text-slate-300 italic">"{item.tr}"</div>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            </div>
        </div>
    );
}
