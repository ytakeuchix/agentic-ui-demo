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
    Mail,        // Email
    Loader2      // Loading Spinner
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function DailySummaryCard() {
    const { expenses, setScenario, setFocusedExpenseId } = useDemo();
    const [showCard, setShowCard] = React.useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => setShowCard(true), 800);
        return () => clearTimeout(timer);
    }, []);

    // Grouping Logic
    const displayItems: ExpenseItem[] = [];
    const processedGroups = new Set<string>();

    expenses.forEach(exp => {
        if (exp.groupId) {
            if (processedGroups.has(exp.groupId)) return;

            // Create Group Summary
            const groupItems = expenses.filter(e => e.groupId === exp.groupId);
            processedGroups.add(exp.groupId);

            // Find representative item (Prioritize ANA or similar, otherwise first)
            const anchor = groupItems.find(e => e.merchant.includes('ANA')) || groupItems[0];
            const totalJpy = groupItems.reduce((sum, e) => {
                const rate = e.currency_rate || 151.2; // fallback rate
                const amountJpy = e.currency === 'JPY' ? e.amount : e.amount * rate;
                return sum + amountJpy;
            }, 0);

            // Determine Group Status (Worst case wins)
            const hasViolation = groupItems.some(e => e.is_violation || e.match_status === 'mismatch' || e.match_status === 'manual_required');

            const groupItem: ExpenseItem = {
                ...anchor,
                merchant: `${anchor.merchant} など${groupItems.length}件`,
                description: 'サンフランシスコ出張',
                amount: Math.floor(totalJpy),
                currency: 'JPY',
                is_violation: hasViolation,
                // If any item has warning, show warning
                match_status: hasViolation ? 'mismatch' : 'matched',
                id: anchor.id // Use anchor ID to trigger correct focus
            };
            displayItems.push(groupItem);
        } else {
            displayItems.push(exp);
        }
    });

    // Calculate totals for valid display (using the grouped list might be misleading for total count, 
    // but the spec says "expenses.length" which is raw count. Let's keep raw count for header but use grouped for list)

    // Recalculate Total Amount correctly (handling currencies)
    const grandTotalJpy = expenses.reduce((sum, item) => {
        const rate = item.currency_rate || 151.2;
        const val = item.currency === 'JPY' ? item.amount : item.amount * rate;
        return sum + val;
    }, 0);

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

                {/* Text Message - Always visible immediately */}
                <div className="text-sm text-gray-800 leading-relaxed max-w-fit bg-white/50 px-2 py-1 rounded mb-1 animate-in fade-in slide-in-from-bottom-1 duration-300">
                    お疲れ様です 🍵<br />
                    本日確認していただきたい経費精算です。
                </div>

                {/* AI Loading State */}
                {!showCard && (
                    <div className="flex items-center space-x-2 text-purple-600 bg-purple-50 p-3 rounded-md text-sm border border-purple-100 animate-in fade-in zoom-in-95 duration-300">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="font-medium">AI is generating daily summary...</span>
                    </div>
                )}

                {/* ZeroUI Card - Delayed appearance */}
                {showCard && (
                    <div className="bg-white border text-sm rounded-lg shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-forwards">
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
                                            すべて取引の確認が完了しました。
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-gray-500 block">合計</span>
                                <span className="font-bold text-lg">¥{Math.floor(grandTotalJpy).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="divide-y">
                            {displayItems.map((expense) => (
                                <ExpenseRow
                                    key={expense.id}
                                    expense={expense}
                                    onFix={() => {
                                        // Case D (Overseas Group) -> Direct to Canvas
                                        if (expense.groupId || expense.merchant.includes('Uber *Trip')) {
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
                                onClick={() => setScenario('submitted')}
                            >
                                {isAllClear ? '経費申請を確定する' : `経費申請を確定する`}
                            </button>
                        </div>
                    </div>
                )}
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
