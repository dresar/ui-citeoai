import React, { useState } from 'react';
import { X, Copy, Check, FileCode } from 'lucide-react';
import { MOCK_MAIN_GO_PREVIEW } from '../mockData';

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: string;
  lines: string;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  isOpen,
  onClose,
  file,
  lines,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(MOCK_MAIN_GO_PREVIEW);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const codeLines = MOCK_MAIN_GO_PREVIEW.split('\n');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="w-full max-w-2xl rounded-[4px] bg-[#18181c] border border-[#27272a] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#27272a] bg-[#121215] shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-[4px] bg-cyan-950/40 text-cyan-400 border border-cyan-800/40">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#f4f4f5]">{file}</span>
              <span className="text-[11px] font-mono text-cyan-400 ml-2">{lines}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-[4px] bg-[#1e1e24] hover:bg-[#27272a] text-[#a1a1aa] hover:text-[#f4f4f5] border border-[#27272a] transition-colors"
              title="Copy code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-[#71717a] hover:text-[#f4f4f5] hover:bg-[#1e1e24] rounded-[4px] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Code Content with Line Numbers */}
        <div className="flex-1 overflow-y-auto p-3 bg-[#09090c] text-xs font-mono text-[#f4f4f5] leading-relaxed select-text">
          <div className="table w-full">
            {codeLines.map((line, idx) => {
              const lineNum = 80 + idx;
              return (
                <div key={idx} className="table-row hover:bg-[#18181c]/50">
                  <div className="table-cell pr-4 text-right text-[#52525b] select-none w-10 text-[11px]">
                    {lineNum}
                  </div>
                  <div className="table-cell whitespace-pre text-[#d4d4d8] text-[11px]">
                    {line}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-[#121215] border-t border-[#27272a] flex items-center justify-between text-[11px] text-[#71717a] shrink-0 font-mono">
          <span>Go 1.24 Syntax Verified</span>
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-[4px] bg-[#1e1e24] text-[#a1a1aa] hover:text-[#f4f4f5] border border-[#27272a]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
