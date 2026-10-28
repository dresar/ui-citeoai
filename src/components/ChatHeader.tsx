import React from 'react';
import { PanelLeft, PanelRight, Maximize2 } from 'lucide-react';

interface ChatHeaderProps {
  projectName: string;
  sessionTitle: string;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isRightPanelOpen: boolean;
  onToggleRightPanel: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  projectName,
  sessionTitle,
  isSidebarOpen,
  onToggleSidebar,
  isRightPanelOpen,
  onToggleRightPanel,
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
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch(() => {});
            } else {
              document.exitFullscreen().catch(() => {});
            }
          }}
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
