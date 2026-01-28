'use client';

import React, { useState } from 'react';
import { useDemo } from '@/lib/DemoContext';
import {
    X,
    Check,
    Calendar,
    CreditCard,
    MapPin,
    Maximize2,
    Utensils,
    AlertTriangle,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExpenseItem } from '@/lib/types';

const TRIP_REQUEST = {
    id: "REQ-2026-0012",
    title: "Salesforce World Tour 参加の件",
    purpose: "最新のCRMトレンド把握およびパートナー企業とのネットワーキングのため。",
    period: "2026/01/20 - 2026/01/25",
    link: "https://example.com/requests/req_202601",
    companions: ["山田 太郎 (営業部)", "鈴木 一郎 (開発部)"],
    budget: {
        total: "¥850,000",
        breakdown: [
            { item: "航空券", check: "¥300,000" },
            { item: "宿泊費", check: "¥400,000" },
            { item: "その他", check: "¥150,000" }
        ]
    }
};

export function EvidenceMatcher() {
    const { expenses, setScenario, updateExpense } = useDemo();
    // In a real app, we'd have a selectedExpenseId. For demo, we sniff the mismatching one.
    // Case D (exp_004) is the primary Canvas scenario.
    // Case C (exp_003) might come here if user clicked "Details" in GenUI.
    const targetExpense = expenses.find(e => e.match_status === 'mismatch' && e.id === 'exp_004')
        || expenses.find(e => e.match_status === 'mismatch' && e.id === 'exp_003')
        || expenses[0];

    // Main Selection (for Left Panel Highlighting)
    const [selectedId, setSelectedId] = useState<string>(targetExpense?.id || '');

    if (!targetExpense) return null;

    const isOverseas = targetExpense.id === 'exp_004';

    // Get all expenses in the same trip cluster
    const clusterExpenses = targetExpense.groupId
        ? expenses
            .filter(e => e.groupId === targetExpense.groupId)
            .sort((a, b) => {
                const tA = a.timestamp ? new Date(a.timestamp).getTime() : new Date(a.date).getTime();
                const tB = b.timestamp ? new Date(b.timestamp).getTime() : new Date(b.date).getTime();
                return tA - tB;
            })
        : [targetExpense];

    // Determine currently displayed expense (fallback to target if something goes wrong, though state logic covers it)
    const selectedExpense = expenses.find(e => e.id === selectedId) || targetExpense;

    const handleConfirm = () => {
        // Update all related expenses to "verified" state
        clusterExpenses.forEach(exp => {
            updateExpense(exp.id, {
                match_status: 'matched',
                is_violation: false,
                status: 'approved',
                warning_message: undefined
            });
        });

        // Close Canvas
        setScenario('done');
    };

    return (
        <div className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white w-full h-full max-w-6xl rounded-xl shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="h-14 border-b flex items-center justify-between px-6 bg-gray-50 flex-shrink-0">
                    <div className="flex items-center space-x-2">
                        <div className="bg-purple-600 text-white p-1 rounded">
                            <Maximize2 className="w-4 h-4" />
                        </div>
                        <h2 className="font-bold text-gray-800">
                            {isOverseas ? 'AI推論・エビデンス詳細確認 (Overseas Verification)' : 'AI推論・エビデンス詳細確認'}
                        </h2>
                    </div>
                    <button
                        onClick={() => setScenario('idle')}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content Body */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Left Panel: Reference (Approved Request) */}
                    <div className="w-1/3 border-r bg-blue-50/30 p-6 overflow-y-auto">
                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-blue-900/60 uppercase tracking-wider mb-3">
                                事前申請データ (Approved Request)
                            </h3>

                            {/* Request Card */}
                            <div className="bg-white border border-blue-100 rounded-lg p-5 shadow-sm space-y-5">
                                <div>
                                    <div className="flex items-start justify-between">
                                        <h2 className="text-lg font-bold text-gray-900 leading-tight">
                                            {TRIP_REQUEST.title}
                                        </h2>
                                        <a href={TRIP_REQUEST.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors">
                                            <ExternalLink className="w-5 h-5" />
                                        </a>
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1 flex items-center">
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded font-medium mr-2">承認済</span>
                                        {TRIP_REQUEST.id}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <div className="text-xs font-semibold text-gray-400 uppercase">Purpose</div>
                                        <div className="text-sm text-gray-700 mt-0.5">{TRIP_REQUEST.purpose}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs font-semibold text-gray-400 uppercase">Period</div>
                                        <div className="text-sm text-gray-700 mt-0.5">{TRIP_REQUEST.period}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs font-semibold text-gray-400 uppercase">Companions</div>
                                        <div className="text-sm text-gray-700 mt-0.5">{TRIP_REQUEST.companions.join(', ')}</div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <h4 className="text-sm font-bold text-gray-800 mb-2">Budget Breakdown</h4>
                                    <div className="space-y-2">
                                        {TRIP_REQUEST.budget.breakdown.map((b, i) => (
                                            <div key={i} className="flex justify-between text-sm">
                                                <span className="text-gray-600">{b.item}</span>
                                                <span className="font-mono font-medium">{b.check}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between text-sm pt-2 border-t border-dashed mt-2">
                                            <span className="font-bold text-gray-700">Total</span>
                                            <span className="font-mono font-bold text-gray-900">{TRIP_REQUEST.budget.total}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Evidence Stream */}
                    <div className="flex-1 bg-gray-100 p-6 overflow-y-auto relative">
                        {isOverseas ? (
                            <OverseasTimeline
                                expenses={clusterExpenses}
                                targetId={targetExpense.id} // The original trigger item
                                selectedId={selectedId}
                                onSelect={setSelectedId}
                                onConfirm={handleConfirm}
                            />
                        ) : (
                            <HolidayWorkEvidence />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface OverseasTimelineProps {
    expenses: ExpenseItem[];
    targetId: string;
    selectedId: string;
    onSelect: (id: string) => void;
    onConfirm?: () => void;
}

function OverseasTimeline({ expenses, targetId, selectedId, onSelect, onConfirm }: OverseasTimelineProps) {
    // Independent Expansion State
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    const toggleExpand = (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // prevent selection when clicking chevron
        const newSet = new Set(expandedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setExpandedIds(newSet);
    };

    // Determine date range for header
    const dates = expenses.map(e => new Date(e.date));
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    const dateRangeStr = `${minDate.getMonth() + 1}/${minDate.getDate()} - ${maxDate.getMonth() + 1}/${maxDate.getDate()}`;

    return (
        <div className="max-w-2xl mx-auto">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 sticky top-0 z-10 bg-gray-100 py-1">
                関連決済履歴 (Payment History) <span className="text-xs font-normal text-gray-400 ml-2">{dateRangeStr}</span>
            </h3>

            <div className="space-y-6 relative ml-4">
                {/* Vertical Line */}
                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-300" />

                {expenses.map((exp) => {
                    const isSelected = exp.id === selectedId;
                    const isExpanded = expandedIds.has(exp.id);
                    const timestamp = exp.timestamp ? new Date(exp.timestamp) : new Date(exp.date);
                    const timeStr = `${timestamp.getMonth() + 1}/${timestamp.getDate()} ${timestamp.getHours().toString().padStart(2, '0')}:${timestamp.getMinutes().toString().padStart(2, '0')}`;

                    // Determine Icon
                    let iconNode = <CreditCard className="w-4 h-4 text-gray-500" />;
                    let iconBg = "bg-white border-2 border-gray-300";
                    let title = exp.merchant;

                    // Data setup
                    let formattedAmount = `¥${exp.amount.toLocaleString()}`;
                    if (exp.currency !== 'JPY') {
                        const rate = exp.currency_rate || 150;
                        const jpyValue = Math.floor(exp.amount * rate);
                        const foreignValue = exp.amount.toLocaleString(undefined, { minimumFractionDigits: 2 });
                        formattedAmount = `¥${jpyValue.toLocaleString()} ($${foreignValue})`;
                    }

                    let statusLabel = "AI承認済";
                    let statusColor = "text-green-600";
                    let reasonText = "整合性確認完了";
                    let StatusIcon = Check;

                    const score = Math.round((exp.confidence_score || 0) * 100);

                    if (exp.category === 'Travel' && exp.merchant.includes('ANA')) {
                        iconNode = <div className="text-xs font-bold text-blue-600">FLT</div>;
                        iconBg = "bg-white border-2 border-green-500"; // Assuming verified flight
                        title = exp.merchant;
                        reasonText = `出張申請の経路と一致 (確信度${score}%)`;
                    } else if (exp.category === 'Accommodation') {
                        iconNode = <div className="text-xs font-bold text-blue-600">HTL</div>;
                        iconBg = "bg-white border-2 border-green-500";
                        title = exp.merchant;
                        reasonText = `宿泊予約情報と一致 (確信度${score}%)`;
                    } else if (exp.id === targetId) {
                        if (exp.merchant.includes('Uber')) {
                            // IMPROVED UBER VISUALS
                            iconNode = <Sparkles className="w-4 h-4 text-white" />;
                            iconBg = "bg-gradient-to-br from-indigo-500 to-purple-500 border-none shadow-sm"; // AI Feeling
                            statusLabel = "AI推奨";
                            statusColor = "text-purple-600";
                            reasonText = `ルート照合済・確認待ち (確信度${score}%)`;
                            StatusIcon = Sparkles;
                        } else {
                            // Fallback
                        }
                    } else if (exp.category === 'Meals') {
                        iconNode = <Utensils className="w-4 h-4 text-gray-600" />;
                        iconBg = exp.is_violation ? "bg-red-100 border-2 border-red-500" : "bg-white border-2 border-gray-300";
                        if (exp.is_violation) {
                            statusLabel = "警告";
                            statusColor = "text-red-600";
                            reasonText = `休日・エリア外利用 (確信度${score}%)`;
                            StatusIcon = AlertTriangle;
                        }
                    }

                    return (
                        <TimelineItem
                            key={exp.id}
                            icon={iconNode}
                            iconBg={iconBg}
                            time={timeStr}
                            title={title}
                            status={isSelected ? "attention" : "verified"}
                            isFocus={isSelected}
                            onClick={() => onSelect(exp.id)}
                            onToggle={(e: React.MouseEvent) => toggleExpand(exp.id, e)}
                            isExpanded={isExpanded}
                        >
                            {/* NEW: Amount and Status Row */}
                            <div className="mt-0.5 mb-2">
                                <div className="font-bold text-gray-900">{formattedAmount}</div>
                                <div className="flex items-center text-xs mt-1 text-gray-600">
                                    <span className={cn("inline-flex items-center font-bold mr-2", statusColor)}>
                                        <StatusIcon className="w-3 h-3 mr-1" />
                                        {statusLabel}
                                    </span>
                                    <span className="text-gray-500">{reasonText}</span>
                                </div>
                            </div>

                            {/* INLINE EXPANSION: Detailed Meta Data */}
                            {isExpanded && (
                                <div className="mt-3 mb-3 bg-gray-50 border rounded p-3 text-xs animate-in fade-in zoom-in-95 duration-200 cursor-default" onClick={(e) => e.stopPropagation()}>
                                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                        <div>
                                            <span className="block text-gray-400 font-medium">Category</span>
                                            <span className="text-gray-700">{exp.category}</span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-400 font-medium">Project</span>
                                            <span className="text-gray-700 font-mono">{exp.project_code || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-400 font-medium">Cost Center</span>
                                            <span className="text-gray-700 font-mono">{exp.cost_center || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-400 font-medium">Tax</span>
                                            <span className="text-gray-700">
                                                {exp.tax > 0 ? `¥${exp.tax.toLocaleString()} (10%)` : '不課税 (0%)'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Detailed Cards only appear if Selected (still relevant for "Evidence") */}
                            {exp.merchant.includes('Uber') && (
                                <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 shadow-sm mt-3 cursor-default" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-start space-x-3">
                                        {/* Fake Map */}
                                        <div className="w-24 h-24 bg-white rounded border border-blue-100 flex items-center justify-center relative overflow-hidden">
                                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:8px_8px]"></div>
                                            <MapPin className="w-6 h-6 text-blue-500 absolute top-8 left-10" />
                                            {/* Route Line Visualization */}
                                            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                                <path d="M10,80 Q40,40 90,20" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 text-sm flex items-center">
                                                <Sparkles className="w-3 h-3 text-purple-500 mr-1.5" />
                                                位置情報照合: AI Verified
                                            </h4>
                                            <p className="text-xs text-gray-600 mt-1 leading-snug">
                                                決済場所 ({exp.merchant}) が、出張旅程の「SFO空港周辺」および「ホテルエリア」のルート上に位置しています。
                                            </p>

                                            {/* Action Button */}
                                            <button className="mt-3 w-full bg-white border border-blue-200 hover:bg-blue-50 text-blue-700 font-bold text-xs py-2 px-3 rounded shadow-sm flex items-center justify-center transition-colors">
                                                <Check className="w-3 h-3 mr-1.5" />
                                                ルートを確認して完了
                                            </button>
                                            <button className="mt-2 w-full text-gray-500 hover:text-red-600 hover:bg-red-50/50 text-xs py-2 px-3 rounded flex items-center justify-center transition-colors">
                                                <span className="mr-1.5">🗑️</span>
                                                私的利用のため除外する
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {exp.is_violation && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3 cursor-default" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-center text-red-800 font-bold mb-2">
                                        <AlertTriangle className="w-5 h-5 mr-2" />
                                        ポリシー違反の疑い (High Risk)
                                    </div>
                                    <p className="text-sm text-red-700 mb-3 leading-relaxed">
                                        {exp.warning_message || "ポリシーに違反している可能性があります。"}<br />
                                        <span className="text-xs opacity-90">業務関連性を証明するために、以下のアクションが必要です。</span>
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        <button className="bg-white border border-red-200 text-red-700 px-3 py-2 rounded text-sm font-bold shadow-sm hover:bg-red-50 text-left flex items-center transition-colors group/btn">
                                            <span className="mr-2 group-hover/btn:scale-110 transition-transform">👥</span> 接待・会食相手を入力
                                        </button>
                                        <button className="bg-white border border-red-200 text-red-700 px-3 py-2 rounded text-sm font-bold shadow-sm hover:bg-red-50 text-left flex items-center transition-colors group/btn">
                                            <span className="mr-2 group-hover/btn:scale-110 transition-transform">📄</span> 事前承認を紐付け (Manager Approval)
                                        </button>
                                        <button className="bg-red-100 border border-red-200 text-red-800 px-3 py-2 rounded text-sm font-bold hover:bg-red-200 text-left flex items-center transition-colors group/btn">
                                            <span className="mr-2 group-hover/btn:scale-110 transition-transform">🗑️</span> 私的な利用のため除外する
                                        </button>
                                    </div>
                                </div>
                            )}
                        </TimelineItem>
                    );
                })}
            </div>

            <div className="mt-8 flex justify-end space-x-3">
                <button className="px-4 py-2 border rounded text-gray-600 bg-white hover:bg-gray-50">保留する</button>
                <button onClick={onConfirm} className="px-6 py-2 bg-green-600 text-white rounded font-bold shadow-sm hover:bg-green-700 flex items-center">
                    <Check className="w-4 h-4 mr-2" />
                    確認完了
                </button>
            </div>
        </div>
    );
}

function HolidayWorkEvidence() {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-gray-500 text-center mt-10">詳細エビデンスを表示中...</div>
        </div>
    )
}

function TimelineItem({ icon, iconBg = "bg-white border-2 border-gray-300", time, title, status, isFocus, isExpanded, children, onClick, onToggle }: any) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "relative pl-12 transition-all duration-200 cursor-pointer group"
            )}
        >
            <div className={cn("absolute left-0 w-9 h-9 rounded-full flex items-center justify-center z-10 transition-transform", iconBg, isFocus ? "scale-110 shadow-md" : "group-hover:scale-105")}>
                {icon}
            </div>

            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-baseline space-x-2">
                        <span className={cn("font-bold text-sm", isFocus ? "text-gray-900" : "text-gray-700")}>{title}</span>
                        <span className="text-xs text-gray-500">{time}</span>
                    </div>
                </div>
                {/* Expand Toggle */}
                <button
                    onClick={onToggle}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors -mt-1 -mr-2"
                >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
            </div>

            {children}

        </div>
    )
}


