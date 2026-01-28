'use client';

import React from 'react';
import {
    Hash,
    Search,
    Bell,
    HelpCircle,
    MessageSquare,
    MoreHorizontal,
    Plus,
    ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function SlackShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-full bg-white overflow-hidden text-sm">
            {/* Sidebar */}
            <div className="w-[260px] bg-[#3F0E40] flex flex-col items-stretch text-[#cfc3cf]">
                {/* Workspace Header */}
                <div className="h-12 border-b border-[#5d2c5d] flex items-center px-4 hover:bg-[#350d36] cursor-pointer transition-colors">
                    <h1 className="font-bold text-white text-base truncate flex-1">Acme Corp</h1>
                    <ChevronDown className="w-4 h-4 ml-2" />
                </div>

                {/* Scrollable Area */}
                <div className="flex-1 overflow-y-auto py-3">
                    {/* Section: Channels */}
                    <div className="mb-6">
                        <div className="px-4 flex items-center justify-between group mb-1">
                            <span className="text-xs font-medium opacity-80 group-hover:opacity-100 transition-opacity">Channels</span>
                            <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 cursor-pointer" />
                        </div>
                        <ul>
                            <ChannelItem name="general" />
                            <ChannelItem name="random" />
                            <ChannelItem name="development" />
                            <ChannelItem name="accounting-bot" active />
                            <ChannelItem name="marketing" />
                        </ul>
                    </div>

                    {/* Section: Direct Messages */}
                    <div>
                        <div className="px-4 flex items-center justify-between group mb-1">
                            <span className="text-xs font-medium opacity-80 group-hover:opacity-100 transition-opacity">Direct messages</span>
                            <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 cursor-pointer" />
                        </div>
                        <ul className="space-y-0.5">
                            <DMItem name="Accounting Bot" online />
                            <DMItem name="Yuki Takeuchi" self online />
                            <DMItem name="Manager" />
                        </ul>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-white">
                {/* Header */}
                <header className="h-12 border-b flex items-center justify-between px-4 shrink-0">
                    <div className="flex-1 font-bold text-gray-900 flex items-center">
                        <Hash className="w-4 h-4 mr-1 text-gray-500" />
                        accounting-bot
                    </div>

                    {/* Search Bar (Mock) */}
                    <div className="flex-[2] max-w-[500px] mx-4">
                        <div className="bg-gray-100 border border-transparent hover:bg-white hover:border-gray-300 transition-all rounded-md h-7 flex items-center px-2 text-xs text-gray-500 w-full cursor-text">
                            <Search className="w-3.5 h-3.5 mr-2" />
                            Search Acme Corp
                        </div>
                    </div>

                    <div className="flex-1 flex justify-end items-center space-x-4 text-gray-500">
                        <HelpCircle className="w-5 h-5 cursor-pointer hover:text-gray-700" />
                    </div>
                </header>

                {/* Content Area (Chat Stream) */}
                <main className="flex-1 overflow-y-auto flex flex-col relative">
                    {children}
                </main>
            </div>
        </div>
    );
}

function ChannelItem({ name, active }: { name: string; active?: boolean }) {
    return (
        <li className={cn(
            "px-4 py-1 flex items-center cursor-pointer mb-0.5",
            active ? "bg-[#1164A3] text-white" : "hover:bg-[#350d36]"
        )}>
            <Hash className="w-3.5 h-3.5 mr-2 opacity-70" />
            <span className={cn("truncate", active ? "font-bold" : "")}>{name}</span>
        </li>
    );
}

function DMItem({ name, online, self }: { name: string; online?: boolean; self?: boolean }) {
    return (
        <li className="px-4 py-1 flex items-center cursor-pointer hover:bg-[#350d36] opacity-90 hover:opacity-100">
            <div className="relative w-3.5 h-3.5 mr-2 flex items-center justify-center">
                <div className={cn("w-2 h-2 rounded-full", online ? "bg-green-500" : "border border-gray-400")} />
            </div>
            <span className="truncate">{name} {self && <span className="opacity-70">(you)</span>}</span>
        </li>
    );
}
