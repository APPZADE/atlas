"use client";

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Book, Scale, Gamepad2, Shuffle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();

    const handleRandom = async () => {
        try {
            const res = await fetch('/api/countries');
            const countries = await res.json();
            const random = countries[Math.floor(Math.random() * countries.length)];
            router.push(`/country/${encodeURIComponent(random.displayName)}`);
        } catch (e) { console.error("Random failed"); }
    };

    const navItems = [
        { icon: <Home size={24} />, path: '/', label: 'Ana Sayfa' },
        { icon: <Book size={24} />, path: '/passport', label: 'Pasaport' },
        { icon: <Scale size={24} />, path: '/compare', label: 'Kıyasla' },
        { icon: <Gamepad2 size={24} />, path: '/quiz', label: 'Quiz' },
    ];

    const isActive = (path) => pathname === path;

    return (
        <>
            {/* Desktop Sidebar (Floating) */}
            <motion.nav
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 z-50 flex-col gap-6 p-4 rounded-3xl glass-panel-premium border border-white/10 shadow-[0_0_30px_rgba(0,243,255,0.1)]"
            >
                {navItems.map((item) => (
                    <Link key={item.path} href={item.path} className="relative group">
                        <div className={`p-4 rounded-xl transition-all duration-300 ${isActive(item.path) ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(0,243,255,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                            {item.icon}
                        </div>
                        {/* Tooltip */}
                        <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-black/80 text-cyan-400 text-xs font-bold uppercase tracking-wider rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-cyan-500/30">
                            {item.label}
                        </div>
                    </Link>
                ))}

                {/* Random Button */}
                <button onClick={handleRandom} className="relative group">
                    <div className="p-4 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300">
                        <Shuffle size={24} />
                    </div>
                    <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-black/80 text-cyan-400 text-xs font-bold uppercase tracking-wider rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-cyan-500/30">
                        Rastgele
                    </div>
                </button>
            </motion.nav>

            {/* Mobile Bottom Bar (Floating) */}
            <motion.nav
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="md:hidden fixed bottom-6 left-6 right-6 z-50 flex justify-between items-center p-2 rounded-2xl glass-panel-premium border border-white/10 shadow-[0_0_20px_rgba(0,243,255,0.15)] bg-[#050510]/80 backdrop-blur-xl"
            >
                {navItems.map((item) => (
                    <Link key={item.path} href={item.path} className={`flex-1 flex justify-center p-3 rounded-xl transition-all ${isActive(item.path) ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-500'}`}>
                        {item.icon}
                    </Link>
                ))}
            </motion.nav>
        </>
    );
}
