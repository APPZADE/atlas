"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, LogOut, Search } from 'lucide-react';

export default function DashboardPage() {
    const [countries, setCountries] = useState([]);
    const [search, setSearch] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchCountries();
    }, []);

    const fetchCountries = async () => {
        const res = await fetch('/api/countries');
        if (res.ok) {
            setCountries(await res.json());
        }
    };

    const handleDelete = async (id, name) => {
        if (!confirm(`"${name}" ülkesini silmek istediğinize emin misiniz?`)) return;

        const res = await fetch(`/api/countries?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
            fetchCountries();
        } else {
            alert('Silme işlemi başarısız.');
        }
    };

    const filtered = countries.filter(c =>
        c.displayName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#050510] text-white p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 bg-slate-900/50 p-6 rounded-2xl border border-cyan-500/20 backdrop-blur">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                            Sistem Kontrol Paneli
                        </h1>
                        <p className="text-slate-400 text-sm">Veri Yönetim Merkezi v1.0</p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/admin/edit/new" className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg transition-colors font-bold">
                            <Plus size={18} /> Yeni Ekle
                        </Link>
                        <button onClick={() => router.push('/')} className="p-2 text-slate-400 hover:text-white border border-slate-700 rounded-lg">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input
                        type="text"
                        placeholder="Ülke ara..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                    />
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map(country => (
                        <div key={country.id} className="bg-slate-900/40 border border-slate-800 hover:border-cyan-500/30 p-4 rounded-xl flex items-center justify-between group transition-all">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-mono text-cyan-400">
                                    {country.id.substring(0, 2)}
                                </div>
                                <span className="font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
                                    {country.displayName}
                                </span>
                            </div>
                            <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link href={`/admin/edit/${country.id}`} className="p-2 bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white rounded-lg">
                                    <Edit size={16} />
                                </Link>
                                <button
                                    onClick={() => handleDelete(country.id, country.displayName)}
                                    className="p-2 bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white rounded-lg"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center text-slate-500 mt-20">Veri bulunamadı.</div>
                )}
            </div>
        </div>
    );
}
