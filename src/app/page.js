import { getRecognizedCountries } from '@/lib/recognized-parser';
import CountryList from '@/components/CountryList';
import WorldMap from '@/components/WorldMap';
// import Header from '@/components/Header'; // Removed

export default function Home() {
    const countries = getRecognizedCountries();

    return (
        <main className="min-h-screen p-4 md:p-8 pb-20">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Hero Section */}
                <header className="text-center pt-10 pb-6 relative z-10">
                    <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 font-[family-name:var(--font-orbitron)] tracking-tighter drop-shadow-[0_0_30px_rgba(189,0,255,0.3)] glitch-hover cursor-default">
                        DÜNYA
                    </h1>
                    <h2 className="text-2xl md:text-3xl text-slate-400 font-light tracking-[0.5em] uppercase mt-2">
                        ANSİKLOPEDİSİ
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto mt-6"></div>
                </header>

                {/* Map Section */}
                <section className="w-full">
                    <WorldMap recognizedCountries={countries} />
                </section>

                {/* List Content */}
                <CountryList initialCountries={countries} />
            </div>
        </main>
    );
}
