import React, { useRef, useEffect, useState } from 'react';
import {
  ChevronRight,
  ArrowDown,
  ExternalLink,
  CheckCircle2,
  Clock,
  Terminal,
  FileCode,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Session, ChatMessage, ExecutionStep } from '../types';

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

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6 relative selection:bg-[#27272e]"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {session.messages.map((msg) => {
          const isUser = msg.role === 'user';

          if (isUser) {
            return (
              <div key={msg.id} className="w-full flex justify-end">
                <div className="w-full max-w-2xl rounded-2xl bg-[#1e1e24] border border-[#2b2b34] p-4 shadow-lg space-y-3">
                  {/* Attached Image Thumbnail */}
                  {msg.images && msg.images.length > 0 && (
                    <div className="w-20 h-16 rounded-lg bg-[#141418] border border-[#2b2b34] p-1.5 flex flex-col justify-between overflow-hidden shadow-inner">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-[8px] font-mono text-[#8e8e98] truncate">
                          specs.png
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="h-1 bg-[#2b2b34] rounded w-full" />
                        <div className="h-1 bg-[#2b2b34] rounded w-3/4" />
                      </div>
                    </div>
                  )}

                  {/* User Text */}
                  <p className="text-sm text-[#f4f4f5] leading-relaxed select-text font-normal">
                    {msg.content}
                  </p>
                </div>
              </div>
            );
          }

          // Assistant Message
          return (
            <div key={msg.id} className="w-full space-y-4">
              {/* Image Previews / Thumbnails Side-by-Side (Matching Image 2) */}
              {msg.images && msg.images.length >= 2 && (
                <div className="flex items-center gap-3">
                  {/* Thumbnail 1: Screen 1 Preview */}
                  <div className="w-28 h-20 rounded-lg bg-[#141418] border border-[#27272e] p-2 flex flex-col justify-between shadow-md cursor-pointer hover:border-[#3f3f4a] transition-colors">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-sm bg-blue-500/80" />
                      <div className="h-1.5 bg-[#27272e] rounded w-12" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-[#0091ff]" />
                        <div className="h-1 bg-[#2b2b34] rounded w-16" />
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-[#0091ff]" />
                        <div className="h-1 bg-[#2b2b34] rounded w-10" />
                      </div>
                      <div className="h-1 bg-[#2b2b34] rounded w-14" />
                    </div>
                  </div>

                  {/* Thumbnail 2: Screen 2 Preview */}
                  <div className="w-28 h-20 rounded-lg bg-[#141418] border border-[#27272e] p-2 flex flex-col justify-between shadow-md cursor-pointer hover:border-[#3f3f4a] transition-colors">
                    <div className="h-1.5 bg-[#27272e] rounded w-14" />
                    <div className="space-y-1">
                      <div className="h-1 bg-[#2b2b34] rounded w-full" />
                      <div className="h-1 bg-[#2b2b34] rounded w-4/5" />
                      <div className="h-1 bg-[#2b2b34] rounded w-3/5" />
                    </div>
                  </div>
                </div>
              )}

              {/* Message Content formatted with Markdown */}
              <div className="text-sm text-[#d4d4d8] leading-relaxed space-y-3 font-normal">
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
                      const textVal = String(children);
                      const isFilePath =
                        textVal.includes('/') || textVal.includes('.go') || textVal.includes('.html');

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

              {/* Accordion Disclosures (Matching Image 2: '2m timer: Timer has expired >', etc.) */}
              {msg.steps && msg.steps.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {msg.steps.map((step) => (
                    <button
                      key={step.id}
                      onClick={() =>
                        onOpenTask(step.title, step.output || 'Task output logged successfully.')
                      }
                      className="w-full max-w-xl flex items-center justify-between px-3 py-2 rounded-lg bg-[#18181d] hover:bg-[#202027] border border-[#24242b] text-left transition-colors group shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        {step.type === 'timer' ? (
                          <Clock className="w-3.5 h-3.5 text-[#8e8e98] group-hover:text-blue-400 transition-colors" />
                        ) : step.type === 'terminal' ? (
                          <Terminal className="w-3.5 h-3.5 text-[#8e8e98] group-hover:text-blue-400 transition-colors" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#8e8e98] group-hover:text-emerald-400 transition-colors" />
                        )}
                        <span className="text-xs font-mono text-[#d4d4d8] group-hover:text-white transition-colors">
                          {step.title}
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[#71717a] group-hover:text-white transition-colors" />
                    </button>
                  ))}
                </div>
              )}

              {/* Trailing paragraph */}
              <p className="text-xs text-[#8e8e98] pt-1">
                Both workers are actively building the remote control system:
              </p>
            </div>
          );
        })}
      </div>

      {/* Floating Scroll to Bottom Button (Matching Image 2 '↓') */}
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
