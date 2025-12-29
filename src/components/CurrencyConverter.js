"use client";

import { useState, useEffect } from 'react';
import { Coins, ArrowLeftRight } from 'lucide-react';

export default function CurrencyConverter({ currencyCode }) {
    const [amount, setAmount] = useState(1);
    const [rate, setRate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [base, setBase] = useState('USD'); // Default base

    useEffect(() => {
        if (!currencyCode || currencyCode === 'USD') {
            // If same as base or invalid, just mock 1:1 or skip
            if (currencyCode === 'USD') setRate(1);
            setLoading(false);
            return;
        }

        setLoading(true);
        // Using frankfurter.app (Free, no key)
        fetch(`https://api.frankfurter.app/latest?from=${base}&to=${currencyCode}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.rates && data.rates[currencyCode]) {
                    setRate(data.rates[currencyCode]);
                } else {
                    console.warn(`Currency ${currencyCode} not supported by API`);
                    setRate(null);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Currency fetch failed", err);
                setLoading(false);
            });
    }, [currencyCode, base]);

    if (!currencyCode) return null;

    return (
        <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2 mb-4 text-emerald-400">
                <Coins size={20} />
                <h3 className="font-bold uppercase tracking-wider text-sm">Döviz Çevirici</h3>
            </div>

            <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl">
                <div className="flex-1">
                    <label className="text-xs text-slate-500 mb-1 block">{base}</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full bg-transparent text-xl font-bold text-white focus:outline-none"
                    />
                </div>
                <button
                    onClick={() => setBase(b => b === 'USD' ? 'TRY' : 'USD')}
                    className="p-2 rounded-full hover:bg-white/10 text-slate-400 transition"
                    title="Switch Base"
                >
                    <ArrowLeftRight size={16} />
                </button>
                <div className="flex-1 text-right">
                    <label className="text-xs text-slate-500 mb-1 block">{currencyCode}</label>
                    <div className="text-xl font-bold text-emerald-400">
                        {loading ? '...' : rate ? (amount * rate).toFixed(2) : '-'}
                    </div>
                </div>
            </div>
        </div>
    );
}
