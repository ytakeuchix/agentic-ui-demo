'use client';

import React from 'react';
import { useDemo } from '@/lib/DemoContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, X, FileText, AlertTriangle, Building, CreditCard, Calendar, Users, Info, Hash, Tag, Briefcase, Plane, Hotel, Utensils } from 'lucide-react';
import { ExpenseItem } from '@/lib/types';
import cn from 'clsx';
import { CATEGORIES_JA } from '@/lib/constants';
// Import the generated image if possible, or use a path relative to public.
// Assuming the user will move the artifact or we use a static path. For now, let's use a placeholder that looks more like a receipt or reference the artifact.
// Note: Since I cannot move the generated artifact to public automatically in this environment without user help, I will use a reliable placeholder or the artifact path if served.
// Local asset from public folder
// Local asset from public folder
const RECEIPT_IMG = '/receipt.png';
import { TimelineView } from './TimelineView';

export function CanvasDashboard() {
    const { currentScenario, setScenario, expenses, updateExpense, focusedExpenseId, setFocusedExpenseId } = useDemo();

    if (currentScenario !== 'canvas') return null;

    // 1. Identify Trigger Expense & Cluster
    const pendingExpenses = expenses.filter(e => e.status !== 'approved');
    const triggerExpense = expenses.find(e => e.id === focusedExpenseId) || pendingExpenses[0] || expenses[0];

    // 2. Resolve Cluster (All items belonging to the same Trip Group)
    // 2. Resolve Cluster (All items belonging to the same Trip Group)
    console.log('MYLOG: focusedExpenseId:', focusedExpenseId);
    if (triggerExpense) {
        console.log('MYLOG: triggerExpense:', triggerExpense.id, triggerExpense.merchant, triggerExpense.groupId);
    } else {
        console.log('MYLOG: triggerExpense NOT FOUND');
    }

    const clusterExpenses = triggerExpense && triggerExpense.groupId
        ? expenses.filter(e => e.groupId === triggerExpense.groupId).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        : [triggerExpense];
    console.log('MYLOG: clusterExpenses count:', clusterExpenses.length);
    console.log('MYLOG: clusterExpenses items:', clusterExpenses.map(e => e.merchant).join(', '));
    console.log('MYLOG: expenses sample:', expenses.slice(0, 3).map(e => `${e.id}:${e.groupId}`).join(', '));

    const currentActiveId = focusedExpenseId || clusterExpenses[0]?.id;
    const currentActiveExpense = clusterExpenses.find(e => e.id === currentActiveId) || clusterExpenses[0];

    const handleApproveTrip = () => {
        // Approve ALL in cluster
        clusterExpenses.forEach(e => updateExpense(e.id, { status: 'approved' }));
        setScenario('done');
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
                    <div>
                        <h1 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                            Trip Verification: San Francisco Jan 2026
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
                                Cluster Inspection
                            </span>
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Total Trip Cost: </span>
                    <span className="font-mono font-bold text-gray-900">
                        ¥{clusterExpenses.reduce((sum, e) => sum + (e.currency === 'JPY' ? e.amount : e.amount * (e.currency_rate || 150)), 0).toLocaleString()}
                    </span>
                </div>
            </header>

            {/* Main Workspace (3-Pane Layout) */}
            <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 p-6 gap-6">

                {/* 1. Timeline Pane (Top) - Fixed Height */}
                <div className="h-48 shrink-0 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                    <TimelineView
                        expenses={clusterExpenses}
                        highlightId={currentActiveId || undefined}
                        onSelect={setFocusedExpenseId}
                    />
                </div>

                {/* Bottom Area: Verification & Data */}
                <div className="flex-1 flex gap-6 min-h-0">

                    {/* 2. Geo & Validation Status (Bottom Left) */}
                    <div className="w-80 flex flex-col gap-4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex-1">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Building size={14} /> Geo-Spatial Verification
                            </h3>

                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-600">Zone Check</span>
                                        {currentActiveExpense.itinerary_match === 'warning' ? (
                                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-bold flex items-center gap-1">
                                                <AlertTriangle size={12} /> Out of Zone
                                            </span>
                                        ) : (
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold flex items-center gap-1">
                                                <Check size={12} /> In Zone (SFO)
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        Checking against hotel vicinity (Grand Hyatt SFO) and office locations.
                                    </p>
                                </div>

                                {currentActiveExpense.ai_reasoning && (
                                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Info size={16} className="text-purple-600" />
                                            <span className="text-sm font-bold text-purple-800">AI Logic Inference</span>
                                        </div>
                                        <p className="text-xs text-purple-700 leading-relaxed">
                                            {currentActiveExpense.ai_reasoning}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 3. Cluster Expense List (Bottom Right) - Scrollable */}
                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                        <div className="h-12 border-b border-gray-100 flex items-center justify-between px-6 bg-gray-50/50">
                            <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                <CreditCard size={14} /> Trip Expenses ({clusterExpenses.length})
                            </span>
                            <button
                                onClick={handleApproveTrip}
                                className="bg-black hover:bg-gray-800 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <Check size={14} /> Approve Entire Trip
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {clusterExpenses.map(exp => (
                                <div
                                    key={exp.id}
                                    onClick={() => setFocusedExpenseId(exp.id)}
                                    className={cn(
                                        "border rounded-xl p-4 transition-all cursor-pointer relative",
                                        exp.id === currentActiveId
                                            ? "bg-blue-50/30 border-blue-500 shadow-md ring-1 ring-blue-500"
                                            : "bg-white border-gray-200 hover:border-blue-300"
                                    )}
                                >
                                    {/* Header Line */}
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                {/* Category Icon */}
                                                {exp.category === 'Travel' ? <Plane size={18} /> :
                                                    exp.category === 'Accommodation' ? <Hotel size={18} /> :
                                                        exp.category === 'Meals' ? <Utensils size={18} /> : <CreditCard size={18} />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 leading-tight">{exp.merchant}</h4>
                                                <p className="text-xs text-gray-500">{exp.date} • {exp.timestamp?.split('T')[1].substr(0, 5)}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-mono font-bold text-lg text-gray-900">
                                                {exp.currency === 'JPY' ? '¥' : exp.currency === 'USD' ? '$' : exp.currency}
                                                {exp.amount.toLocaleString()}
                                            </div>
                                            {exp.currency !== 'JPY' && (
                                                <div className="text-xs text-gray-500">
                                                    ≈ ¥{(exp.amount * (exp.currency_rate || 150)).toLocaleString()}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Detail Grid */}
                                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                                        <div>
                                            <span className="text-gray-400 block mb-0.5">Category</span>
                                            {exp.category}
                                        </div>
                                        <div>
                                            <span className="text-gray-400 block mb-0.5">Project / Cost Center</span>
                                            {exp.project_code} / {exp.cost_center}
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-gray-400 block mb-0.5">Description</span>
                                            {exp.description}
                                        </div>
                                    </div>

                                    {/* Attendee / Warning Badges */}
                                    <div className="mt-3 flex gap-2">
                                        {exp.is_violation && (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                                                <AlertTriangle size={10} /> {exp.warning_message || 'Policy Warning'}
                                            </span>
                                        )}
                                        {exp.currency !== 'JPY' && (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                                                Rate: @{exp.currency_rate}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

