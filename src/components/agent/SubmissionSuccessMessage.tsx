import React from 'react';
import { Bot, CheckCircle } from 'lucide-react';

export function SubmissionSuccessMessage() {
    return (
        <div className="flex items-start space-x-3 max-w-2xl animate-in slide-in-from-bottom-2 fade-in duration-500">
            {/* Agent Avatar */}
            <div className="w-9 h-9 rounded bg-[#2eb67d] flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-5 h-5 text-white" />
            </div>

            <div className="flex-1 space-y-1">
                <div className="flex items-baseline space-x-2">
                    <span className="font-bold text-gray-900">経費精算Bot</span>
                    <span className="text-xs text-gray-500">APP Now</span>
                </div>

                {/* Message Bubble content */}
                <div className="bg-white border text-sm rounded-lg shadow-sm overflow-hidden p-4">
                    <div className="flex items-center text-gray-900">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <span className="font-medium">経費申請が完了しました。</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
