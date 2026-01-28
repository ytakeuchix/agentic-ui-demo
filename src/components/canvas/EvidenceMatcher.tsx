'use client';

import React from 'react';
import { useDemo } from '@/lib/DemoContext';
import {
    X,
    Check,
    Calendar,
    CreditCard,
    MapPin,
    Maximize2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function EvidenceMatcher() {
    const { expenses, setScenario } = useDemo();
    // In a real app, we'd have a selectedExpenseId. For demo, we sniff the mismatching one.
    // Case D (exp_004) is the primary Canvas scenario.
    // Case C (exp_003) might come here if user clicked "Details" in GenUI.
    const targetExpense = expenses.find(e => e.match_status === 'mismatch' && e.id === 'exp_004')
        || expenses.find(e => e.match_status === 'mismatch' && e.id === 'exp_003')
        || expenses[0];

    if (!targetExpense) return null;

    const isOverseas = targetExpense.id === 'exp_004';

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
                    {/* Left Panel: Full Data Verification */}
                    <div className="w-1/3 border-r bg-gray-50/50 p-6 overflow-y-auto">
                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                                AI抽出データ (Full Disclosure)
                            </h3>
                            <div className="bg-white border rounded-lg p-4 shadow-sm space-y-4">
                                <div className="flex items-start">
                                    <div className="bg-gray-100 p-2 rounded mr-3">
                                        <CreditCard className="w-6 h-6 text-gray-600" />
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-gray-900">
                                            {targetExpense.currency === 'USD' ? '$' : '¥'}
                                            {targetExpense.amount.toLocaleString()}
                                        </div>
                                        <div className="font-medium text-gray-700">{targetExpense.merchant}</div>
                                        <div className="text-sm text-gray-500">{targetExpense.date}</div>
                                    </div>
                                </div>

                                {/* Hidden Fields Highlighted */}
                                <div className="bg-yellow-50 border border-yellow-100 rounded p-3 text-xs space-y-2">
                                    <div className="font-semibold text-yellow-800 mb-1 flex items-center">
                                        <Check className="w-3 h-3 mr-1" />
                                        AI自動補完項目 (Hidden by default)
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-gray-600">
                                        <div>
                                            <span className="block text-gray-400">Project</span>
                                            <span className="font-mono">{targetExpense.project_code}</span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-400">Cost Center</span>
                                            <span className="font-mono">{targetExpense.cost_center}</span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-400">Tax Type</span>
                                            <span className="font-mono">不課税 (国外)</span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-400">Rate</span>
                                            <span className="font-mono">@148.50</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-500">確信度スコア</span>
                                        <span className="text-sm font-bold text-amber-600">
                                            {Math.round(targetExpense.confidence_score * 100)}% (要確認)
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-500" style={{ width: `${targetExpense.confidence_score * 100}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Evidence Stream */}
                    <div className="flex-1 bg-gray-100 p-6 overflow-y-auto relative">
                        {isOverseas ? (
                            <OverseasTimeline merchant={targetExpense.merchant} />
                        ) : (
                            <HolidayWorkEvidence />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function OverseasTimeline({ merchant }: { merchant: string }) {
    return (
        <div className="max-w-2xl mx-auto">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 sticky top-0 z-10 bg-gray-100 py-1">
                San Francisco 出張旅程 (1/14 - 1/18)
            </h3>

            <div className="space-y-6 relative ml-4">
                {/* Vertical Line */}
                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-300" />

                {/* 1. Arrival */}
                <TimelineItem
                    icon={<div className="text-xs font-bold text-blue-600">FLT</div>}
                    time="1/14 10:30"
                    title="SFO空港 到着 (JL002)"
                    status="verified"
                />

                {/* 2. The Expense in Question */}
                <TimelineItem
                    icon={<MapPin className="w-4 h-4 text-white" />}
                    iconBg="bg-amber-500"
                    time="1/14 11:15"
                    title={merchant}
                    status="attention"
                    isFocus
                >
                    <div className="bg-white p-3 rounded border border-amber-200 shadow-sm mt-2">
                        <div className="flex items-start space-x-3">
                            {/* Fake Map */}
                            <div className="w-24 h-24 bg-blue-50 rounded border flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:8px_8px]"></div>
                                <MapPin className="w-6 h-6 text-red-500 absolute top-8 left-10" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-800 text-sm">位置情報照合: マッチ</h4>
                                <p className="text-xs text-gray-600 mt-1">
                                    決済場所 (Uber App) が、出張旅程の「SFO空港周辺」および「ホテルエリア」のルート上に位置しています。
                                </p>
                                <div className="mt-2 text-xs bg-green-50 text-green-700 px-2 py-1 rounded inline-block border border-green-100">
                                    ✅ Geo-Fence Verified
                                </div>
                            </div>
                        </div>
                    </div>
                </TimelineItem>

                {/* 3. Hotel Checkin */}
                <TimelineItem
                    icon={<div className="text-xs font-bold text-blue-600">HTL</div>}
                    time="1/14 12:30"
                    title="Hyatt Regency SFO Check-in"
                    status="verified"
                />
            </div>

            <div className="mt-8 flex justify-end space-x-3">
                <button className="px-4 py-2 border rounded text-gray-600 bg-white hover:bg-gray-50">保留する</button>
                <button className="px-6 py-2 bg-green-600 text-white rounded font-bold shadow-sm hover:bg-green-700 flex items-center">
                    <Check className="w-4 h-4 mr-2" />
                    検証完了として承認
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

function TimelineItem({ icon, iconBg = "bg-white border-2 border-gray-300", time, title, status, isFocus, children }: any) {
    return (
        <div className={cn("relative pl-12 transition-opacity", isFocus ? "opacity-100" : "opacity-60 hover:opacity-100")}>
            <div className={cn("absolute left-0 w-9 h-9 rounded-full flex items-center justify-center z-10", iconBg)}>
                {icon}
            </div>
            <div>
                <div className="flex items-baseline space-x-2">
                    <span className="font-bold text-gray-800 text-sm">{title}</span>
                    <span className="text-xs text-gray-500">{time}</span>
                </div>
                {children}
            </div>
        </div>
    )
}

function EvidenceCard({ icon, title, source, time, status, children }: any) {
    const isMatched = status === 'matched';
    return (
        <div className="bg-white p-4 rounded-lg border shadow-sm flex items-start group">
            <div className={cn("p-2 rounded-full mr-4 shrink-0", isMatched ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500")}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
                    <span className="text-xs text-gray-400">{time}</span>
                </div>
                <div className="text-xs text-gray-500 mb-2">{source}</div>
                <div className="text-sm text-gray-700">
                    {children}
                </div>
            </div>
            <div className="ml-4 flex items-center self-center">
                {isMatched ? (
                    <Check className="w-5 h-5 text-green-500" />
                ) : (
                    <div className="text-xs text-red-400 font-medium px-2 py-1 bg-red-50 rounded">不一致</div>
                )}
            </div>
        </div>
    );
}
