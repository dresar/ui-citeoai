import React, { useState } from 'react';
import {
  FileText,
  FilePlus,
  Maximize2,
  PanelRightClose,
  MessageSquare,
  X,
  Menu,
  Copy,
  Check,
  Terminal,
} from 'lucide-react';
import { RightPanelTab } from '../types';

interface RightPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: RightPanelTab;
  tabs: RightPanelTab[];
  onSelectTab: (tabId: string) => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  isOpen,
  onClose,
  activeTab,
  tabs,
  onSelectTab,
}) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <aside
      className={`bg-[#131317] border-l border-[#232328] flex flex-col h-full select-none shrink-0 transition-all duration-200 z-20 ${
        isExpanded
          ? 'fixed inset-y-0 right-0 w-full sm:w-[85vw] md:w-[70vw] shadow-2xl'
          : 'w-full md:w-[420px] lg:w-[480px] xl:w-[520px]'
      }`}
    >
      {/* Top Header Bar */}
      <div className="h-12 border-b border-[#232328] px-3 flex items-center justify-between bg-[#131317] shrink-0">
        {/* Left Icons & Tabs */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-x-auto no-scrollbar py-1">
          <button
            className="p-1 text-[#8e8e98] hover:text-[#f4f4f5] hover:bg-[#1c1c22] rounded transition-colors shrink-0"
            title="Files"
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            className="p-1 text-[#8e8e98] hover:text-[#f4f4f5] hover:bg-[#1c1c22] rounded transition-colors shrink-0 mr-1"
            title="New File"
          >
            <FilePlus className="w-4 h-4" />
          </button>

          {/* Tab Pills */}
          <div className="flex items-center gap-1 min-w-0 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`px-3 py-1 rounded-md text-xs font-mono transition-colors truncate max-w-[200px] shrink-0 ${
                    isActive
                      ? 'bg-[#1e1e24] text-[#f4f4f5] border border-[#2b2b34]'
                      : 'text-[#8e8e98] hover:text-[#f4f4f5] hover:bg-[#18181d]'
                  }`}
                  title={tab.title}
                >
                  {tab.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5 shrink-0 pl-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-[#8e8e98] hover:text-[#f4f4f5] hover:bg-[#1c1c22] rounded transition-colors"
            title={isExpanded ? 'Restore' : 'Expand panel'}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 text-[#8e8e98] hover:text-[#f4f4f5] hover:bg-[#1c1c22] rounded transition-colors"
            title="Split view"
          >
            <PanelRightClose className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 text-[#8e8e98] hover:text-[#f4f4f5] hover:bg-[#1c1c22] rounded transition-colors"
            title="Close panel"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Red Ring User Avatar */}
          <div className="w-6 h-6 rounded-full p-[1px] bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 shadow-sm ml-1">
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

      {/* Subheader Title */}
      <div className="h-10 border-b border-[#232328] px-4 flex items-center justify-between bg-[#131317] shrink-0">
        <span className="text-xs font-semibold text-[#f4f4f5]">
          {activeTab.taskTitle || activeTab.filePath || 'Background Task Output'}
        </span>
        <div className="flex items-center gap-1.5">
          {activeTab.fileContent && (
            <button
              onClick={() => handleCopy(activeTab.fileContent || '')}
              className="flex items-center gap-1 px-2 py-0.5 text-[11px] text-[#8e8e98] hover:text-[#f4f4f5] bg-[#1a1a20] hover:bg-[#22222a] border border-[#27272e] rounded transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          )}
          <button className="p-1 text-[#8e8e98] hover:text-[#f4f4f5] rounded transition-colors">
            <Menu className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body: Task Output or File Viewer */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-[#d4d4d8] bg-[#111114]">
        {activeTab.type === 'task' ? (
          activeTab.taskLogs ? (
            <div className="space-y-1 whitespace-pre-wrap leading-relaxed text-[#a1a1aa] selection:bg-[#27272e]">
              {activeTab.taskLogs}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-[#71717a] text-sm font-sans select-none">
              Task not found
            </div>
          )
        ) : (
          /* File Code Viewer with Line Numbers */
          <div className="flex">
            <div className="select-none text-right pr-4 text-[#52525b] border-r border-[#232328] space-y-1">
              {(activeTab.fileContent || '').split('\n').map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <div className="pl-4 whitespace-pre overflow-x-auto space-y-1 text-[#e4e4e7] flex-1">
              {(activeTab.fileContent || '').split('\n').map((line, i) => (
                <div key={i}>{line || ' '}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
