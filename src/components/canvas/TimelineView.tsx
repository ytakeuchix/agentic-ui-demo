'use client';

import React from 'react';
import { ExpenseItem } from '@/lib/types';
import { motion } from 'framer-motion';
import { Plane, Hotel, Car, Utensils, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming utils exists, or use local clsx if not

// Mock Itinerary Data (In a real app, this would come from an API)
const ITINERARY_PLAN = {
    start: '2026-01-20T00:00:00',
    end: '2026-01-26T23:59:59',
    flightOut: { start: '2026-01-20T10:00:00', end: '2026-01-20T23:00:00' }, // NRT -> SFO
    hotelStay: { start: '2026-01-21T15:00:00', end: '2026-01-25T11:00:00' }, // Hotel Check-in/out
    flightIn: { start: '2026-01-26T11:00:00', end: '2026-01-27T15:00:00' }  // SFO -> NRT
};

interface TimelineViewProps {
    expenses: ExpenseItem[];
    highlightId?: string;
    onSelect?: (id: string) => void;
}

export function TimelineView({ expenses, highlightId, onSelect }: TimelineViewProps) {
    // Fixed scale calculation
    const startTime = new Date(ITINERARY_PLAN.start).getTime();
    const endTime = new Date(ITINERARY_PLAN.end).getTime();
    const totalDuration = endTime - startTime;

    const getPosition = (dateStr: string) => {
        const time = new Date(dateStr).getTime();
        const percent = ((time - startTime) / totalDuration) * 100;
        return Math.max(0, Math.min(100, percent));
    };

    return (
        <div className="w-full h-full bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col p-4 relative">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Travel Itinerary & Activity Log (San Francisco)
            </h3>

            <div className="flex-1 relative mt-2">
                {/* Background Grid / Days */}
                <div className="absolute inset-0 flex border-t border-gray-100">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className="flex-1 border-r border-gray-50 relative group">
                            <span className="absolute -top-4 left-1 text-[10px] text-gray-400 font-mono">
                                1/{20 + i}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Layer 1: Itinerary Plans */}
                <div className="absolute top-4 left-0 w-full h-8">
                    {/* Flight Out */}
                    <div
                        className="absolute h-6 bg-blue-100 rounded-md flex items-center justify-center text-[10px] text-blue-700 font-bold border border-blue-200"
                        style={{
                            left: `${getPosition(ITINERARY_PLAN.flightOut.start)}%`,
                            width: `${getPosition(ITINERARY_PLAN.flightOut.end) - getPosition(ITINERARY_PLAN.flightOut.start)}%`
                        }}
                    >
                        <Plane size={12} className="mr-1" /> Flight
                    </div>
                    {/* Hotel Stay */}
                    <div
                        className="absolute h-6 bg-indigo-50 rounded-md flex items-center justify-center text-[10px] text-indigo-700 font-bold border border-indigo-200"
                        style={{
                            left: `${getPosition(ITINERARY_PLAN.hotelStay.start)}%`,
                            width: `${getPosition(ITINERARY_PLAN.hotelStay.end) - getPosition(ITINERARY_PLAN.hotelStay.start)}%`
                        }}
                    >
                        <Hotel size={12} className="mr-1" /> Hotel Stay
                    </div>
                </div>

                {/* Layer 2: Activity Dots (Expenses) */}
                <div className="absolute top-12 left-0 w-full h-12 flex items-center">
                    <div className="absolute w-full h-0.5 bg-gray-100 top-1/2 -translate-y-1/2" />

                    {expenses.map(exp => {
                        if (!exp.timestamp) return null;
                        const pos = getPosition(exp.timestamp);
                        const isSelected = exp.id === highlightId;
                        const isWarning = exp.itinerary_match === 'warning';

                        let Icon = AlertCircle;
                        if (exp.category === 'Travel') Icon = exp.merchant.includes('Uber') ? Car : Plane;
                        if (exp.category === 'Accommodation') Icon = Hotel;
                        if (exp.category === 'Meals') Icon = Utensils;

                        return (
                            <div
                                key={exp.id}
                                onClick={() => onSelect?.(exp.id)}
                                className={cn(
                                    "absolute top-1/2 -translate-y-1/2 -ml-3 transition-all duration-300 z-10 flex flex-col items-center gap-1 cursor-pointer",
                                    isSelected ? "z-20 scale-125" : "hover:scale-110"
                                )}
                                style={{ left: `${pos}%` }}
                            >
                                <div className={cn(
                                    "w-7 h-7 rounded-full flex items-center justify-center shadow-sm border-2 backdrop-blur-sm",
                                    isWarning
                                        ? "bg-amber-50 border-amber-500 text-amber-600"
                                        : isSelected
                                            ? "bg-blue-600 border-blue-600 text-white"
                                            : "bg-white border-white text-gray-500 hover:border-blue-300"
                                )}>
                                    <Icon size={14} />
                                </div>
                                {isSelected && (
                                    <div className="whitespace-nowrap text-[10px] font-bold bg-gray-900 text-white px-1.5 py-0.5 rounded shadow-lg absolute top-8">
                                        {exp.merchant}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
