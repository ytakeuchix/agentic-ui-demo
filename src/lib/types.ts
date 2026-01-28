export type ExpenseCategory = 'Travel' | 'Meals' | 'Supplies' | 'Accommodation' | 'Software' | 'Education' | 'Other';

export interface ExpenseItem {
    id: string;
    date: string;
    merchant: string;
    amount: number;
    currency: string;
    tax: number;
    category: ExpenseCategory;
    cost_center: string;
    project_code: string;
    description: string;
    attendees?: string[]; // For Meals
    receipt_url?: string;
    invoice_num?: string; // T-number for Japan Qualified Invoice

    // Policy Check Status
    is_violation: boolean;
    warning_message?: string;

    // Demo State
    status: 'draft' | 'pending_fix' | 'fixed' | 'approved';

    // AI & Evidence (New Scenarios)
    evidence_sources: string[]; // e.g. ['Receipt', 'GCalendar', 'FlightAPI']
    confidence_score: number;   // 0.0 - 1.0
    match_status: 'matched' | 'mismatch' | 'manual_required';
    ai_reasoning?: string;       // Explanation of the inference
}

export interface DemoContextType {
    currentScenario: 'idle' | 'notification' | 'gen-ui' | 'canvas' | 'done';
    setScenario: (scenario: 'idle' | 'notification' | 'gen-ui' | 'canvas' | 'done') => void;
    expenses: ExpenseItem[];
    updateExpense: (id: string, updates: Partial<ExpenseItem>) => void;
    focusedExpenseId: string | null;
    setFocusedExpenseId: (id: string | null) => void;
}
