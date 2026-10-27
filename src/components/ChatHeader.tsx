import React from 'react';
import { PanelLeft, PanelRight, Maximize2, RefreshCw } from 'lucide-react';

interface ChatHeaderProps {
  projectName: string;
  sessionTitle: string;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isRightPanelOpen: boolean;
  onToggleRightPanel: () => void;
  onUpdateClick?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  projectName,
  sessionTitle,
  isSidebarOpen,
  onToggleSidebar,
  isRightPanelOpen,
  onToggleRightPanel,
  onUpdateClick,
}) => {
  return (
    <header className="h-12 w-full bg-[#0e0e11] border-b border-[#232328] px-3 sm:px-4 flex items-center justify-between select-none z-10 shrink-0">
      {/* Left: Sidebar toggle & Breadcrumb */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 text-[#8e8e98] hover:text-[#f4f4f5] hover:bg-[#1a1a20] rounded-md transition-colors shrink-0"
          title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs sm:text-sm truncate">
          <span className="text-[#8e8e98] font-medium shrink-0">{projectName}</span>
          <span className="text-[#3f3f46]">/</span>
          <span className="text-[#f4f4f5] font-medium truncate">{sessionTitle}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Blue Update Available Badge */}
        <button
          onClick={onUpdateClick}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-medium shadow-sm transition-all"
        >
          <span>Update Available</span>
          <RefreshCw className="w-3 h-3 text-white animate-spin-slow" />
        </button>

        {/* Toggle Right Panel */}
        <button
          onClick={onToggleRightPanel}
          className={`p-1.5 rounded-md transition-colors ${
            isRightPanelOpen
              ? 'text-white bg-[#1e1e24]'
              : 'text-[#8e8e98] hover:text-[#f4f4f5] hover:bg-[#1a1a20]'
          }`}
          title="Toggle side panel"
        >
          <PanelRight className="w-4 h-4" />
        </button>

        {/* Maximize */}
        <button
          className="p-1.5 text-[#8e8e98] hover:text-[#f4f4f5] hover:bg-[#1a1a20] rounded-md transition-colors hidden sm:block"
          title="Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* User Avatar with Circular Red Border Ring */}
        <div className="relative pl-1">
          <div className="w-7 h-7 rounded-full p-[1.5px] bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 shadow-sm cursor-pointer hover:scale-105 transition-transform">
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
