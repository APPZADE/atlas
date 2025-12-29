"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
    tr: {
        title: "Dünya Ansiklopedisi",
        subtitle: "Türkiye Cumhuriyeti'nin diplomatik tanıma durumuna göre dünyayı keşfedin.",
        searchPlaceholder: "Ülke ara (örn: Almanya, Asya)...",
        noResults: "sonucuna uygun ülke bulunamadı",
        back: "Haritaya Dön",
        region: "Bölge",
        subregion: "Alt Bölge",
        capital: "Başkent",
        population: "Nüfus",
        area: "Yüzölçümü",
        languages: "Diller",
        currency: "Para Birimi",
        demonym: "Halk Adı",
        society: "Toplum",
        economy: "Ekonomi",
        geography: "Coğrafya",
        details: "Detaylar",
        codes: "Kodlar",
        adminDivisions: "İdari Bölümler",
        neighbors: "Komşular"
    }
    // English removed
};

export function LanguageProvider({ children }) {
    // Hardcoded to Turkish
    const language = 'tr';

    const toggleLanguage = () => {
        // No-op
        console.log("Language is locked to Turkish");
    };

    return (
        <LanguageContext.Provider value={{ language, t: translations.tr, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);
