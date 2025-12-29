"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Unlock, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (res.ok) {
            router.push('/admin/dashboard');
        } else {
            setError('Erişim Reddedildi. Kimlik bilgileri geçersiz.');
        }
    };

    return (
        <div className="min-h-screen bg-[#050510] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-black/50 border border-cyan-500/30 p-8 rounded-2xl backdrop-blur-xl shadow-[0_0_30px_rgba(0,243,255,0.1)]">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/50">
                        <ShieldCheck size={32} className="text-cyan-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-widest uppercase">Admin Girişi</h1>
                    <p className="text-cyan-600/70 text-sm mt-2">N.E.O.N Sistem Kontrol</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs uppercase text-cyan-400 mb-2 tracking-wider">Kullanıcı Adı</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase text-cyan-400 mb-2 tracking-wider">Şifre</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                        />
                    </div>

                    {error && <div className="text-red-500 text-sm text-center bg-red-900/20 p-2 rounded">{error}</div>}

                    <button type="submit" className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all flex items-center justify-center gap-2">
                        <Unlock size={18} /> GİRİŞ YAP
                    </button>

                    <div className="text-center text-xs text-slate-600">Varsayılan: admin / admin</div>
                </form>
            </div>
        </div>
    );
}
