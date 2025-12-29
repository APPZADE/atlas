"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for App Router
import { Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation'; // To get params

export default function EditorPage({ params }) {
    // Need to unwrap params in Next 15+ or verify version. Assuming standard behavior for now but using hook is safer in client component if params passed directly prop is async.
    // However, props are passed to page.
    // Let's rely on standard 'params' prop but handle async nature if needed or just use useParams() hook for client safety.
    const router = useRouter();
    const { code } = useParams(); // Using hook for safety

    const isNew = code === 'new';
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        id: '',
        displayName: '',
        cleanName: '',
        name: { common: '', official: '' },
        capital: [''],
        region: 'Europe',
        population: 0,
        flags: { svg: '', png: '' },
        wiki: { tr: '' }
    });

    useEffect(() => {
        if (!isNew && code) {
            setLoading(true);
            fetch(`/api/countries?id=${code}`)
                .then(res => res.json())
                .then(data => {
                    if (data && !data.error) {
                        // Merge with defaults to ensure nested objects exist
                        setFormData(prev => ({
                            ...prev,
                            ...data,
                            name: { ...prev.name, ...data.name },
                            flags: { ...prev.flags, ...data.flags },
                            wiki: { ...prev.wiki, ...(data.wiki || {}) },
                            capital: data.capital || ['']
                        }));
                    }
                    setLoading(false);
                });
        }
    }, [code, isNew]);

    // Temporary: Mocking the fetch logic or assuming user will fill it for now to unblock UI.
    // Better: I will verify I can fetch full data.
    // Let's fix the API first in next step. For now, writing the UI structure.

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNestedChange = (parent, field, value) => {
        setFormData(prev => ({
            ...prev,
            [parent]: { ...prev[parent], [field]: value }
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        // Prepare payload
        const payload = { ...formData };
        if (isNew && !payload.id) {
            // Generate ID from name if missing
            payload.id = payload.displayName.toUpperCase().substring(0, 3);
        }

        const res = await fetch('/api/countries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            router.push('/admin/dashboard');
        } else {
            alert('Kaydetme hatası');
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050510] text-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/admin/dashboard" className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold">{isNew ? 'Yeni Ülke Ekle' : 'Ülkeyi Düzenle'}</h1>
                </div>

                <form onSubmit={handleSave} className="space-y-8">
                    {/* Basic Info */}
                    <div className="glass-panel p-6 rounded-xl border border-slate-800">
                        <h3 className="text-cyan-400 font-bold mb-4 uppercase tracking-wider text-sm">Temel Bilgiler</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-slate-400 text-xs mb-1">Görünür İsim (Türkçe)</label>
                                <input required type="text" value={formData.displayName} onChange={e => handleChange('displayName', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2" />
                            </div>
                            <div>
                                <label className="block text-slate-400 text-xs mb-1">Unique ID (3 Harf)</label>
                                <input disabled={!isNew} type="text" value={formData.id} onChange={e => handleChange('id', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2 uppercase" placeholder="TUR" />
                            </div>
                            <div>
                                <label className="block text-slate-400 text-xs mb-1">Resmi İsim</label>
                                <input type="text" value={formData.name.official} onChange={e => handleNestedChange('name', 'official', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2" />
                            </div>
                            <div>
                                <label className="block text-slate-400 text-xs mb-1">Arama İsmi (API için)</label>
                                <input type="text" value={formData.cleanName} onChange={e => handleChange('cleanName', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2" placeholder="Turkey" />
                            </div>
                        </div>
                    </div>

                    {/* Geography */}
                    <div className="glass-panel p-6 rounded-xl border border-slate-800">
                        <h3 className="text-purple-400 font-bold mb-4 uppercase tracking-wider text-sm">Coğrafya & Nüfus</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-slate-400 text-xs mb-1">Bölge</label>
                                <input type="text" value={formData.region} onChange={e => handleChange('region', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2" />
                            </div>
                            <div>
                                <label className="block text-slate-400 text-xs mb-1">Başkent</label>
                                <input type="text" value={formData.capital[0]} onChange={e => setFormData({ ...formData, capital: [e.target.value] })} className="w-full bg-slate-900 border border-slate-700 rounded p-2" />
                            </div>
                            <div>
                                <label className="block text-slate-400 text-xs mb-1">Nüfus</label>
                                <input type="number" value={formData.population} onChange={e => handleChange('population', Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded p-2" />
                            </div>
                        </div>
                    </div>

                    {/* Media */}
                    <div className="glass-panel p-6 rounded-xl border border-slate-800">
                        <h3 className="text-pink-400 font-bold mb-4 uppercase tracking-wider text-sm">Görsel</h3>
                        <div className="flex gap-4 items-start">
                            <div className="flex-1">
                                <label className="block text-slate-400 text-xs mb-1">Bayrak URL (SVG/PNG)</label>
                                <input type="text" value={formData.flags.svg} onChange={e => handleNestedChange('flags', 'svg', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2" />
                                <input type="text" value={formData.flags.png} onChange={e => handleNestedChange('flags', 'png', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2 mt-2" placeholder="Alternatif PNG URL" />
                            </div>
                            <div className="w-32 h-20 bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden rounded">
                                {formData.flags.svg ? <img src={formData.flags.svg} className="w-full h-full object-cover" /> : <ImageIcon className="text-slate-600" />}
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <button disabled={saving} type="submit" className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-green-500/20 transition-all">
                        {saving ? 'Kaydediliyor...' : 'KAYDET & YAYINLA'}
                    </button>

                    <div className="bg-yellow-900/20 p-4 rounded-lg text-yellow-500 text-xs mt-4">
                        ⚠️ Dikkat: Yaptığınız değişiklikler anında yayına alınır. "ID" alanı değiştirilemez.
                    </div>
                </form>
            </div>
        </div>
    );
}
