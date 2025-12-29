"use client";

import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import CurrencyConverter from './CurrencyConverter';

export default function AnimatedContent({ countryData, states }) {
    const { t } = useLanguage();

    // Extract currency code (e.g., "EUR")
    const currencyCode = countryData.currencies ? Object.keys(countryData.currencies)[0] : null;

    // Fallback translations for keys that might not suffice or specific data fields
    const labels = {
        region: t.region, // "Bölge"
        subregion: t.subregion, // "Alt Bölge"
        capital: t.capital, // "Başkent"
        population: t.population, // "Nüfus"
        // Add ad-hoc translations if missing from context, but context was "comprehensive"
        // Let's use the context keys.
        neighbors: t.neighbors || "Neighbors"
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
        >
            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <motion.div variants={item}>
                    <InfoCard title={t.geography || "Geography"}>
                        <div className="space-y-4">
                            <InfoRow label={t.region || "Region"} value={countryData.region} />
                            <InfoRow label={t.subregion || "Subregion"} value={countryData.subregion} />
                            <InfoRow label={t.capital || "Capital"} value={countryData.capital?.join(', ')} />
                            <InfoRow label="Area" value={`${countryData.area?.toLocaleString()} km²`} />
                        </div>
                    </InfoCard>
                </motion.div>

                <motion.div variants={item}>
                    <InfoCard title={t.society || "Society"}>
                        <div className="space-y-4">
                            <InfoRow label={t.population || "Population"} value={countryData.population?.toLocaleString()} />
                            <InfoRow label={t.languages || "Languages"} value={Object.values(countryData.languages || {}).join(', ')} />
                            <InfoRow label="Demonym" value={countryData.demonyms?.eng?.m} />
                        </div>
                    </InfoCard>
                </motion.div>

                <motion.div variants={item}>
                    <InfoCard title={t.economy || "Economy"}>
                        <div className="space-y-4">
                            <InfoRow label={t.currency || "Currency"} value={Object.values(countryData.currencies || {}).map(c => `${c.name} (${c.symbol})`).join(', ')} />
                            <InfoRow label="Driving Side" value={countryData.car?.side?.toUpperCase()} />
                        </div>
                    </InfoCard>
                </motion.div>

                <motion.div variants={item}>
                    <InfoCard title={t.codes || "Codes"}>
                        <div className="space-y-4">
                            <InfoRow label="CCA2" value={countryData.cca2} />
                            <InfoRow label="CCA3" value={countryData.cca3} />
                            <InfoRow label="CIOC" value={countryData.cioc} />
                        </div>
                    </InfoCard>
                </motion.div>
            </div>

            {/* Currency Converter */}
            {currencyCode && (
                <motion.div variants={item} className="mt-8">
                    <CurrencyConverter currencyCode={currencyCode} />
                </motion.div>
            )}

            {/* Administrative Divisions */}
            {states.length > 0 && (
                <motion.div variants={item} className="mt-8 glass-panel p-8 rounded-3xl">
                    <h2 className="text-3xl font-bold text-white mb-6">{t.adminDivisions} ({states.length})</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {states.map((state, idx) => (
                            <div key={idx} className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition border border-white/5">
                                <div className="font-semibold text-cyan-100">{state.name}</div>
                                {state.isoCode && <div className="text-xs text-slate-500 mt-1">Code: {state.isoCode}</div>}
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Neighboring Countries */}
            {countryData.neighborData && countryData.neighborData.length > 0 && (
                <motion.div variants={item} className="mt-8 glass-panel p-8 rounded-3xl">
                    <h2 className="text-3xl font-bold text-white mb-6">{t.neighbors || "Neighbors"} ({countryData.neighborData.length})</h2>
                    <div className="flex flex-wrap gap-4">
                        {countryData.neighborData.map((neighbor) => (
                            <Link
                                key={neighbor.cca3}
                                href={`/country/${encodeURIComponent(neighbor.name)}`}
                                className="group flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 hover:border-indigo-500/50 transition-all text-indigo-100"
                            >
                                <span>{neighbor.name}</span>
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}

function InfoCard({ title, children }) {
    return (
        <div className="glass-panel p-6 rounded-2xl h-full">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">{title}</h2>
            {children}
        </div>
    );
}

function InfoRow({ label, value }) {
    if (!value) return null;
    return (
        <div className="flex justify-between items-center py-1">
            <span className="text-slate-400">{label}</span>
            <span className="text-slate-100 font-medium text-right">{value}</span>
        </div>
    );
}
