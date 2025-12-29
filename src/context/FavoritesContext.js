"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
    const [favorites, setFavorites] = useState([]);

    // Load favorites from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('app-favorites');
        if (saved) {
            try {
                setFavorites(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse favorites", e);
            }
        }
    }, []);

    // Save favorites to local storage whenever they change
    useEffect(() => {
        localStorage.setItem('app-favorites', JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (countryName) => {
        setFavorites(prev => {
            if (prev.includes(countryName)) {
                return prev.filter(c => c !== countryName);
            } else {
                return [...prev, countryName];
            }
        });
    };

    const isFavorite = (countryName) => favorites.includes(countryName);

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export const useFavorites = () => useContext(FavoritesContext);
