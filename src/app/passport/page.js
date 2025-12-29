"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Book, Stamp } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function PassportPage() {
    const { t } = useLanguage();
    const [visits, setVisits] = useState([]);

    useEffect(() => {
        // visited_countries is array of objects { name, date, flag }
        const stored = localStorage.getItem('visited_countries');
        if (stored) {
            try {
                // Parse and reverse to show newest first
                setVisits(JSON.parse(stored).reverse());
            } catch (e) {
                console.error("Failed to parse passport", e);
            }
        }
    }, []);

    return (
        <div className="min-h-screen bg-[#0f172a] p-4 md:p-8 pb-20 relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex items-center gap-4 mb-12">
                    <Link href="/" className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-full hover:bg-slate-700 transition">
                        <ArrowLeft size={20} />
                        <span className="font-semibold">Geri Dön</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400">
                            <Book size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Pasaportum</h1>
                            <p className="text-slate-400 text-sm">Tüm tanınan ülkeler için geçerlidir</p>
                        </div>
                    </div>
                </div>

                {visits.length === 0 ? (
                    <div className="text-center py-20 text-slate-500">
                        <Stamp size={64} className="mx-auto mb-4 opacity-20" />
                        <h2 className="text-xl font-semibold mb-2">Henüz Damga Yok</h2>
                        <p>Damga toplamak için ülkeleri keşfet!</p>
                        <Link href="/" className="inline-block mt-6 px-6 py-2 bg-cyan-500 text-white rounded-full font-bold hover:bg-cyan-600 transition">
                            Keşfe Başla
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {visits.map((visit, index) => (
                            <motion.div
                                key={`${visit.name}-${index}`}
                                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                                animate={{ opacity: 1, scale: 1, rotate: Math.random() * 6 - 3 }}
                                transition={{ delay: index * 0.05 }}
                                className="aspect-[3/4] bg-[#fdf6e3] text-slate-800 p-4 rounded-xl shadow-xl relative overflow-hidden border-2 border-amber-900/10 group hover:scale-105 transition-transform"
                                style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)' }}
                            >
                                {/* Stamp Effect */}
                                <div className="absolute top-2 right-2 opacity-30 rotate-12 text-amber-600 border-2 border-amber-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-[10px] uppercase">
                                    ZİYARET EDİLDİ
                                </div>

                                <div className="h-full flex flex-col items-center justify-between py-4 border-2 border-amber-900/20 border-dashed rounded-lg">
                                    <div className="text-center">
                                        <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold mb-2 inline-block">
                                            {visit.date}
                                        </span>
                                    </div>

                                    <div className="w-20 h-20 rounded-full overflow-hidden shadow-inner ring-4 ring-amber-500/20 grayscale group-hover:grayscale-0 transition-all duration-500">
                                        {visit.flag ? (
                                            <img src={visit.flag} alt="Flag" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-slate-300" />
                                        )}
                                    </div>

                                    <h3 className="font-serif font-bold text-lg text-amber-900 text-center uppercase leading-tight px-2">
                                        {visit.name}
                                    </h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
