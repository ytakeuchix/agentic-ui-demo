'use client';

import React from 'react';
import { Bot, AlertCircle, CheckCircle, ArrowRight, FileText } from 'lucide-react';
import { useDemo } from '@/lib/DemoContext';
import { ExpenseItem } from '@/lib/types';
import { motion } from 'framer-motion';

import { CATEGORIES_JA } from '@/lib/constants';

export function AgentMessage() {
    const { expenses, setScenario } = useDemo();

    return (
        <div className="flex gap-3 group animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Bot Icon */}
            <div className="w-9 h-9 rounded bg-green-500 flex items-center justify-center text-white flex-shrink-0 mt-1 shadow-sm">
                <Bot size={20} />
            </div>

            <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-bold text-gray-900">経費精算エージェント</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-1 rounded border border-gray-200">アプリ</span>
                    <span className="text-xs text-gray-500">18:00</span>
                </div>

                {/* Message Body */}
                <div className="text-gray-800">
                    <p className="mb-3">本日の経費精算ドラフトを作成しました（{expenses.length}件）。<br />内容を確認してください。</p>

                    {/* Expense List Card */}
                    <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden max-w-2xl">
                        {expenses.map((expense, index) => (
                            <ExpenseRow key={expense.id} expense={expense} isLast={index === expenses.length - 1} />
                        ))}

                        {/* Footer Actions */}
                        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-between items-center">
                            <span className="text-xs text-gray-500">Agentic Workflow により動作中</span>
                            <button
                                onClick={() => setScenario('canvas')}
                                className="text-sm bg-black text-white px-3 py-1.5 rounded hover:opacity-80 transition-opacity flex items-center gap-1"
                            >
                                詳細確認・申請へ <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ExpenseRow({ expense, isLast }: { expense: ExpenseItem; isLast: boolean }) {
    const { setScenario } = useDemo();
    const isWarning = expense.status === 'pending_fix';

    return (
        <div className={`px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors ${!isLast ? 'border-b border-gray-100' : ''}`}>
            {/* Icon based on category */}
            <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 
          ${isWarning ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>
                {isWarning ? <AlertCircle size={16} /> : <FileText size={16} />}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-medium text-sm text-gray-900">{expense.merchant}</p>
                        <p className="text-xs text-gray-500">{expense.date} • {CATEGORIES_JA[expense.category]}</p>
                    </div>
                    <p className="font-mono text-sm font-medium">¥{expense.amount.toLocaleString()}</p>
                </div>

                {isWarning && (
                    <div className="mt-2 flex items-center justify-between bg-amber-50 p-2 rounded border border-amber-100">
                        <span className="text-xs text-amber-700 font-medium flex items-center gap-1">
                            <AlertCircle size={12} /> {expense.warning_message}
                        </span>
                        <button
                            onClick={() => setScenario('gen-ui')}
                            className="text-xs bg-white border border-amber-200 text-amber-700 px-2 py-1 rounded shadow-sm hover:bg-amber-50 font-medium"
                        >
                            修正する
                        </button>
                    </div>
                )}

                {expense.status === 'fixed' && (
                    <div className="mt-1 text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle size={12} /> 修正済み
                    </div>
                )}
            </div>
        </div>
    );
}
