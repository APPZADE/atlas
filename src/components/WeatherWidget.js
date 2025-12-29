"use client";

import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Snowflake, Thermometer } from 'lucide-react';

export default function WeatherWidget({ lat, lng, capital }) {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!lat || !lng) return;

        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`)
            .then(res => res.json())
            .then(data => {
                setWeather(data.current_weather);
                setLoading(false);
            })
            .catch(err => {
                console.error("Weather fetch failed", err);
                setLoading(false);
            });
    }, [lat, lng]);

    if (loading || !weather) return null;

    // Simple wmo code mapping
    const getIcon = (code) => {
        if (code <= 3) return <Sun className="text-amber-400" size={20} />;
        if (code <= 48) return <Cloud className="text-slate-400" size={20} />;
        if (code <= 67) return <CloudRain className="text-blue-400" size={20} />;
        if (code <= 86) return <Snowflake className="text-cyan-200" size={20} />;
        return <Cloud className="text-slate-400" size={20} />;
    };

    return (
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
            {getIcon(weather.weathercode)}
            <div className="flex flex-col leading-none">
                <span className="text-sm font-bold text-white flex items-center gap-1">
                    {Math.round(weather.temperature)}°C
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wide">{capital}</span>
            </div>
        </div>
    );
}
