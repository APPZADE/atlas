"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, RefreshCw, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import Skeleton from '@/components/Skeleton';

export default function QuizPage() {
    const [countries, setCountries] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingQuestion, setLoadingQuestion] = useState(false);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gameState, setGameState] = useState('loading'); // loading, playing, correct, wrong, error

    useEffect(() => {
        // Load initial country list
        fetch('/api/countries')
            .then(res => res.json())
            .then(data => {
                setCountries(data);
                const storedHigh = localStorage.getItem('quiz_highscore');
                if (storedHigh) setHighScore(parseInt(storedHigh));
                setGameState('ready');
            })
            .catch(err => {
                console.error(err);
                setGameState('error');
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (gameState === 'ready') {
            generateQuestion();
        }
    }, [gameState]);

    const generateQuestion = async () => {
        if (countries.length === 0) return;
        setLoadingQuestion(true);

        try {
            // Pick 4 random countries
            const options = [];
            const tempCountries = [...countries];

            for (let i = 0; i < 4; i++) {
                const randomIndex = Math.floor(Math.random() * tempCountries.length);
                options.push(tempCountries[randomIndex]);
                tempCountries.splice(randomIndex, 1); // Avoid duplicates
            }

            // Pick 1 as the correct answer
            const correctOption = options[Math.floor(Math.random() * options.length)];

            // Fetch detail for correct option to get Flag
            // We use the simpler Search by Name endpoint which is fuzzy but usually works for primary names
            const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(correctOption.displayName)}?fullText=true`);

            let flagData = null;
            if (res.ok) {
                const data = await res.json();
                flagData = data[0];
            } else {
                // Fallback to searching without fulltext if fulltext fails, or just try another question recursively
                // Let's try flexible search
                const res2 = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(correctOption.displayName)}`);
                if (res2.ok) {
                    const data2 = await res2.json();
                    flagData = data2[0];
                }
            }

            if (!flagData || !flagData.flags) {
                // If we can't get a flag, just retry (simple error handling)
                console.warn("Could not find flag for", correctOption.displayName);
                generateQuestion();
                return;
            }

            setCurrentQuestion({
                options,
                correct: correctOption,
                flag: flagData.flags.svg
            });
            setGameState('playing');

        } catch (e) {
            console.error("Quiz gen error", e);
        } finally {
            setLoadingQuestion(false);
        }
    };

    const handleAnswer = (selected) => {
        if (gameState !== 'playing') return;

        if (selected.id === currentQuestion.correct.id) {
            // Correct
            setScore(s => s + 1);
            setStreak(s => s + 1);
            setGameState('correct');

            // Confetti
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });

            // Update High Score
            if (score + 1 > highScore) {
                setHighScore(score + 1);
                localStorage.setItem('quiz_highscore', (score + 1).toString());
            }

            // Next question after delay
            setTimeout(() => {
                generateQuestion();
            }, 1500);

        } else {
            // Wrong
            setStreak(0);
            setGameState('wrong');
            // Give user time to see correct answer then next
            setTimeout(() => {
                generateQuestion();
            }, 2000);
        }
    };

    if (loading) return <div className="min-h-screen bg-[#0f172a] p-8 flex items-center justify-center"><Skeleton className="w-full h-full" /></div>;

    return (
        <div className="min-h-screen bg-[#0f172a] p-4 md:p-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <Link href="/" className="p-2 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 transition">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Score</span>
                            <span className="text-2xl font-bold text-cyan-400">{score}</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Best</span>
                            <div className="flex items-center gap-1 text-amber-400">
                                <Trophy size={14} />
                                <span className="text-xl font-bold">{highScore}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Game Area */}
                <div className="glass-panel p-8 rounded-3xl text-center relative overflow-hidden min-h-[400px] flex flex-col justify-center">

                    {loadingQuestion || !currentQuestion ? (
                        <div className="space-y-6 animate-pulse">
                            <div className="h-48 w-64 mx-auto bg-slate-800/50 rounded-xl" />
                            <div className="grid grid-cols-2 gap-4">
                                {[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-slate-800/50 rounded-xl" />)}
                            </div>
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentQuestion.correct.displayName}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="w-full"
                            >
                                <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
                                    Which country does this flag belong to?
                                </h2>

                                {/* Flag */}
                                <div className="mb-8 relative inline-block shadow-2xl rounded-lg overflow-hidden ring-1 ring-white/10">
                                    <img
                                        src={currentQuestion.flag}
                                        alt="Flag"
                                        className="h-40 md:h-56 object-cover"
                                    />
                                </div>

                                {/* Options */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {currentQuestion.options.map((option) => {
                                        const isSelected = false; // We could track selection for specific styling
                                        let btnClass = "bg-slate-800/50 hover:bg-slate-700 text-slate-200 border-slate-700";

                                        if (gameState === 'correct' && option.id === currentQuestion.correct.id) {
                                            btnClass = "bg-emerald-500/20 border-emerald-500 text-emerald-400 ring-1 ring-emerald-500";
                                        } else if (gameState === 'wrong' && option.id === currentQuestion.correct.id) {
                                            btnClass = "bg-emerald-500/20 border-emerald-500 text-emerald-400"; // Show correct answer
                                        } else if (gameState === 'wrong' && option.id !== currentQuestion.correct.id) {
                                            btnClass = "bg-rose-500/10 border-rose-500/30 text-rose-400/50 opacity-50"; // Fade wrong answers
                                        }

                                        return (
                                            <button
                                                key={option.id}
                                                onClick={() => handleAnswer(option)}
                                                disabled={gameState !== 'playing'}
                                                className={`p-4 rounded-xl border font-semibold transition-all transform active:scale-95 ${btnClass}`}
                                            >
                                                {option.displayName}
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    )}

                    {/* Feedback Overlay */}
                    {gameState === 'correct' && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="bg-emerald-500 text-white px-8 py-4 rounded-full font-bold text-2xl shadow-xl">
                                Correct! 🎉
                            </div>
                        </motion.div>
                    )}
                    {gameState === 'wrong' && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="bg-rose-500 text-white px-8 py-4 rounded-full font-bold text-2xl shadow-xl">
                                Wrong!
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
