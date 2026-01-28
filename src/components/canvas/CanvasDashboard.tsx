'use client';

import React from 'react';
import { useDemo } from '@/lib/DemoContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, X, FileText, AlertTriangle, Building, CreditCard, Calendar, Users, Info, Hash, Tag, Briefcase } from 'lucide-react';
import { ExpenseItem } from '@/lib/types';
import cn from 'clsx';
import { CATEGORIES_JA } from '@/lib/constants';
// Import the generated image if possible, or use a path relative to public.
// Assuming the user will move the artifact or we use a static path. For now, let's use a placeholder that looks more like a receipt or reference the artifact.
// Note: Since I cannot move the generated artifact to public automatically in this environment without user help, I will use a reliable placeholder or the artifact path if served.
// Local asset from public folder
const RECEIPT_IMG = '/receipt.png';

export function CanvasDashboard() {
    const { currentScenario, setScenario, expenses, updateExpense } = useDemo();

    if (currentScenario !== 'canvas') return null;

    const pendingExpenses = expenses.filter(e => e.status !== 'approved'); // Keep 'approved' status as 'submitted' conceptually for now to avoid extensive type refactor, or just treat 'approved' as 'done'
    const activeExpense = pendingExpenses[0] || expenses[0];

    const handleSubmit = (id: string) => {
        updateExpense(id, { status: 'approved' }); // Using 'approved' state to mean 'submitted/done'
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-gray-50 flex flex-col"
        >
            {/* Canvas Header */}
            <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setScenario('idle')}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="font-bold text-lg text-gray-900">本日の経費申請 (Daily Submission)</h1>
                    <span className="text-sm bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                        残り {pendingExpenses.length} 件
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 mr-2">自動保存: ON</span>
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        M
                    </div>
                </div>
            </header>

            {/* Main Workspace */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Expense List */}
                <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-100 font-medium text-gray-500 text-sm uppercase tracking-wide">
                        申請候補 (Drafts)
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {expenses.map(exp => (
                            <div
                                key={exp.id}
                                onClick={() => {/* select logic */ }}
                                className={cn(
                                    "p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors relative",
                                    exp.id === activeExpense.id ? "bg-blue-50/50 border-l-4 border-l-blue-500" : "border-l-4 border-l-transparent"
                                )}
                            >
                                <div className="flex justify-between mb-1">
                                    <span className="font-semibold text-sm text-gray-900 truncate">{exp.merchant}</span>
                                    <span className="text-xs text-gray-500">{exp.date}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                                    <span>{CATEGORIES_JA[exp.category]}</span>
                                    <span className="font-mono">¥{exp.amount.toLocaleString()}</span>
                                </div>

                                {exp.status === 'approved' ? (
                                    <div className="inline-flex items-center gap-1 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded uppercase font-bold">
                                        <Check size={10} /> 申請済み
                                    </div>
                                ) : exp.is_violation ? (
                                    <div className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded uppercase font-bold">
                                        <AlertTriangle size={10} /> 要確認
                                    </div>
                                ) : (
                                    <div className="inline-flex items-center gap-1 text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded uppercase font-bold">
                                        チェックOK
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Center Panel: Deep Dive Comparison */}
                <div className="flex-1 flex bg-gray-50/50 p-6 gap-6 overflow-hidden">
                    {/* ... Receipt View (Unchanged most parts) ... */}
                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                        <div className="h-10 border-b border-gray-100 flex items-center px-4 bg-gray-50/50 justify-between">
                            <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                <FileText size={14} /> 領収書画像 (Receipt)
                            </span>
                        </div>
                        <div className="flex-1 bg-gray-800 flex items-center justify-center relative group">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={RECEIPT_IMG} alt="Receipt" className="max-w-full max-h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity" />

                            {/* Fake OCR overlay boxes */}
                            <div className="absolute top-1/3 left-1/4 w-32 h-8 border-2 border-green-400 bg-green-400/20 rounded mix-blend-screen" title="Merchant Detected" />
                            <div className="absolute bottom-1/4 right-1/4 w-24 h-8 border-2 border-green-400 bg-green-400/20 rounded mix-blend-screen" title="Amount Detected" />
                        </div>
                    </div>

                    {/* Data & Policy View */}
                    <div className="w-96 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                        <div className="h-10 border-b border-gray-100 flex items-center px-4 bg-gray-50/50">
                            <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                <Building size={14} /> 抽出データ (Extracted)
                            </span>
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto">
                            <div className="space-y-6">
                                <DataField label="支払先" value={activeExpense.merchant} icon={<Building size={14} />} confidence={99} />
                                <DataField label="登録番号" value={activeExpense.invoice_num || '未検出'} icon={<Hash size={14} />} confidence={activeExpense.invoice_num ? 95 : undefined} />
                                <DataField label="日　付" value={activeExpense.date} icon={<Calendar size={14} />} confidence={98} />
                                <DataField label="用　途" value={activeExpense.description} icon={<Info size={14} />} />

                                <div className="grid grid-cols-2 gap-4">
                                    <DataField label="税込金額" value={`¥${activeExpense.amount.toLocaleString()}`} icon={<CreditCard size={14} />} confidence={99} highlight />
                                    <DataField label="内消費税" value={`¥${(activeExpense.tax || 0).toLocaleString()}`} icon={<CreditCard size={14} />} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <DataField label="負担部門" value={activeExpense.cost_center} icon={<Briefcase size={14} />} />
                                    <DataField label="プロジェクト" value={activeExpense.project_code} icon={<Tag size={14} />} />
                                </div>

                                {/* Attendees Field Integration */}
                                {activeExpense.attendees && activeExpense.attendees.length > 0 && (
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                                                <Users size={14} /> 同席者 (3名)
                                            </label>
                                            <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 rounded font-mono">
                                                Added via GenUI
                                            </span>
                                        </div>
                                        <div className="p-2.5 rounded-md border text-sm font-medium bg-blue-50/30 border-blue-100 text-gray-900">
                                            {activeExpense.attendees.join(', ')}
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-gray-100">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">
                                        規定チェック (Policy Check)
                                    </label>

                                    {activeExpense.is_violation ? (
                                        // 違反はあるが、ステータスで分岐
                                        activeExpense.status === 'fixed' ? (
                                            <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                                                <div className="flex gap-2 items-start">
                                                    <Check className="text-green-600 mt-0.5" size={16} />
                                                    <div>
                                                        <p className="text-sm font-bold text-green-800">修正確認済み (Fixed)</p>
                                                        <p className="text-xs text-green-700 mt-1 leading-relaxed">
                                                            必要な情報（同席者）が追加されました。
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                                                <div className="flex gap-2 items-start">
                                                    <AlertTriangle className="text-amber-600 mt-0.5" size={16} />
                                                    <div>
                                                        <p className="text-sm font-bold text-amber-800">要レビュー (Warning)</p>
                                                        <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                                                            {activeExpense.warning_message || '規定違反の可能性があります。'}
                                                        </p>
                                                        <div className="mt-2 text-xs bg-white/50 px-2 py-1 rounded text-amber-800 border border-amber-200">
                                                            要確認: 申請ルールをご確認ください
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    ) : (
                                        <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-center gap-2">
                                            <Check className="text-green-600" size={16} />
                                            <span className="text-sm font-medium text-green-800">問題なし (Passed)</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Footer */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50">
                            {activeExpense.status === 'approved' ? (
                                <div className="w-full py-3 bg-gray-100 text-gray-500 font-bold text-center rounded-lg border border-gray-200">
                                    申請済み (Submitted)
                                </div>
                            ) : (
                                <div className="flex gap-3">
                                    <button className="flex-1 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors">
                                        除外/保留
                                    </button>
                                    <button
                                        onClick={() => handleSubmit(activeExpense.id)}
                                        className="flex-[2] py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors shadow-lg shadow-black/10 flex items-center justify-center gap-2"
                                    >
                                        <Check size={18} /> この内容で申請する
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function DataField({ label, value, icon, confidence, highlight }: any) {
    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                    {icon} {label}
                </label>
                {confidence && (
                    <span className="text-[10px] text-green-600 bg-green-50 px-1.5 rounded font-mono">
                        {confidence}%
                    </span>
                )}
            </div>
            <div className={cn(
                "p-2.5 rounded-md border text-sm font-medium",
                highlight ? "bg-blue-50 border-blue-100 text-blue-900 text-lg" : "bg-white border-gray-200 text-gray-900"
            )}>
                {value}
            </div>
        </div>
    );
}

