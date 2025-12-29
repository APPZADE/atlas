"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Scale, Users, Globe, Landmark, TrendingUp } from 'lucide-react';
import Link from 'next/link';

// Simple Skeleton for loading states
function Skeleton({ className }) {
    return <div className={`animate-pulse bg-slate-800/50 rounded-xl ${className}`} />;
}

export default function CompareContent() {
    const [countries, setCountries] = useState([]);
    const [selectedA, setSelectedA] = useState('');
    const [selectedB, setSelectedB] = useState('');
    const [dataA, setDataA] = useState(null);
    const [dataB, setDataB] = useState(null);
    const [loadingA, setLoadingA] = useState(false);
    const [loadingB, setLoadingB] = useState(false);

    useEffect(() => {
        // Fetch list of countries from our internal API (which supports DB now)
        fetch('/api/countries')
            .then(res => res.json())
            .then(data => {
                // Sort alphabetically
                data.sort((a, b) => a.displayName.localeCompare(b.displayName, 'tr'));
                setCountries(data);
            });
    }, []);

    const fetchCountryData = async (displayName, setData, setLoading) => {
        if (!displayName) {
            setData(null);
            return;
        }
        setLoading(true);

        const localCountry = countries.find(c => c.displayName === displayName);
        let queryName = localCountry ? (localCountry.cleanName || localCountry.displayName) : displayName;

        // Manual Map for reliable fetching from RestCountries
        const manualMap = {
            'Almanya': 'Germany',
            'Arnavutluk': 'Albania',
            'Avusturya': 'Austria',
            'Azerbaycan': 'Azerbaijan',
            'Belçika': 'Belgium',
            'Birleşik Krallık': 'United Kingdom',
            'Çekya': 'Czechia',
            'Danimarka': 'Denmark',
            'Estonya': 'Estonia',
            'Finlandiya': 'Finland',
            'Fransa': 'France',
            'Hırvatistan': 'Croatia',
            'Hollanda': 'Netherlands',
            'İrlanda': 'Ireland',
            'İspanya': 'Spain',
            'İsveç': 'Sweden',
            'İsviçre': 'Switzerland',
            'İtalya': 'Italy',
            'İzlanda': 'Iceland',
            'Japonya': 'Japan',
            'Karadağ': 'Montenegro',
            'Kuzey Makedonya': 'North Macedonia',
            'Letonya': 'Latvia',
            'Litvanya': 'Lithuania',
            'Macaristan': 'Hungary',
            'Mısır': 'Egypt',
            'Polonya': 'Poland',
            'Portekiz': 'Portugal',
            'Romanya': 'Romania',
            'Rusya Federasyonu': 'Russia',
            'Sırbistan': 'Serbia',
            'Slovakya': 'Slovakia',
            'Slovenya': 'Slovenia',
            'Yunanistan': 'Greece',
            'ABD': 'USA',
            'Brezilya': 'Brazil',
            'Çin Halk Cumhuriyeti': 'China',
            'Güney Kore': 'South Korea',
            'Kuzey Kore': 'North Korea',
        };

        queryName = manualMap[queryName] || queryName;

        // Special Case: KKTC
        if (queryName === 'Kuzey Kıbrıs Türk Cumhuriyeti' || queryName === 'KKTC') {
            setData({
                name: { common: 'Kuzey Kıbrıs Türk Cumhuriyeti', official: 'KKTC' },
                population: 382836,
                region: 'Europe/Asia',
                capital: ['Lefkoşa'],
                flags: { svg: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Flag_of_the_Turkish_Republic_of_Northern_Cyprus.svg' },
                isSpecial: true
            });
            setLoading(false);
            return;
        }

        try {
            // Priority: Translation -> Full Text Name -> Partial Name
            let res = await fetch(`https://restcountries.com/v3.1/translation/${encodeURIComponent(queryName)}`);

            // Fix for France returning territories first
            if (queryName === 'France') {
                // If fetching by translation 'France', API might return random territories. 
                // Better to use code if possible, but we only have names here.
                // Let's rely on finding 'FRA' in the result.
            }

            if (!res.ok) {
                res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(queryName)}?fullText=true`);
            }
            if (!res.ok) {
                res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(queryName)}`);
            }

            if (res.ok) {
                const data = await res.json();
                let country = data[0];

                // Smart Filter for France/general strictness
                if (queryName === 'France') {
                    const found = data.find(c => c.cca3 === 'FRA');
                    if (found) country = found;
                }

                // Flag Override
                if (country.cca3 === 'FRA') {
                    country.flags.svg = 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg';
                }

                setData(country);
            } else {
                console.error("Not found:", queryName);
                setData(null);
            }
        } catch (e) {
            console.error("Fetch failed", e);
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCountryData(selectedA, setDataA, setLoadingA); }, [selectedA]);
    useEffect(() => { fetchCountryData(selectedB, setDataB, setLoadingB); }, [selectedB]);

    const maxPop = Math.max(dataA?.population || 0, dataB?.population || 0);

    return (
        <div className="min-h-screen bg-[#0f172a] p-4 md:p-8 pb-20">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/" className="p-2 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 transition">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        Ülke Karşılaştır
                    </h1>
                </div>

                {/* Selectors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="glass-panel p-6 rounded-2xl border-t-4 border-purple-500">
                        <label className="block text-sm text-slate-400 mb-2 font-bold uppercase tracking-wider">1. Ülke</label>
                        <select
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                            value={selectedA}
                            onChange={(e) => setSelectedA(e.target.value)}
                        >
                            <option value="">Bir ülke seçin...</option>
                            {countries.map(c => <option key={`a-${c.id}`} value={c.displayName}>{c.displayName}</option>)}
                        </select>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl border-t-4 border-pink-500">
                        <label className="block text-sm text-slate-400 mb-2 font-bold uppercase tracking-wider">2. Ülke</label>
                        <select
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-pink-500 outline-none"
                            value={selectedB}
                            onChange={(e) => setSelectedB(e.target.value)}
                        >
                            <option value="">Bir ülke seçin...</option>
                            {countries.map(c => <option key={`b-${c.id}`} value={c.displayName}>{c.displayName}</option>)}
                        </select>
                    </div>
                </div>

                {/* Comparison View */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                    <div className="hidden md:flex absolute left-1/2 top-12 -translate-x-1/2 z-10 bg-slate-900 border border-slate-700 rounded-full w-12 h-12 items-center justify-center font-black text-slate-500">
                        VS
                    </div>

                    {/* Left (A) */}
                    <AnimatePresence mode='wait'>
                        {loadingA ? <Skeleton className="h-96 w-full rounded-3xl" /> : dataA ? (
                            <motion.div
                                key="A"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="glass-panel p-8 rounded-3xl"
                            >
                                <div className="text-center mb-8">
                                    <div className="w-full h-40 bg-slate-900/50 rounded-xl mb-6 overflow-hidden flex items-center justify-center">
                                        <img src={dataA.flags.svg} alt="Flag" className="h-full object-cover" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-white mb-2">{selectedA}</h2>
                                    <div className="text-purple-400 font-mono text-sm">{dataA.name.official}</div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-slate-900/40 p-4 rounded-xl">
                                        <div className="flex items-center gap-2 text-slate-400 mb-2">
                                            <Users size={16} /> <span className="text-xs uppercase font-bold">Nüfus</span>
                                        </div>
                                        <div className="text-2xl font-bold text-white mb-2">{dataA.population.toLocaleString()}</div>
                                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(dataA.population / maxPop) * 100}%` }}
                                                className="h-full bg-purple-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-900/40 p-4 rounded-xl">
                                            <div className="flex items-center gap-2 text-slate-400 mb-2">
                                                <Globe size={16} /> <span className="text-xs uppercase font-bold">Bölge</span>
                                            </div>
                                            <div className="font-semibold text-slate-200">{dataA.region}</div>
                                        </div>
                                        <div className="bg-slate-900/40 p-4 rounded-xl">
                                            <div className="flex items-center gap-2 text-slate-400 mb-2">
                                                <Landmark size={16} /> <span className="text-xs uppercase font-bold">Başkent</span>
                                            </div>
                                            <div className="font-semibold text-slate-200">{dataA.capital?.[0] || '-'}</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-96 flex items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-3xl">
                                1. Ülkeyi Seçin
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Right (B) */}
                    <AnimatePresence mode='wait'>
                        {loadingB ? <Skeleton className="h-96 w-full rounded-3xl" /> : dataB ? (
                            <motion.div
                                key="B"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="glass-panel p-8 rounded-3xl"
                            >
                                <div className="text-center mb-8">
                                    <div className="w-full h-40 bg-slate-900/50 rounded-xl mb-6 overflow-hidden flex items-center justify-center">
                                        <img src={dataB.flags.svg} alt="Flag" className="h-full object-cover" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-white mb-2">{selectedB}</h2>
                                    <div className="text-pink-400 font-mono text-sm">{dataB.name.official}</div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-slate-900/40 p-4 rounded-xl">
                                        <div className="flex items-center gap-2 text-slate-400 mb-2">
                                            <Users size={16} /> <span className="text-xs uppercase font-bold">Nüfus</span>
                                        </div>
                                        <div className="text-2xl font-bold text-white mb-2">{dataB.population.toLocaleString()}</div>
                                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(dataB.population / maxPop) * 100}%` }}
                                                className="h-full bg-pink-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-900/40 p-4 rounded-xl">
                                            <div className="flex items-center gap-2 text-slate-400 mb-2">
                                                <Globe size={16} /> <span className="text-xs uppercase font-bold">Bölge</span>
                                            </div>
                                            <div className="font-semibold text-slate-200">{dataB.region}</div>
                                        </div>
                                        <div className="bg-slate-900/40 p-4 rounded-xl">
                                            <div className="flex items-center gap-2 text-slate-400 mb-2">
                                                <Landmark size={16} /> <span className="text-xs uppercase font-bold">Başkent</span>
                                            </div>
                                            <div className="font-semibold text-slate-200">{dataB.capital?.[0] || '-'}</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-96 flex items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-3xl">
                                2. Ülkeyi Seçin
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
