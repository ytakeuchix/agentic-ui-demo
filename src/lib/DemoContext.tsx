'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DemoContextType, ExpenseItem } from '@/lib/types';

const DemoContext = createContext<DemoContextType | undefined>(undefined);

const INITIAL_EXPENSES: ExpenseItem[] = [
    // Case A: Salesforce Training (Auto-Approved)
    {
        id: 'exp_001',
        date: '2026-01-10',
        merchant: 'Salesforce Japan',
        amount: 88000,
        currency: 'JPY',
        tax: 8800,
        category: 'Education',
        cost_center: 'CC-DEV-001',
        project_code: 'PRJ-TRAINING',
        description: 'Salesforce管理者研修 (受講完了)',
        receipt_url: '/mock/receipt_sf.pdf',
        invoice_num: 'T9876543210123',
        // AI Analysis
        is_violation: false,
        status: 'approved', // Auto-approved
        evidence_sources: ['Receipt', 'CreditCard', 'ApprovalFlow'], // Pre-approval flow linked
        confidence_score: 0.99,
        match_status: 'matched',
        ai_reasoning: '事前申請された研修受講と金額・内容が一致しています。'
    },
    // Case B: Steakhouse (Attendee Missing)
    {
        id: 'exp_002',
        date: '2026-01-20',
        merchant: 'ステーキハウス銀座',
        amount: 50000,
        currency: 'JPY',
        tax: 5000,
        category: 'Meals',
        cost_center: '営業第1部',
        project_code: 'PRJ-A',
        description: 'クライアントX様との会食',
        attendees: [], // Missing
        invoice_num: 'T1234567890123',
        // AI Analysis
        is_violation: false, // Not a strict violation yet, but needs input
        warning_message: '同席者情報が不足しています (交際費)',
        status: 'pending_fix',
        evidence_sources: ['Receipt', 'CreditCard'],
        confidence_score: 0.85,
        match_status: 'manual_required',
        ai_reasoning: '領収書から金額・日付を抽出しましたが、同席者情報が不足しています。'
    },
    // Case C: Uber (Inference Confirmation)
    {
        id: 'exp_003',
        date: '2026-01-24', // Saturday
        merchant: 'Uber交通',
        amount: 4200,
        currency: 'JPY',
        tax: 420,
        category: 'Travel',
        cost_center: '営業第1部',
        project_code: 'PRJ-A',
        description: 'プロジェクトAの障害対応（要確認）',
        invoice_num: 'T9876543210987',
        // AI Analysis
        is_violation: true,
        warning_message: '休日の利用が検出されました。事前申請との突き合わせが必要です。',
        status: 'pending_fix',
        evidence_sources: ['Receipt', 'CreditCard', 'Slack'],
        confidence_score: 0.75,
        match_status: 'mismatch',
        ai_reasoning: 'カレンダーに予定はありませんが、Slackでの緊急対応連絡と休日出勤申請が確認されました。'
    },
    // Case D: Overseas Trip (Canvas Verification)
    {
        id: 'exp_004',
        date: '2026-01-15',
        merchant: 'Uber *Trip',
        amount: 350000,
        currency: 'JPY',
        tax: 0,
        category: 'Travel',
        cost_center: '開発部',
        project_code: 'PRJ-GLOBAL',
        description: 'サンフランシスコ出張: 航空券・宿泊費他',
        invoice_num: 'INV-US-001',
        // AI Analysis
        is_violation: false,
        warning_message: '出張計画ルートとの照合推奨',
        status: 'pending_fix',
        evidence_sources: ['Receipt', 'CreditCard', 'TravelItinerary', 'Maps'],
        confidence_score: 0.82,
        match_status: 'mismatch', // Trigger Canvas
        ai_reasoning: '出張旅程に含まれる日時ですが、決済場所の確認を推奨します。'
    }
];

export function DemoProvider({ children }: { children: ReactNode }) {
    const [currentScenario, setScenario] = useState<DemoContextType['currentScenario']>('idle');
    const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES);
    const [focusedExpenseId, setFocusedExpenseId] = useState<string | null>(null);

    const updateExpense = (id: string, updates: Partial<ExpenseItem>) => {
        setExpenses(prev => prev.map(exp => exp.id === id ? { ...exp, ...updates } : exp));
    };

    return (
        <DemoContext.Provider value={{ currentScenario, setScenario, expenses, updateExpense, focusedExpenseId, setFocusedExpenseId }}>
            {children}
        </DemoContext.Provider>
    );
}

export function useDemo() {
    const context = useContext(DemoContext);
    if (!context) {
        throw new Error('useDemo must be used within a DemoProvider');
    }
    return context;
}
