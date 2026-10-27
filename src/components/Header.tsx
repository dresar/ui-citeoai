import React, { useState } from 'react';
import { Settings, RotateCw, MessageSquare, ChevronDown, Check, Wifi, AlertCircle } from 'lucide-react';
import { ConnectionStatus } from '../services/websocket';

interface HeaderProps {
  status: ConnectionStatus;
  onRefresh: () => void;
  onOpenSettings: () => void;
  onToggleChat?: () => void;
  inChatView?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  status,
  onRefresh,
  onOpenSettings,
  onToggleChat,
  inChatView,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <header className="w-full bg-[#0b0b0e] border-b border-[#27272a] px-3.5 py-2.5 flex items-center justify-between select-none z-20 sticky top-0">
      {/* Left: Logo & Profile Badge */}
      <div className="flex items-center gap-2.5">
        {/* Stylized A / CITEOAI Logo */}
        <div className="flex items-center justify-center w-7 h-7 rounded-[4px] bg-gradient-to-tr from-cyan-600 to-blue-500 shadow-sm shadow-cyan-900/30">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3 L3 20 L7 20 L12 9 L17 20 L21 20 Z" fill="currentColor" fillOpacity="0.15" />
            <path d="M8 15 L16 15" stroke="currentColor" strokeWidth="2.5" />
          </svg>
        </div>

        {/* Profile Pill Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-[4px] bg-[#18181c] hover:bg-[#1e1e24] border border-[#27272a] transition-colors"
            title="Profile"
          >
            {/* Status dot */}
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                status === 'connected' ? 'bg-emerald-400' : status === 'simulated' ? 'bg-amber-400' : 'bg-zinc-500'
              }`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                status === 'connected' ? 'bg-emerald-500' : status === 'simulated' ? 'bg-amber-500' : 'bg-zinc-500'
              }`} />
            </span>

            <span className="text-xs font-mono font-medium text-[#f4f4f5] max-w-[130px] sm:max-w-none truncate">
              agy01-eka.ckp16...
            </span>

            <ChevronDown className={`w-3.5 h-3.5 text-[#a1a1aa] transition-transform duration-150 ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Profile Dropdown Menu */}
          {profileOpen && (
            <div className="absolute left-0 mt-1.5 w-60 rounded-[4px] bg-[#18181c] border border-[#27272a] shadow-xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#27272a]">
                <span className="text-xs font-semibold text-[#f4f4f5]">Cluster Node</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-[4px] ${
                  status === 'connected'
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                    : 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                }`}>
                  {status === 'connected' ? 'Connected' : 'Simulated'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-[#a1a1aa]">
                <div className="flex justify-between">
                  <span>Role:</span>
                  <span className="text-[#f4f4f5] font-mono">AGY04 Backend</span>
                </div>
                <div className="flex justify-between">
                  <span>Device:</span>
                  <span className="text-[#f4f4f5] font-mono">Xeon E5 (2 vCPU)</span>
                </div>
                <div className="flex justify-between">
                  <span>Memory:</span>
                  <span className="text-[#f4f4f5] font-mono">4GB Cgroup</span>
                </div>
                <div className="flex justify-between">
                  <span>Tunnel:</span>
                  <span className="text-emerald-400 font-mono">citeoai.agentai.my.id</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-[#27272a] flex justify-end">
                <button
                  onClick={() => setProfileOpen(false)}
                  className="text-xs px-2.5 py-1 bg-[#1e1e24] hover:bg-[#27272a] text-[#f4f4f5] rounded-[4px] border border-[#27272a]"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions & User Avatar */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#18181c] rounded-[4px] transition-colors"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Refresh Button */}
        <button
          onClick={handleRefreshClick}
          className="p-1.5 text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#18181c] rounded-[4px] transition-colors"
          title="Refresh"
        >
          <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
        </button>

        {/* Chat view shortcut */}
        {onToggleChat && (
          <button
            onClick={onToggleChat}
            className={`p-1.5 rounded-[4px] transition-colors ${
              inChatView
                ? 'text-cyan-400 bg-[#18181c] border border-cyan-800/40'
                : 'text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#18181c]'
            }`}
            title="Chat"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        )}

        {/* User Avatar with circular ring matching reference image */}
        <div className="relative ml-1">
          <div className="w-7 h-7 rounded-full p-[1.5px] bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 shadow-sm">
            <div className="w-full h-full rounded-full bg-[#18181c] overflow-hidden flex items-center justify-center">
              <svg className="w-full h-full text-zinc-300" viewBox="0 0 32 32" fill="currentColor">
                <rect width="32" height="32" fill="#2d1519" />
                <circle cx="16" cy="11" r="5" fill="#fbcfe8" />
                <path d="M7 26 C7 20, 11 18, 16 18 C21 18, 25 20, 25 26 Z" fill="#991b1b" />
                <polygon points="16,19 14,24 18,24" fill="#ffffff" />
                <polygon points="16,21 15,26 17,26" fill="#dc2626" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
