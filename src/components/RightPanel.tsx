import React, { useState } from 'react';
import {
  FileText,
  Maximize2,
  PanelRightClose,
  X,
  Copy,
  Check,
  Terminal,
} from 'lucide-react';
import { RightPanelTab } from '../types';

interface RightPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab?: RightPanelTab | null;
  tabs: RightPanelTab[];
  onSelectTab: (tabId: string) => void;
  onCloseTab?: (tabId: string) => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  isOpen,
  onClose,
  activeTab,
  tabs,
  onSelectTab,
  onCloseTab,
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
      className={`bg-[#131317] border-l border-[#232328] flex flex-col h-full select-none shrink-0 transition-all duration-200 z-20 font-sans ${
        isExpanded
          ? 'fixed inset-y-0 right-0 w-full sm:w-[85vw] md:w-[70vw] shadow-2xl'
          : 'w-full md:w-[420px] lg:w-[480px] xl:w-[520px]'
      }`}
    >
      {/* Top Header Bar */}
      <div className="h-12 border-b border-[#232328] px-3 flex items-center justify-between bg-[#131317] shrink-0">
        {/* Left: Tab Pills */}
        <div className="flex items-center gap-1 min-w-0 flex-1 overflow-x-auto no-scrollbar py-1">
          {tabs.length === 0 ? (
            <div className="flex items-center gap-1.5 text-xs text-[#71717a] font-medium px-1">
              <FileText className="w-3.5 h-3.5" />
              <span>Inspector</span>
            </div>
          ) : (
            tabs.map((tab) => {
              const isActive = activeTab?.id === tab.id;
              return (
                <div
                  key={tab.id}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono transition-colors shrink-0 ${
                    isActive
                      ? 'bg-[#1e1e24] text-[#f4f4f5] border border-[#2b2b34]'
                      : 'text-[#8e8e98] hover:text-[#f4f4f5] hover:bg-[#18181d]'
                  }`}
                >
                  <button
                    onClick={() => onSelectTab(tab.id)}
                    className="truncate max-w-[140px] text-left"
                    title={tab.title}
                  >
                    {tab.title}
                  </button>
                  {onCloseTab && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloseTab(tab.id);
                      }}
                      className="p-0.5 hover:text-white rounded"
                    >
                      <X className="w-3 h-3 opacity-60 hover:opacity-100" />
                    </button>
                  )}
                </div>
              );
            })
          )}
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
            title="Close panel"
          >
            <PanelRightClose className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {!activeTab ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none bg-[#111114]">
          <div className="w-10 h-10 rounded-xl bg-[#18181d] border border-[#27272e] flex items-center justify-center mb-3">
            <Terminal className="w-5 h-5 text-[#71717a]" />
          </div>
          <p className="text-xs text-[#71717a] font-medium">
            Select a file or command to inspect
          </p>
        </div>
      ) : (
        <>
          {/* Subheader Title */}
          <div className="h-10 border-b border-[#232328] px-4 flex items-center justify-between bg-[#131317] shrink-0">
            <span className="text-xs font-semibold text-[#f4f4f5] truncate max-w-[280px]">
              {activeTab.taskTitle || activeTab.filePath || activeTab.title}
            </span>
            <div className="flex items-center gap-1.5">
              {(activeTab.fileContent || activeTab.taskLogs) && (
                <button
                  onClick={() =>
                    handleCopy(activeTab.fileContent || activeTab.taskLogs || '')
                  }
                  className="flex items-center gap-1 px-2 py-0.5 text-[11px] text-[#8e8e98] hover:text-[#f4f4f5] bg-[#1a1a20] hover:bg-[#22222a] border border-[#27272e] rounded transition-colors"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
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
                <div className="h-full flex items-center justify-center text-[#71717a] text-xs font-sans select-none">
                  No output recorded.
                </div>
              )
            ) : (
              /* File Code Viewer with Line Numbers */
              <div className="flex min-h-full">
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
        </>
      )}
    </aside>
  );
};
