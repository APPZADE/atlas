"use client";

import { useState, useMemo } from 'react';
import { Search, MapPin, Globe, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useFavorites } from '@/context/FavoritesContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function CountryList({ initialCountries }) {
    const { isFavorite, toggleFavorite } = useFavorites();
    const [searchTerm, setSearchTerm] = useState('');
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    const filteredCountries = useMemo(() => {
        let result = initialCountries;

        if (showFavoritesOnly) {
            result = result.filter(c => isFavorite(c.displayName));
        }

        if (searchTerm) {
            result = result.filter(c =>
                c.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.continent.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return result;
    }, [initialCountries, searchTerm, showFavoritesOnly, isFavorite]);

    return (
        <div className="space-y-12">
            {/* Search Bar & Filters */}
            <div className="flex flex-col md:flex-row gap-6 max-w-4xl mx-auto items-center">
                <div className="relative group flex-1 w-full">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Ülke Ara..."
                        className="w-full pl-14 pr-6 py-5 bg-[#0a0a1a] border border-white/10 rounded-full focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_30px_rgba(0,243,255,0.2)] text-white placeholder-slate-600 transition-all font-mono tracking-wide"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <button
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className={`px-8 py-5 rounded-full border transition-all flex items-center gap-3 font-bold uppercase tracking-wider text-sm ${showFavoritesOnly
                        ? 'bg-rose-500/10 border-rose-500 text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                        : 'bg-[#0a0a1a] border-white/10 text-slate-500 hover:text-white hover:border-white/30'
                        }`}
                >
                    <Heart size={20} fill={showFavoritesOnly ? "currentColor" : "none"} />
                    <span>Favoriler</span>
                </button>
            </div>

            {/* Bento Grid */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[300px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <AnimatePresence mode='popLayout'>
                    {filteredCountries.map((country, index) => {
                        // Make every 7th item span 2 columns for "Bento" feel (pseudo-random)
                        const isLarge = index % 7 === 0 || index % 11 === 0;
                        const spanClass = isLarge ? "md:col-span-2 md:row-span-2" : "col-span-1 row-span-1";

                        return (
                            <motion.div
                                key={country.displayName}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={`group relative rounded-3xl overflow-hidden border border-white/5 bg-[#0a0a1f] ${spanClass}`}
                            >
                                {/* Background Image with Glitch Effect on Hover */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-20 transition-all duration-500 grayscale group-hover:grayscale-0 scale-100 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${country.flags?.png})` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-transparent" />

                                {/* Content */}
                                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                    <div className="absolute top-4 right-4 z-20">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleFavorite(country.displayName);
                                            }}
                                            className="p-3 rounded-full bg-black/40 backdrop-blur-md text-slate-400 hover:text-rose-500 transition-colors"
                                        >
                                            <Heart size={20} className={isFavorite(country.displayName) ? "text-rose-500 fill-rose-500" : ""} />
                                        </button>
                                    </div>

                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <div className="flex items-center gap-2 text-cyan-400 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <Globe size={14} />
                                            <span className="text-xs font-bold uppercase tracking-widest">{country.continent}</span>
                                        </div>

                                        <Link href={`/country/${encodeURIComponent(country.displayName)}`} className="block">
                                            <h3 className={`font-black text-white leading-none mb-2 group-hover:text-cyan-400 transition-colors ${isLarge ? 'text-4xl' : 'text-2xl'}`}>
                                                {country.displayName}
                                            </h3>

                                            <div className="flex items-center gap-2 text-slate-400 text-sm font-mono group-hover:text-white transition-colors">
                                                <span>Detaylar</span>
                                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </Link>
                                    </div>
                                </div>

                                {/* Neon Border Overlay */}
                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-500/50 rounded-3xl transition-colors duration-300 pointer-events-none" />
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </motion.div>

            {filteredCountries.length === 0 && (
                <div className="text-center text-slate-500 py-20 font-mono">
                    <p>Sonuç Bulunamadı.</p>
                </div>
            )}
        </div>
    );
}
