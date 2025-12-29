"use client";

import { LanguageProvider } from '@/context/LanguageContext';
import { FavoritesProvider } from '@/context/FavoritesContext';

export function Providers({ children }) {
    return (
        <LanguageProvider>
            <FavoritesProvider>
                {children}
            </FavoritesProvider>
        </LanguageProvider>
    );
}
