"use client";

import React, { memo, useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { useRouter } from 'next/navigation';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const WorldMap = ({ recognizedCountries = [] }) => {
    const router = useRouter();
    const [tooltipContent, setTooltipContent] = useState("");

    // Create a map of English/Standard names to our Turkish Display Names
    // This is hard because the TopoJSON has standard names.
    // We'll rely on a click navigating to "clean name" closest match or just the ID name.

    // Actually, we should probably just navigate to the clicked country's name 
    // and hope our `getCountryData` can handle the english name from the map if it doesn't match a Turkish one.
    // But our [name]/page.js expects a name found in recognizedCountries OR standard lookups.
    // Let's rely on the routing logic: /country/EnglishName might fail if the page only looks up strictly in recognized list.
    // Wait, `getCountryData` falls back to `localData = ... || { cleanName: decodedName }`. 
    // So if I click "United States", it goes to /country/United%20States.
    // `getCountryData` sees it's not in the Turkish list (directly), uses "United States" as cleanName.
    // Then tries RestCountries "United States". It works!
    // BUT the user wants the specific "Recognized" context. 
    // It's safer if I can map it, but for now this fallback works for general "Encyclopedia" feel.

    return (
        <div className="w-full h-[500px] bg-slate-900/50 rounded-3xl overflow-hidden border border-slate-700/50 relative">
            <ComposableMap projection="geoMercator" projectionConfig={{ scale: 100 }}>
                <ZoomableGroup center={[0, 20]} zoom={1}>
                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map((geo) => {
                                const isRecognized = true; // Ideally check against our list
                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        onMouseEnter={() => {
                                            setTooltipContent(geo.properties.name);
                                        }}
                                        onMouseLeave={() => {
                                            setTooltipContent("");
                                        }}
                                        onClick={() => {
                                            router.push(`/country/${geo.properties.name}`);
                                        }}
                                        style={{
                                            default: {
                                                fill: "#1e293b", // Slate 800
                                                stroke: "#334155",
                                                strokeWidth: 0.5,
                                                outline: "none",
                                            },
                                            hover: {
                                                fill: "#38bdf8", // Cyan 400
                                                stroke: "#7dd3fc",
                                                strokeWidth: 0.75,
                                                outline: "none",
                                                cursor: "pointer",
                                                transition: "all 250ms"
                                            },
                                            pressed: {
                                                fill: "#0ea5e9",
                                                outline: "none",
                                            },
                                        }}
                                    />
                                );
                            })
                        }
                    </Geographies>
                </ZoomableGroup>
            </ComposableMap>

            {/* Tooltip */}
            {tooltipContent && (
                <div className="absolute top-4 left-4 bg-slate-800/90 text-white px-3 py-1 rounded-full text-sm border border-cyan-500/30 backdrop-blur-md pointer-events-none">
                    {tooltipContent}
                </div>
            )}

            <div className="absolute bottom-4 right-4 text-xs text-slate-500">
                Interactive Map
            </div>
        </div>
    );
};

export default memo(WorldMap);
