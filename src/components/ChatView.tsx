import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  MoreVertical,
  Code2,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  ArrowDown,
  Terminal,
  FileCode,
  Brain,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Session, ChatMessage, ExecutionStep } from '../types';

interface ChatViewProps {
  session: Session;
  onBack: () => void;
  onViewFile: (file: string, lines: string) => void;
  onClearSession?: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  session,
  onBack,
  onViewFile,
  onClearSession,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    step_4: true, // Ran test tools execution package is expanded by default
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleAccordion = (id: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 100);
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [session.messages]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b0b0e] overflow-hidden relative">
      {/* Chat Header */}
      <div className="bg-[#0b0b0e] border-b border-[#27272a] px-3 py-2 flex items-center justify-between select-none z-10 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Back button */}
          <button
            onClick={onBack}
            className="p-1 text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#18181c] rounded-[4px] transition-colors"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Session Title */}
          <div className="flex flex-col min-w-0">
            <h2 className="text-sm font-medium text-[#f4f4f5] truncate max-w-[200px] sm:max-w-md">
              {session.title}
            </h2>
          </div>
        </div>

        {/* Right Icons: Options, Code, Chat, Avatar */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#18181c] rounded-[4px] transition-colors"
              title="Options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1.5 w-44 rounded-[4px] bg-[#18181c] border border-[#27272a] shadow-xl py-1 z-50">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    if (onClearSession) onClearSession();
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-rose-400 hover:bg-[#27272a]"
                >
                  Clear Chat
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    copyToClipboard(JSON.stringify(session, null, 2), 'export');
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#27272a]"
                >
                  Export JSON
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => onViewFile('main.go', '#L80-140')}
            className="p-1.5 text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#18181c] rounded-[4px] transition-colors"
            title="Code"
          >
            <Code2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => {}}
            className="p-1.5 text-cyan-400 bg-[#18181c] rounded-[4px] border border-cyan-800/30"
            title="Chat"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* User Avatar with red border ring */}
          <div className="w-6 h-6 rounded-full p-[1.5px] bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 shadow-sm ml-1">
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

      {/* Messages Stream Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-3.5 py-4 space-y-4 pb-36"
      >
        {session.messages.map((msg) => (
          <div key={msg.id} className="space-y-3">
            {/* User Message */}
            {msg.role === 'user' && (
              <div className="rounded-[4px] bg-[#1e1e24] border border-[#27272a] p-3 text-sm text-[#f4f4f5] leading-relaxed shadow-sm">
                {msg.content}
              </div>
            )}

            {/* Assistant Execution Blocks */}
            {msg.steps && msg.steps.length > 0 && (
              <div className="space-y-2 py-1">
                {msg.steps.map((step) => {
                  const isOpen = !!openAccordions[step.id];

                  // Step 2: Analyzed main.go #L80-140 (Interactive Row with Go icon)
                  if (step.type === 'file_analysis') {
                    return (
                      <div
                        key={step.id}
                        onClick={() => onViewFile(step.file || 'main.go', step.lines || '#L80-140')}
                        className="flex items-center gap-2 text-xs text-[#a1a1aa] hover:text-[#f4f4f5] cursor-pointer py-1 px-1 rounded-[4px] hover:bg-[#18181c] transition-colors"
                      >
                        <span className="font-normal">Analyzed</span>
                        {/* Go logo cyan icon */}
                        <span className="inline-flex items-center gap-1 font-mono text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded-[4px] border border-cyan-800/40">
                          <svg className="w-3 h-3 text-cyan-400 inline" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="12" r="10" fill="#00ADD8" />
                            <text x="12" y="16" fontSize="11" fontWeight="bold" fill="#ffffff" textAnchor="middle">GO</text>
                          </svg>
                          <span>{step.file || 'main.go'} {step.lines || '#L80-140'}</span>
                        </span>
                      </div>
                    );
                  }

                  // Step 3: Thought disclosure
                  if (step.type === 'thought') {
                    return (
                      <div key={step.id} className="text-xs">
                        <button
                          onClick={() => toggleAccordion(step.id)}
                          className="flex items-center gap-1.5 text-[#a1a1aa] hover:text-[#f4f4f5] py-1 transition-colors group"
                        >
                          <span className="font-medium text-[#a1a1aa] group-hover:text-[#f4f4f5]">
                            {step.title}
                          </span>
                          {isOpen ? (
                            <ChevronDown className="w-3 h-3 text-[#71717a]" />
                          ) : (
                            <ChevronRight className="w-3 h-3 text-[#71717a]" />
                          )}
                        </button>

                        {isOpen && step.thoughtContent && (
                          <div className="mt-1 pl-3 border-l-2 border-[#27272a] text-[#a1a1aa] text-[11px] font-mono leading-relaxed bg-[#121215] p-2.5 rounded-r-[4px]">
                            <pre className="whitespace-pre-wrap">{step.thoughtContent}</pre>
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Step 4: Terminal Command Block
                  if (step.type === 'terminal') {
                    return (
                      <div key={step.id} className="space-y-1.5 text-xs">
                        <button
                          onClick={() => toggleAccordion(step.id)}
                          className="flex items-center gap-1.5 text-[#a1a1aa] hover:text-[#f4f4f5] py-1 transition-colors"
                        >
                          <span className="font-medium text-[#a1a1aa]">{step.title}</span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 text-[#71717a] transition-transform duration-150 ${
                              isOpen ? '' : '-rotate-90'
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <div className="terminal-box bg-[#09090c] border border-[#27272a] rounded-[4px] overflow-hidden text-xs font-mono shadow-inner">
                            {/* Terminal Top Command Bar */}
                            <div className="flex items-center justify-between px-3 py-2 bg-[#121216] border-b border-[#27272a]/70">
                              <div className="flex items-center gap-1.5 min-w-0 pr-2">
                                <span className="text-[#71717a] shrink-0 font-mono">
                                  {step.workdir || '.../home/CITEOAI $'}
                                </span>
                                <span className="text-amber-400 font-semibold shrink-0">cd</span>
                                <span className="text-[#a1a1aa] truncate font-mono">
                                  {step.command?.replace(/^cd\s+/, '') || ''}
                                </span>
                              </div>

                              <button
                                onClick={() => copyToClipboard(step.command || '', step.id)}
                                className="p-1 text-[#71717a] hover:text-[#f4f4f5] hover:bg-[#1e1e24] rounded-[4px] transition-colors shrink-0"
                                title="Copy"
                              >
                                {copiedId === step.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>

                            {/* Terminal Output Log Area */}
                            <div className="p-3 text-[11px] leading-relaxed text-[#a1a1aa] max-h-60 overflow-y-auto select-text font-mono">
                              <pre className="whitespace-pre-wrap">
                                {step.output?.split('\n').map((line, idx) => {
                                  if (line.includes('--- PASS')) {
                                    return (
                                      <span key={idx} className="text-emerald-400 font-medium block">
                                        {line}
                                      </span>
                                    );
                                  }
                                  if (line.includes('=== RUN')) {
                                    return (
                                      <span key={idx} className="text-[#71717a] block">
                                        {line}
                                      </span>
                                    );
                                  }
                                  return <span key={idx} className="block">{line}</span>;
                                })}
                              </pre>
                            </div>

                            {/* Terminal Footer status */}
                            <div className="px-3 py-1 bg-[#121216]/60 border-t border-[#27272a]/50 flex items-center justify-between text-[10px] text-[#71717a]">
                              <span className="text-emerald-400 font-semibold font-mono">Exit 0</span>
                              <span className="font-mono">Execution OK</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Default / Generic Step (e.g. Explored file, ran commands)
                  return (
                    <div key={step.id} className="text-xs">
                      <button
                        onClick={() => toggleAccordion(step.id)}
                        className="flex items-center gap-1.5 text-[#a1a1aa] hover:text-[#f4f4f5] py-1 transition-colors"
                      >
                        <span className="font-medium text-[#a1a1aa]">{step.title}</span>
                        {isOpen ? (
                          <ChevronDown className="w-3 h-3 text-[#71717a]" />
                        ) : (
                          <ChevronRight className="w-3 h-3 text-[#71717a]" />
                        )}
                      </button>

                      {isOpen && step.subtitle && (
                        <div className="mt-1 pl-3 text-[11px] text-[#71717a] font-mono">
                          {step.subtitle}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Assistant Final Markdown Message */}
            {msg.role === 'assistant' && msg.content && (
              <div className="rounded-[4px] bg-[#18181c] border border-[#27272a] p-4 text-xs sm:text-sm text-[#f4f4f5] shadow-sm select-text">
                <div className="prose prose-invert max-w-none prose-sm prose-p:leading-relaxed prose-headings:text-[#f4f4f5] prose-headings:font-semibold prose-code:font-mono prose-code:text-cyan-300 prose-code:bg-[#121215] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-[4px]">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Floating Scroll to Bottom Button */}
      {showScrollBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-28 right-4 z-30 p-2 rounded-full bg-[#1e1e24] hover:bg-[#27272a] text-[#f4f4f5] border border-[#27272a] shadow-lg transition-transform hover:scale-105"
          title="Scroll down"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
