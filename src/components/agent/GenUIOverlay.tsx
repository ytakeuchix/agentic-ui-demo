'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Sparkles, Check } from 'lucide-react';
import { useDemo } from '@/lib/DemoContext';

export function GenUIOverlay() {
    const { currentScenario, setScenario, updateExpense, expenses } = useDemo();
    const [attendees, setAttendees] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Find the target expense (hardcoded to the one with error for demo)
    const targetExpense = expenses.find(e => e.status === 'pending_fix');

    if (currentScenario !== 'gen-ui' || !targetExpense) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 1500));

        updateExpense(targetExpense.id, {
            status: 'fixed',
            attendees: attendees.split(',').map(s => s.trim()),
            warning_message: undefined
        });

        setIsSubmitting(false);
        // Automatically close or stay to show success? Let's close for flow.
        // Actually, let's keep it open for a sec to show success state then close.
        setScenario('notification');
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]"
                onClick={() => setScenario('notification')} // Close on backdrop
            >
                <motion.div
                    className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-gray-100"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <Sparkles size={18} className="text-yellow-200" />
                            <span className="font-bold">AIアシスタント</span>
                        </div>
                        <button onClick={() => setScenario('notification')} className="text-white/80 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">同席者の確認</h3>
                            <p className="text-sm text-gray-500">
                                「{targetExpense.merchant}」の経費（¥{targetExpense.amount.toLocaleString()}）は接待交際費として計上されていますが、同席者が不明です。
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                                    同席者を入力 (カンマ区切り)
                                </label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        value={attendees}
                                        onChange={e => setAttendees(e.target.value)}
                                        placeholder="例: 佐藤一郎, 田中花子 (株式会社Client)"
                                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                                        autoFocus
                                    />
                                </div>
                                {/* AI Suggestions (Fake) */}
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="text-xs text-gray-400 mr-1">AI提案:</span>
                                    <button
                                        type="button"
                                        onClick={() => setAttendees('鈴木 太郎 (株式会社Z)')}
                                        className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-100 hover:bg-purple-100"
                                    >
                                        + 鈴木 太郎 (株式会社Z)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAttendees('山田 次郎 (Partner Corp)')}
                                        className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-100 hover:bg-purple-100"
                                    >
                                        + 山田 次郎 (Partner Corp)
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || !attendees}
                                className="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 flex justify-center items-center gap-2 transition-all"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        保存中...
                                    </>
                                ) : (
                                    <>
                                        <Check size={18} />
                                        保存して修正完了
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
