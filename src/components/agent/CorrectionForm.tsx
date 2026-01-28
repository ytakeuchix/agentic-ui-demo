'use client';

import React, { useState, useEffect } from 'react';
import { useDemo } from '@/lib/DemoContext';
import { ExpenseItem } from '@/lib/types';
import {
    UserPlus,
    Save,
    Sparkles,
    AlertCircle,
    Users,
    Check,
    Info,
    MessageSquare,
    ArrowRight,
    Loader2,
    ChevronDown,
    ChevronUp,
    FileText,
    ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function CorrectionForm() {
    const { expenses, updateExpense, setScenario, focusedExpenseId, setFocusedExpenseId } = useDemo();

    // Prioritize the focused item, otherwise find the first item that needs attention
    const targetExpense = focusedExpenseId
        ? expenses.find(e => e.id === focusedExpenseId)
        : expenses.find(e => e.is_violation || e.match_status === 'mismatch');

    const [isGenerating, setIsGenerating] = useState(true);

    useEffect(() => {
        if (targetExpense) {
            setIsGenerating(true);
            const timer = setTimeout(() => setIsGenerating(false), 800); // Simulate generation time
            return () => clearTimeout(timer);
        }
    }, [targetExpense?.id]); // Depend on ID change

    // If no violations left, auto-close or show success?
    // Let's go back to 'notification' (summary view) so user can see the "All Clear" state.
    useEffect(() => {
        if (!targetExpense) {
            // Simple delay to let user see "Saved" before closing
            const timer = setTimeout(() => setScenario('notification'), 500);
            return () => clearTimeout(timer);
        }
    }, [targetExpense, setScenario]);

    if (!targetExpense) return null;

    // Canvas Redirect for complex items (Uber *Trip)
    if (targetExpense.merchant === 'Uber *Trip' || targetExpense.groupId) {
        return (
            <div className="max-w-xl ml-12 my-4">
                <GenUIContainer>
                    <div className="p-6 text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">詳細な照合が必要です</h3>
                        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                            「ANA (All Nippon Airways) など4件」の明細は、海外出張の経路情報との複雑な照合が必要です。<br />
                            専用の検証画面でルートを確認してください。
                        </p>

                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={() => {
                                    setFocusedExpenseId(targetExpense.id);
                                    setScenario('canvas');
                                }}
                                className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-md shadow-sm hover:bg-purple-700 font-bold transition-colors"
                            >
                                検証画面を開く
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                            <button
                                onClick={() => {
                                    setFocusedExpenseId(null);
                                    setScenario('notification');
                                }}
                                className="text-sm text-gray-500 hover:text-gray-700"
                            >
                                後で確認する
                            </button>
                        </div>
                    </div>
                </GenUIContainer>
            </div>
        );
    }

    if (isGenerating) {
        return (
            <div className="max-w-xl ml-12 my-4">
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center space-x-2 text-purple-600 bg-purple-50 p-3 rounded-md text-sm border border-purple-100"
                >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="font-medium">AI is generating the optimal verified form...</span>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="max-w-xl ml-12 my-4">
            <GenUIContainer key={targetExpense.id}>
                <div className="p-4">
                    {/* Header */}
                    <div className="flex items-center space-x-2 mb-4 text-purple-700">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                            AI Generated Form: 経費規定チェック
                        </span>
                    </div>

                    {/* Context Card */}
                    <div className="bg-gray-50 rounded p-3 mb-4 border border-gray-100 flex justify-between items-center text-sm">
                        <div>
                            <div className="font-bold text-gray-800">{targetExpense.merchant}</div>
                            <div className="text-gray-500">{targetExpense.date} • ¥{targetExpense.amount.toLocaleString()}</div>
                        </div>
                    </div>
                    <div className="text-amber-600 text-xs font-medium bg-amber-50 px-2 py-1 rounded border border-amber-100 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {targetExpense.warning_message || '確認が必要です'}
                    </div>
                </div>

                {/* Hidden by Default: Full Details Toggle */}
                <FullDetailsToggle expense={targetExpense} />

                {/* Dynamic Fields based on violation type */}
                {/* Dynamic Fields based on violation type */}
                <div className="px-4 pb-4">
                    {targetExpense.category === 'Meals' ? (
                        <>
                            <div className="mb-4 bg-blue-50 border border-blue-100 text-blue-800 p-3 rounded-md text-xs flex items-start leading-relaxed">
                                <Info className="w-4 h-4 mr-2 shrink-0 mt-0.5 text-blue-600" />
                                <span>
                                    Googleカレンダーの予定から同席者が取得できなかったため、同席者の入力が必要です。
                                </span>
                            </div>
                            <AttendeeInput
                                expense={targetExpense}
                                onSave={(updatedAttendees) => {
                                    updateExpense(targetExpense.id, {
                                        attendees: updatedAttendees,
                                        is_violation: false,
                                        match_status: 'matched',
                                        warning_message: undefined,
                                        status: 'fixed'
                                    });
                                    // Clear focus to allow auto-advance to next violation
                                    setFocusedExpenseId(null);
                                }}
                            />
                        </>
                    ) : targetExpense.category === 'Travel' ? (
                        <div className="space-y-4">
                            {/* AI Inference Highlight */}
                            <div className="bg-purple-50 border border-purple-100 rounded-md p-3">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Sparkles className="w-4 h-4 text-purple-600" />
                                    <span className="text-xs font-bold text-purple-700 uppercase">AI インサイト</span>
                                </div>
                                <p className="text-sm text-gray-800 font-medium mb-1">
                                    Slack <span className="text-blue-600">#dev-alerts</span> での「緊急障害対応」の発言と「1/24 休日出勤申請」に基づき、
                                    <span className="font-bold">「プロジェクトA 緊急対応」</span>に伴う移動と推測されます。
                                </p>
                                <div className="mt-2 space-y-2">
                                    <div className="text-xs text-gray-500 bg-white p-2 rounded border flex items-start">
                                        <MessageSquare className="w-3 h-3 mr-2 mt-0.5 text-blue-500" />
                                        <span>
                                            "Server down, heading to office ASAP." - 1/24 (Sat) 13:45 (#dev-alerts)
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500 bg-white p-2 rounded border flex items-start">
                                        <FileText className="w-3 h-3 mr-2 mt-0.5 text-green-600" />
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-700">休日出勤申請: PRJ-A 緊急対応</span>
                                                <span className="text-green-600 text-[10px] border border-green-200 bg-green-50 px-1 rounded">承認済</span>
                                            </div>
                                            <div className="mt-0.5 text-gray-400">2026/01/24 10:00 - 18:00</div>
                                            <a href="#" className="text-blue-500 hover:underline mt-1 inline-flex items-center">
                                                申請書を開く <ExternalLink className="w-2.5 h-2.5 ml-1" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-3 pt-2">
                                <button
                                    onClick={() => {
                                        updateExpense(targetExpense.id, {
                                            description: 'プロジェクトA 緊急障害対応 (休日出勤)',
                                            project_code: 'PRJ-A-EMERGENCY',
                                            is_violation: false,
                                            match_status: 'matched',
                                            warning_message: undefined,
                                            status: 'fixed'
                                        });
                                        setFocusedExpenseId(null);
                                    }}
                                    className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-md shadow-sm hover:bg-purple-700 font-bold transition-colors"
                                >
                                    <Check className="w-4 h-4 mr-2" />
                                    はい、緊急対応として登録
                                </button>

                                <button
                                    className="w-full flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-gray-400 rounded-md cursor-not-allowed text-sm font-medium transition-colors"
                                >
                                    いいえ、別の理由を記入する
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Fallback for other types
                        <GenericFixInput
                            expense={targetExpense}
                            onSave={(notes) => {
                                updateExpense(targetExpense.id, {
                                    description: `${targetExpense.description} (${notes})`,
                                    is_violation: false,
                                    match_status: 'matched',
                                    warning_message: undefined,
                                    status: 'fixed'
                                });
                            }}
                        />
                    )}
                </div>
            </GenUIContainer >
        </div >
    );
}

function GenUIContainer({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-lg border border-purple-200 overflow-hidden relative ring-4 ring-purple-50"
        >
            {/* Decorative Gradient Line */}
            <div className="h-1 w-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400" />
            {children}
        </motion.div>
    );
}

// Mock Candidates for the demo
const SUGGESTED_ATTENDEES = [
    { id: '1', name: '田中 誠 (営業部長)', type: 'internal' },
    { id: '2', name: '佐藤 健太 (Project A)', type: 'internal' },
    { id: '3', name: '鈴木 一郎 様 (Client X)', type: 'external' },
    { id: '4', name: '高橋 エリ 様 (Client X)', type: 'external' },
];

function AttendeeInput({ expense, onSave }: { expense: ExpenseItem; onSave: (list: string[]) => void }) {
    const [attendees, setAttendees] = useState<string[]>(expense.attendees || []);
    const [inputValue, setInputValue] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const addAttendee = (name: string) => {
        if (!attendees.includes(name)) {
            setAttendees([...attendees, name]);
        }
    };

    const handleManualAdd = () => {
        if (inputValue.trim()) {
            addAttendee(inputValue.trim());
            setInputValue('');
        }
    }

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(r => setTimeout(r, 600)); // Fake network delay
        onSave(attendees);
        // Component will unmount or update automatically via parent's useEffect
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <Users className="w-4 h-4 mr-1.5 text-gray-400" />
                    同席者リスト
                </label>

                {/* Chips for Selected Attendees */}
                <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
                    <AnimatePresence>
                        {attendees.map((name, idx) => (
                            <motion.span
                                key={name}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800 border border-purple-200"
                            >
                                {name}
                                <button
                                    onClick={() => setAttendees(attendees.filter(a => a !== name))}
                                    className="ml-2 hover:text-purple-900"
                                >
                                    <span className="sr-only">Remove</span>
                                    ×
                                </button>
                            </motion.span>
                        ))}
                    </AnimatePresence>
                    {attendees.length === 0 && (
                        <span className="text-gray-400 text-sm py-1 italic">未入力</span>
                    )}
                </div>

                {/* AI Suggestions */}
                <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-2 flex items-center">
                        <Sparkles className="w-3 h-3 mr-1 text-purple-500" />
                        AI提案（GoogleカレンダーおよびGmailより）:
                    </div>
                    <div className="space-y-2">
                        {/* Internal Candidates */}
                        <div className="flex flex-wrap gap-2">
                            {SUGGESTED_ATTENDEES.filter(c => c.type === 'internal').map(candidate => {
                                const isSelected = attendees.includes(candidate.name);
                                return (
                                    <button
                                        key={candidate.id}
                                        onClick={() => !isSelected && addAttendee(candidate.name)}
                                        disabled={isSelected}
                                        className={cn(
                                            "px-3 py-1.5 text-xs rounded-md border transition-all text-left",
                                            isSelected
                                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-default"
                                                : "bg-white border-purple-200 text-gray-700 hover:border-purple-400 hover:shadow-sm hover:text-purple-700"
                                        )}
                                    >
                                        {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                                        {candidate.name}
                                    </button>
                                )
                            })}
                        </div>
                        {/* External Candidates */}
                        <div className="flex flex-wrap gap-2">
                            {SUGGESTED_ATTENDEES.filter(c => c.type === 'external').map(candidate => {
                                const isSelected = attendees.includes(candidate.name);
                                return (
                                    <button
                                        key={candidate.id}
                                        onClick={() => !isSelected && addAttendee(candidate.name)}
                                        disabled={isSelected}
                                        className={cn(
                                            "px-3 py-1.5 text-xs rounded-md border transition-all text-left",
                                            isSelected
                                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-default"
                                                : "bg-white border-purple-200 text-gray-700 hover:border-purple-400 hover:shadow-sm hover:text-purple-700"
                                        )}
                                    >
                                        {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                                        {candidate.name}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Manual Input */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleManualAdd()}
                        placeholder="その他の同席者を入力..."
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                    <button
                        onClick={handleManualAdd}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none"
                    >
                        <UserPlus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="pt-3 border-t flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={attendees.length === 0 || isSaving}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {isSaving ? (
                        <>保存中...</>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            保存して次へ
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

function GenericFixInput({ expense, onSave }: { expense: ExpenseItem; onSave: (val: string) => void }) {
    const [note, setNote] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
                補足説明 / 修正内容
            </label>
            <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                className="w-full border rounded-md p-2 text-sm focus:ring-purple-500 outline-none"
                rows={3}
                placeholder="例: 休日出勤申請済み。プロジェクトAの緊急対応のため。"
            />
            <div className="flex justify-end pt-2">
                <button
                    onClick={async () => {
                        setIsSaving(true);
                        await new Promise(r => setTimeout(r, 600));
                        onSave(note);
                    }}
                    disabled={!note || isSaving}
                    className="px-4 py-2 bg-purple-600 text-white rounded text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
                >
                    {isSaving ? '保存中...' : '修正を完了'}
                </button>
            </div>
        </div>
    )
}

function FullDetailsToggle({ expense }: { expense: ExpenseItem }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mb-4 text-xs px-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center text-gray-500 hover:text-purple-600 transition-colors font-medium"
            >
                {isOpen ? <ChevronUp className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
                {isOpen ? '詳細情報を隠す' : '詳細情報を表示 (AI自動入力済み)'}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-2 grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded border border-gray-100">
                            <div>
                                <div className="text-gray-400 mb-0.5">Date</div>
                                <div className="font-mono text-gray-700">{expense.date}</div>
                            </div>
                            <div>
                                <div className="text-gray-400 mb-0.5">Merchant</div>
                                <div className="font-mono text-gray-700">{expense.merchant}</div>
                            </div>
                            <div>
                                <div className="text-gray-400 mb-0.5">Amount</div>
                                <div className="font-mono text-gray-700">¥{expense.amount.toLocaleString()}</div>
                            </div>
                            <div>
                                <div className="text-gray-400 mb-0.5">Currency</div>
                                <div className="font-mono text-gray-700">{expense.currency}</div>
                            </div>
                            <div>
                                <div className="text-gray-400 mb-0.5">Category</div>
                                <div className="font-mono text-gray-700">{expense.category}</div>
                            </div>
                            <div>
                                <div className="text-gray-400 mb-0.5">Payment</div>
                                <div className="font-mono text-gray-700">
                                    {(expense.evidence_sources?.includes('CreditCard') ? 'Corporate Card' : 'Pending')}
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-400 mb-0.5">Project Code</div>
                                <div className="font-mono text-gray-700">{expense.project_code || '-'}</div>
                            </div>
                            <div>
                                <div className="text-gray-400 mb-0.5">Cost Center</div>
                                <div className="font-mono text-gray-700">{expense.cost_center || '-'}</div>
                            </div>
                            <div>
                                <div className="text-gray-400 mb-0.5">Tax Amount</div>
                                <div className="font-mono text-gray-700">¥{(expense.tax || 0).toLocaleString()}</div>
                            </div>
                            <div>
                                <div className="text-gray-400 mb-0.5">Invoice #</div>
                                <div className="font-mono text-gray-700">{expense.invoice_num || 'N/A'}</div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
