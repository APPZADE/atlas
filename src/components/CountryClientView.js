"use client";

import { useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe, Users, Landmark, Printer } from 'lucide-react';
import Link from 'next/link';
// Badge is defined inline below
import WeatherWidget from './WeatherWidget';
import CountryDescription from './CountryDescription';
import AnimatedContent from './AnimatedContent';
import CulturalGuide from './CulturalGuide'; // Added

// Redefine Badge here or move to separate file if not already. 
// It was inside page.js previously. Let's assume I need to recreate it or it's a component.
// "Badge function definition" was removed in previous logs... checking `AnimatedContent.js`.
// Actually, `Badge` was defined inside `page.js` previously. I should define it here.
function Badge({ icon, label }) {
    if (!label) return null;
    return (
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
            <span className="text-cyan-400">{icon}</span>
            <span className="text-sm font-semibold text-slate-200">{label}</span>
        </div>
    );
}

export default function CountryClientView({ countryData, wikiSummaries, states, borders, decodedName }) {
    const contentRef = useRef(null);

    const handlePrint = useReactToPrint({
        contentRef: contentRef,
        documentTitle: `${decodedName} - World Encyclopedia Guide`,
    });

    useEffect(() => {
        // Log Visit
        try {
            const raw = localStorage.getItem('visited_countries');
            let visited = raw ? JSON.parse(raw) : [];

            // Check if already visited recently? Or just replace/move to top
            // Let's filter out existing entry for this country to avoid dupes, then unshift
            visited = visited.filter(v => v.name !== decodedName);

            visited.push({
                name: decodedName,
                date: new Date().toLocaleDateString(),
                flag: countryData.flags?.svg
            });

            // Limit to last 50 maybe?
            if (visited.length > 50) visited = visited.slice(visited.length - 50);

            localStorage.setItem('visited_countries', JSON.stringify(visited));
        } catch (e) {
            console.error("Passport log failed", e);
        }
    }, [decodedName, countryData]);

    return (
        <div className="min-h-screen bg-[#0f172a] pb-20" ref={contentRef}>
            {/* Hero Section */}
            <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden print:h-auto print:min-h-0 print:pb-8">
                {/* Background Image - Hide on print to save ink */}
                <div
                    className="absolute inset-0 bg-cover bg-center blur-3xl opacity-30 scale-110 print:hidden"
                    style={{ backgroundImage: `url(${countryData.flags?.svg})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f172a] print:hidden" />

                <div className="relative z-10 h-full max-w-6xl mx-auto px-4 md:px-8 flex flex-col justify-center pt-20 md:pt-0">
                    <Link href="/" className="absolute top-8 left-4 md:left-8 text-white/70 hover:text-white transition flex items-center gap-2 print:hidden bg-black/20 backdrop-blur-md px-4 py-2 rounded-full">
                        <ArrowLeft size={20} /> <span className="font-semibold">Geri Dön</span>
                    </Link>

                    <div className="flex flex-col md:flex-row items-center gap-8 mt-12 print:flex-row print:mt-0">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-full md:w-1/3 aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/10 relative group print:ring-0 print:shadow-none print:w-1/4"
                        >
                            <img
                                src={countryData.flags?.svg}
                                alt={`Flag of ${decodedName}`}
                                className="w-full h-full object-cover"
                            />
                        </motion.div>

                        <div className="flex-1 text-center md:text-left print:text-left">
                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-4 print:text-black print:bg-none"
                            >
                                {decodedName}
                            </motion.h1>
                            <div className="text-xl text-cyan-400 font-mono mb-6 print:text-slate-600">
                                {countryData.name?.official !== decodedName ? countryData.name?.official : ''}
                            </div>

                            <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start items-center print:justify-start">
                                <Badge icon={<Globe size={16} />} label={countryData.region} />
                                <Badge icon={<Users size={16} />} label={countryData.population?.toLocaleString()} />
                                <Badge icon={<Landmark size={16} />} label={countryData.capital?.[0]} />

                                {/* Weather Widget - Hide on print often or keep? Keep. */}
                                {countryData.latlng && countryData.capital && (
                                    <div className="print:hidden">
                                        <WeatherWidget
                                            lat={countryData.latlng[0]}
                                            lng={countryData.latlng[1]}
                                            capital={countryData.capital[0]}
                                        />
                                    </div>
                                )}

                                {/* Print Button - Hide on Print! */}
                                <button
                                    onClick={() => handlePrint()}
                                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition text-sm font-bold backdrop-blur-md border border-white/10 print:hidden"
                                >
                                    <Printer size={16} />
                                    <span>Rehberi İndir</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-20 relative z-20 print:mt-8 print:text-black">
                <CountryDescription summaries={wikiSummaries} />
                <AnimatedContent
                    countryData={countryData}
                    states={states}
                    borders={borders}
                />

                <CulturalGuide countryName={countryData.name?.common} />

                {/* Print Footer */}
                <div className="hidden print:block mt-8 text-center text-sm text-slate-500 border-t pt-4">
                    Generated by World Encyclopedia • world-encyclopedia.app
                </div>
            </div>
        </div>
    );
}
