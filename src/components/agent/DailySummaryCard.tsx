'use client';

import React from 'react';
import { useDemo } from '@/lib/DemoContext';
import { ExpenseItem } from '@/lib/types';
import {
    CheckCircle,
    AlertTriangle,
    AlertOctagon,
    ChevronRight,
    Bot,
    Search,
    FileText,    // Receipt
    Calendar,    // Calendar
    CreditCard,  // CC
    Mail         // Email
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function DailySummaryCard() {
    const { expenses, setScenario, setFocusedExpenseId } = useDemo();

    // Calculate totals
    const totalAmount = expenses.reduce((sum, item) => sum + item.amount, 0);
    // Include manual_required in the count
    const violationCount = expenses.filter(e => e.is_violation || e.match_status === 'mismatch' || e.match_status === 'manual_required').length;
    const isAllClear = violationCount === 0;

    return (
        <div className="flex items-start space-x-3 max-w-2xl animate-in slide-in-from-bottom-2 fade-in duration-500">
            {/* Agent Avatar */}
            <div className="w-9 h-9 rounded bg-[#2eb67d] flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-5 h-5 text-white" />
            </div>

            <div className="flex-1 space-y-1">
                <div className="flex items-baseline space-x-2">
                    <span className="font-bold text-gray-900">経費精算Bot</span>
                    <span className="text-xs text-gray-500">APP 18:00</span>
                </div>

                {/* Message Bubble content */}
                <div className="bg-white border text-sm rounded-lg shadow-sm overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold text-gray-800">日次経費サマリー (1月24日)</h3>
                            <div className="flex flex-col mt-1 space-y-1">
                                <div className="text-xs text-gray-500 flex items-center">
                                    <span>{expenses.length}件の取引を処理しました</span>
                                </div>
                                {violationCount > 0 ? (
                                    <span className="text-xs text-amber-600 font-medium flex items-center">
                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                        {violationCount}件の要確認項目があります
                                    </span>
                                ) : (
                                    <span className="text-xs text-green-600 font-medium flex items-center">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        すべて承認可能です
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-xs text-gray-500 block">合計</span>
                            <span className="font-bold text-lg">¥{totalAmount.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="divide-y">
                        {expenses.map((expense) => (
                            <ExpenseRow
                                key={expense.id}
                                expense={expense}
                                onFix={() => {
                                    // Case D (Overseas) -> Direct to Canvas (Too complex for GenUI)
                                    // Case D (Overseas) -> Direct to Canvas (Too complex for GenUI)
                                    if (expense.merchant === 'Uber *Trip' || expense.id === 'exp_004') {
                                        setFocusedExpenseId(expense.id);
                                        setScenario('canvas');
                                    } else {
                                        setFocusedExpenseId(expense.id);
                                        setScenario('gen-ui');
                                    }
                                }}
                                onShowDetails={() => {
                                    setFocusedExpenseId(expense.id);
                                    setScenario('canvas');
                                }}
                            />
                        ))}
                    </div>

                    <div className="p-3 bg-gray-50 border-t flex justify-end">
                        <button
                            className={cn(
                                "px-4 py-2 rounded text-sm font-medium transition-colors",
                                isAllClear
                                    ? "bg-green-600 text-white hover:bg-green-700 shadow-sm"
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            )}
                            disabled={!isAllClear}
                        >
                            {isAllClear ? 'すべての経費を一括申請' : `${violationCount}件の不備を修正`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ExpenseRow({ expense, onFix, onShowDetails }: { expense: ExpenseItem; onFix: () => void; onShowDetails: () => void }) {
    const isWarning = expense.is_violation || expense.match_status === 'mismatch' || expense.match_status === 'manual_required';

    const StatusIcon = () => {
        // Unified to Amber Triangle per user request
        if (expense.match_status === 'mismatch' || expense.match_status === 'manual_required' || expense.is_violation) {
            return <AlertTriangle className="w-4 h-4 text-amber-500" />;
        }
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    };

    return (
        <div className={cn(
            "px-4 py-3 flex items-center justify-between group transition-colors",
            isWarning ? "bg-amber-50/30 hover:bg-amber-50/60" : "hover:bg-gray-50"
        )}>
            <div className="flex items-center space-x-3 overflow-hidden">
                <div className="shrink-0 mt-0.5">
                    <StatusIcon />
                </div>
                <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 truncate">{expense.merchant}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                            {expense.category}
                        </span>
                    </div>
                    {/* Added Description per user feedback */}
                    <div className="text-sm text-gray-600 truncate max-w-md">
                        {expense.description}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center mt-0.5 space-x-2">
                        <span>{expense.date}</span>
                        <span>•</span>
                        <span>¥{expense.amount.toLocaleString()}</span>
                        <span className="text-gray-300">|</span>
                        <SourceIcons sources={expense.evidence_sources} />
                    </div>
                    {isWarning && (
                        <div className="text-xs text-amber-600 mt-1 font-medium flex items-center animate-pulse">
                            {expense.warning_message || 'AIによるデータ不整合検出'}
                        </div>
                    )}
                </div>
            </div>

            <div className="ml-4 shrink-0 flex items-center space-x-2">
                {isWarning ? (
                    <button
                        onClick={onFix}
                        className="px-3 py-1.5 text-xs border border-amber-300 bg-white text-amber-700 rounded hover:bg-amber-50 transition-colors shadow-sm font-medium flex items-center"
                    >
                        確認・修正
                        <ChevronRight className="w-3 h-3 ml-1" />
                    </button>
                ) : (
                    <div className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs border border-green-100 flex items-center">
                        <Bot className="w-3 h-3 mr-1" />
                        AI承認済
                    </div>
                )}
            </div>
        </div>
    );
}

function SourceIcons({ sources }: { sources: string[] }) {
    if (!sources || sources.length === 0) return null;

    const getIcon = (source: string) => {
        switch (source) {
            case 'Receipt': return <FileText className="w-3 h-3" />;
            case 'GCalendar': return <Calendar className="w-3 h-3" />;
            case 'CreditCard': return <CreditCard className="w-3 h-3" />;
            case 'Email': return <Mail className="w-3 h-3" />;
            default: return null;
        }
    };

    return (
        <div className="flex items-center space-x-1" title="Evidence Sources">
            {sources.map(s => (
                <span key={s} className="text-gray-300" title={s}>
                    {getIcon(s)}
                </span>
            ))}
        </div>
    );
}
