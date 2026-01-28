'use client';

import React from 'react';
import { useDemo } from '@/lib/DemoContext';
import { Play, RotateCcw, Monitor, MessageSquare, Layout } from 'lucide-react';

export function SimulationControl() {
    const { currentScenario, setScenario } = useDemo();

    return (
        <div className="fixed bottom-6 right-6 z-50 bg-white/90 backdrop-blur shadow-2xl rounded-lg p-4 border border-gray-200 w-[240px]">
            <div className="mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-b pb-1">
                Demo Controller
            </div>

            <div className="space-y-2">
                <StatusIndicator status={currentScenario} />

                <div className="grid grid-cols-1 gap-2 mt-4">
                    <button
                        onClick={() => setScenario('idle')}
                        className="flex items-center px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    >
                        <RotateCcw className="w-3.5 h-3.5 mr-2" />
                        Reset (Idle)
                    </button>

                    <button
                        onClick={() => setScenario('notification')}
                        className="flex items-center px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                    >
                        <MessageSquare className="w-3.5 h-3.5 mr-2" />
                        1. ZeroUI (Notification)
                    </button>

                    <button
                        disabled={currentScenario === 'idle'}
                        onClick={() => setScenario('gen-ui')}
                        className="flex items-center px-3 py-2 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 rounded transition-colors disabled:opacity-50"
                    >
                        <Monitor className="w-3.5 h-3.5 mr-2" />
                        2. GenUI (Correction)
                    </button>

                    <button
                        disabled={currentScenario === 'idle'}
                        onClick={() => setScenario('canvas')}
                        className="flex items-center px-3 py-2 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded transition-colors disabled:opacity-50"
                    >
                        <Layout className="w-3.5 h-3.5 mr-2" />
                        3. Canvas (Detail)
                    </button>
                </div>
            </div>
        </div>
    );
}

function StatusIndicator({ status }: { status: string }) {
    return (
        <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Current Phase:</span>
            <span className="font-mono bg-gray-800 text-white px-1.5 py-0.5 rounded text-[10px]">
                {status}
            </span>
        </div>
    );
}
