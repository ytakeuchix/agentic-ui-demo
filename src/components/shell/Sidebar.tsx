import React from 'react';
import { Hash, MessageSquare, Bell, Search, Home, MoreHorizontal } from 'lucide-react';

export function Sidebar() {
    return (
        <div className="w-[260px] bg-[#3f0e40] flex flex-col h-full text-[#cfc3cf] flex-shrink-0">
            {/* Workspace Header */}
            <div className="h-12 border-b border-[#5d2c5d] flex items-center px-4 font-bold text-white hover:bg-[#350d36] cursor-pointer transition-colors">
                株式会社 Agentic <span className="ml-1 text-xs opacity-70">▼</span>
            </div>

            {/* Sections */}
            <div className="flex-1 overflow-y-auto py-2">
                <div className="px-4 py-1 flex items-center gap-2 hover:bg-[#350d36] cursor-pointer">
                    <Home size={16} /> <span className="text-sm">ホーム</span>
                </div>
                <div className="px-4 py-1 flex items-center gap-2 hover:bg-[#350d36] cursor-pointer">
                    <Bell size={16} /> <span className="text-sm">アクティビティ</span>
                </div>

                {/* Channels */}
                <div className="mt-6 mb-1 px-4 flex items-center justify-between group">
                    <span className="text-xs font-medium opacity-80 group-hover:opacity-100 transition-opacity">チャンネル</span>
                </div>

                <div className="flex flex-col gap-[2px]">
                    {['全体連絡', '雑談', 'アナウンス', 'プロジェクト'].map(channel => (
                        <div key={channel} className="px-4 py-1 flex items-center gap-2 hover:bg-[#350d36] cursor-pointer opacity-90 hover:opacity-100">
                            <Hash size={14} className="opacity-70" />
                            <span className="text-sm">{channel}</span>
                        </div>
                    ))}
                </div>

                {/* Apps */}
                <div className="mt-6 mb-1 px-4 flex items-center justify-between group">
                    <span className="text-xs font-medium opacity-80 group-hover:opacity-100 transition-opacity">アプリ</span>
                </div>
                <div className="flex flex-col gap-[2px]">
                    <div className={`px-4 py-1 flex items-center gap-2 bg-[#1164A3] text-white cursor-pointer`}>
                        <div className="w-3.5 h-3.5 rounded bg-green-400 border border-green-600"></div>
                        <span className="text-sm font-medium">経費精算エージェント</span>
                    </div>
                    <div className="px-4 py-1 flex items-center gap-2 hover:bg-[#350d36] cursor-pointer opacity-90">
                        <div className="w-3.5 h-3.5 rounded bg-gray-400"></div>
                        <span className="text-sm">カレンダーボット</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
