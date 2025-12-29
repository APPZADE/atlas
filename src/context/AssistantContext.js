"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const AssistantContext = createContext();

export function AssistantProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Merhaba Gezgin! Ben Atlas. Sana bu siber-evrende nasıl yardımcı olabilirim?' }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const pathname = usePathname();

    // Context-aware proactive messaging
    useEffect(() => {
        if (!pathname) return;

        // Reset or add context message on navigation
        if (pathname.startsWith('/country/')) {
            const country = decodeURIComponent(pathname.split('/').pop());
            // ...
        }
    }, [pathname]);

    const sendMessage = async (text) => {
        setMessages(prev => [...prev, { role: 'user', content: text }]);
        setIsTyping(true);

        // Simulate AI delay
        setTimeout(() => {
            const reply = generateMockReply(text);
            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
            setIsTyping(false);
        }, 1500);
    };

    const generateMockReply = (text) => {
        text = text.toLowerCase();
        if (text.includes('nasıl')) return "Şu an Tokyo'da siber-yağmur var. Yanına şemsiye almanı öneririm.";
        if (text.includes('vize')) return "Vize işlemleri için Pasaport sayfasına göz atabilirsin.";
        if (text.includes('yemek')) return "Buradaki sokak lezzetleri bir harika! Veri tabanımda 'Ramen' favori gözüküyor.";
        return "İlginç bir soru. Küresel veri ağlarını tarıyorum... Veri bulunamadı, ama aramaya devam ediyorum.";
    };

    return (
        <AssistantContext.Provider value={{ isOpen, setIsOpen, messages, sendMessage, isTyping }}>
            {children}
        </AssistantContext.Provider>
    );
}

export function useAssistant() {
    return useContext(AssistantContext);
}
