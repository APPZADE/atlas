"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssistant } from '@/context/AssistantContext';
import { Send, X, Bot, Sparkles } from 'lucide-react';

export default function AIAssistant() {
    const { isOpen, setIsOpen, messages, sendMessage, isTyping } = useAssistant();
    const [input, setInput] = useState('');
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        sendMessage(input);
        setInput('');
    };

    return (
        <>
            {/* Floating Orb Trigger */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,243,255,0.4)] transition-all group"
            >
                {/* Orrrb Visuals */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 blur-sm opacity-80 animate-pulse" />
                <div className="absolute inset-0 rounded-full border-2 border-white/20 border-t-cyan-300 animate-spin-slow" />
                <div className="relative z-10 text-white">
                    {isOpen ? <X size={28} /> : <Bot size={28} />}
                </div>

                {/* Status Dot */}
                <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-[#050510] animate-ping" />
            </motion.button>

            {/* Chat Interface */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-24 right-6 z-50 w-80 md:w-96 h-[500px] glass-panel-premium rounded-3xl flex flex-col overflow-hidden border border-cyan-500/30"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-cyan-900/50 to-transparent flex items-center gap-3">
                            <Bot className="text-cyan-400" size={20} />
                            <div>
                                <h3 className="font-bold text-white font-[family-name:var(--font-orbitron)]">N.E.O.N Guide</h3>
                                <p className="text-xs text-cyan-300 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    Çevrimiçi
                                </p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                        ? 'bg-cyan-600/20 border border-cyan-500/30 text-white rounded-br-none'
                                        : 'bg-white/5 border border-white/10 text-slate-200 rounded-bl-none'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-bl-none flex gap-1">
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Prompts */}
                        {!messages.length || messages[messages.length - 1].role === 'assistant' ? (
                            <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar mask-gradient">
                                {[
                                    { label: "📍 Gezi Rehberi", text: "Bu ülke için bir gezi rehberi oluştur." },
                                    { label: "🍜 Ne Yenir?", text: "Burada ne yenir? Meşhur yemekleri neler?" },
                                    { label: "💡 İlginç Bilgi", text: "Bana burası hakkında ilginç bir bilgi ver." },
                                    { label: "🆘 Acil Durum", text: "Acil durum numaraları ve güvenlik ipuçları neler?" }
                                ].map((prompt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => sendMessage(prompt.text)}
                                        className="whitespace-nowrap px-3 py-1.5 text-xs bg-cyan-900/30 border border-cyan-700/50 rounded-full text-cyan-200 hover:bg-cyan-500 hover:text-black transition-colors"
                                    >
                                        {prompt.label}
                                    </button>
                                ))}
                            </div>
                        ) : null}

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 bg-black/20">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Siber-rehbere sor..."
                                    className="w-full bg-[#050510] border border-white/20 rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors text-white placeholder-slate-500"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="absolute right-2 p-2 bg-cyan-500 rounded-full text-white hover:bg-cyan-400 disabled:opacity-50 disabled:hover:bg-cyan-500 transition-colors"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
