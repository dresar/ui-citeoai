import React, { useRef, useEffect, useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  ArrowDown,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Terminal,
  Sparkles,
  Cpu,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Session } from '../types';

interface ChatViewProps {
  session: Session;
  onOpenFile: (filePath: string) => void;
  onOpenTask: (taskTitle: string, taskLogs: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  session,
  onOpenFile,
  onOpenTask,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [expandedThoughts, setExpandedThoughts] = useState<Record<string, boolean>>({});

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 80);
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

  const toggleThought = (msgId: string) => {
    setExpandedThoughts((prev) => ({
      ...prev,
      [msgId]: !(prev[msgId] ?? false),
    }));
  };

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6 relative selection:bg-[#27272e] font-sans"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {session.messages.length === 0 ? (
          /* Clean Empty State */
          <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-8 select-none">
            <div className="w-12 h-12 rounded-xl bg-[#18181d] border border-[#27272e] flex items-center justify-center mb-3">
              <Cpu className="w-6 h-6 text-[#8e8e98]" />
            </div>
            <h2 className="text-base font-semibold text-[#f4f4f5] mb-1">
              CITEOAI Remote Control
            </h2>
            <p className="text-xs text-[#71717a] max-w-sm">
              Ready for real-time task execution. Type a prompt below or use slash commands (<span className="font-mono text-[#0091ff]">/</span>).
            </p>
          </div>
        ) : (
          session.messages.map((msg) => {
            const isUser = msg.role === 'user';

            if (isUser) {
              return (
                <div key={msg.id} className="w-full flex justify-end">
                  <div className="w-full max-w-2xl rounded-2xl bg-[#1e1e24] border border-[#2b2b34] p-4 shadow-lg space-y-2">
                    <p className="text-sm text-[#f4f4f5] leading-relaxed select-text whitespace-pre-wrap font-normal">
                      {msg.content}
                    </p>
                  </div>
                </div>
              );
            }

            // Assistant Message
            const isThoughtOpen = expandedThoughts[msg.id] ?? false;

            return (
              <div key={msg.id} className="w-full space-y-3">
                {/* Collapsible Thought Accordion */}
                {msg.thought && (
                  <div className="rounded-xl bg-[#141418] border border-[#27272e] overflow-hidden text-xs max-w-2xl">
                    <button
                      onClick={() => toggleThought(msg.id)}
                      className="w-full flex items-center justify-between px-3.5 py-2 text-[#8e8e98] hover:text-[#f4f4f5] hover:bg-[#1a1a20] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        <span className="font-medium">Thought Process</span>
                      </div>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isThoughtOpen ? 'rotate-180 text-[#f4f4f5]' : 'text-[#71717a]'
                        }`}
                      />
                    </button>
                    {isThoughtOpen && (
                      <div className="p-3 border-t border-[#232328] font-mono text-[11px] text-[#a1a1aa] whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                        {msg.thought}
                      </div>
                    )}
                  </div>
                )}

                {/* Tool Execution Steps / Chips */}
                {msg.steps && msg.steps.length > 0 && (
                  <div className="space-y-1.5 pt-1 max-w-xl">
                    {msg.steps.map((step) => (
                      <button
                        key={step.id}
                        onClick={() =>
                          onOpenTask(
                            step.title,
                            step.output || 'Executing task in background...'
                          )
                        }
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#18181d] hover:bg-[#202027] border border-[#24242b] text-left transition-colors group shadow-sm"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                          {step.status === 'running' ? (
                            <Loader2 className="w-3.5 h-3.5 text-[#0091ff] animate-spin shrink-0" />
                          ) : step.status === 'failed' ? (
                            <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          )}
                          <span className="text-xs font-mono text-[#d4d4d8] group-hover:text-white transition-colors truncate">
                            {step.title}
                          </span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[#71717a] group-hover:text-white transition-colors shrink-0" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Message Content formatted with Markdown */}
                {msg.content && (
                  <div className="text-sm text-[#d4d4d8] leading-relaxed space-y-3 font-normal select-text">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
                        ul: ({ children }) => <ul className="space-y-2 my-2">{children}</ul>,
                        li: ({ children }) => (
                          <li className="flex items-start gap-2">
                            <span className="text-[#8e8e98] mt-1 select-none">•</span>
                            <div className="flex-1">{children}</div>
                          </li>
                        ),
                        code: ({ children }) => {
                          const textVal = String(children).trim();
                          const isFilePath =
                            textVal.includes('/') ||
                            textVal.endsWith('.go') ||
                            textVal.endsWith('.ts') ||
                            textVal.endsWith('.tsx') ||
                            textVal.endsWith('.js') ||
                            textVal.endsWith('.json') ||
                            textVal.endsWith('.md') ||
                            textVal.endsWith('.html');

                          return (
                            <code
                              onClick={() => {
                                if (isFilePath) onOpenFile(textVal);
                              }}
                              className={`font-mono text-xs px-1.5 py-0.5 rounded bg-[#1c1c22] border border-[#27272e] text-[#f4f4f5] ${
                                isFilePath
                                  ? 'cursor-pointer hover:border-blue-500 hover:text-blue-400 transition-colors'
                                  : ''
                              }`}
                            >
                              {children}
                            </code>
                          );
                        },
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 font-mono text-xs underline decoration-blue-500/50 hover:decoration-blue-400 transition-colors"
                          >
                            {children}
                            <ExternalLink className="w-3 h-3 inline" />
                          </a>
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Floating Scroll to Bottom Button */}
      {showScrollBottom && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-24 right-8 md:right-16 z-20 w-8 h-8 rounded-full bg-[#1c1c22] hover:bg-[#25252d] border border-[#2b2b34] text-[#d4d4d8] hover:text-white flex items-center justify-center shadow-2xl transition-all"
          title="Scroll to bottom"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
