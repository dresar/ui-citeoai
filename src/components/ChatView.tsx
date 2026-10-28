import React, { useRef, useEffect, useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  ArrowDown,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Loader2,
  Sparkles,
  Cpu,
  Brain,
  Maximize2,
  Minimize2,
  Settings,
  Copy,
  Check,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Session } from '../types';

interface ChatViewProps {
  session: Session;
  onOpenFile: (filePath: string) => void;
  onOpenTask: (taskTitle: string, taskLogs: string) => void;
  onOpenSettings?: () => void;
  isStreaming?: boolean;
}

type ThoughtMode = 'collapsed' | 'compact' | 'expanded';

const CodeBlock: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  const [copied, setCopied] = useState(false);
  const codeText = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const match = /language-(\w+)/.exec(className || '');
  const lang = match ? match[1] : '';

  return (
    <div className="my-3 rounded-xl bg-[#121217] border border-[#26262e] overflow-hidden shadow-md">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#181820] border-b border-[#23232b] text-[11px] text-[#8e8e98] select-none">
        <span className="font-mono uppercase font-semibold text-[#a1a1aa]">{lang || 'Code'}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-[#8e8e98] hover:text-[#f4f4f5] transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-3.5 overflow-x-auto font-mono text-xs text-[#e4e4e7] leading-relaxed">
        <pre className="m-0 bg-transparent p-0">
          <code>{children}</code>
        </pre>
      </div>
    </div>
  );
};

export const ChatView: React.FC<ChatViewProps> = ({
  session,
  onOpenFile,
  onOpenTask,
  onOpenSettings,
  isStreaming,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [thoughtModes, setThoughtModes] = useState<Record<string, ThoughtMode>>({});

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
  }, [session.messages, isStreaming]);

  const getThoughtMode = (msgId: string): ThoughtMode => {
    return thoughtModes[msgId] || 'compact';
  };

  const toggleThoughtCollapse = (msgId: string) => {
    setThoughtModes((prev) => {
      const current = prev[msgId] || 'compact';
      return {
        ...prev,
        [msgId]: current === 'collapsed' ? 'compact' : 'collapsed',
      };
    });
  };

  const toggleThoughtExpand = (msgId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setThoughtModes((prev) => {
      const current = prev[msgId] || 'compact';
      return {
        ...prev,
        [msgId]: current === 'expanded' ? 'compact' : 'expanded',
      };
    });
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
          session.messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            const isLastMsg = index === session.messages.length - 1;
            const isLiveGenerating = isStreaming && isLastMsg;

            if (isUser) {
              return (
                <div key={msg.id} className="w-full flex justify-end">
                  <div className="w-full max-w-2xl rounded-2xl bg-[#1a1a22] border border-[#272733] p-4 shadow-md space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#71717a] pb-1 border-b border-[#242430]/60 select-none">
                      <span className="font-medium text-[#8e8e98]">You</span>
                      <span>{msg.timestamp || 'Just now'}</span>
                    </div>
                    <p className="text-sm text-[#f4f4f5] leading-relaxed select-text whitespace-pre-wrap font-normal">
                      {msg.content}
                    </p>
                  </div>
                </div>
              );
            }

            // Assistant Message
            const thoughtMode = getThoughtMode(msg.id);

            return (
              <div key={msg.id} className="w-full flex gap-3.5 items-start">
                {/* Assistant Avatar */}
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600/25 to-purple-600/25 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5 text-blue-400 shadow-sm select-none">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>

                {/* Main Content Column */}
                <div className="flex-1 min-w-0 space-y-3">
                  {/* Assistant Header */}
                  <div className="flex items-center gap-2 select-none">
                    <span className="font-semibold text-[#f4f4f5] text-[13px] tracking-tight">
                      CITEOAI
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#181820] border border-[#272734] text-[#8e8e98]">
                      AI Assistant
                    </span>
                    <span className="text-[11px] text-[#71717a] ml-1">
                      {msg.timestamp || 'Just now'}
                    </span>
                  </div>

                  {/* Thought Process Accordion */}
                  {msg.thought && (
                    <div className="rounded-xl bg-[#15151a] border border-[#26262e] overflow-hidden text-xs max-w-2xl shadow-sm transition-all duration-150">
                      <div
                        onClick={() => toggleThoughtCollapse(msg.id)}
                        className="w-full flex items-center justify-between px-3.5 py-2 text-[#8e8e98] hover:text-[#f4f4f5] hover:bg-[#1a1a22] cursor-pointer transition-colors select-none"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Brain className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span className="font-medium text-xs text-[#d4d4d8]">
                            Thinking Process
                          </span>
                          {isLiveGenerating && !msg.content && !msg.error && (
                            <span className="flex items-center gap-1 text-[10px] text-purple-400/90 font-mono ml-1.5 px-1.5 py-0.5 rounded bg-purple-950/40 border border-purple-800/40">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                              <span>thinking...</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Mode Indicator */}
                          <span className="text-[10px] font-mono text-[#71717a] uppercase px-1">
                            {thoughtMode}
                          </span>

                          {/* Maximize / Minimize Button */}
                          <button
                            type="button"
                            onClick={(e) => toggleThoughtExpand(msg.id, e)}
                            className="p-1 text-[#8e8e98] hover:text-[#f4f4f5] hover:bg-[#252530] rounded transition-colors"
                            title={
                              thoughtMode === 'expanded'
                                ? 'Minimize (Compact view)'
                                : 'Expand thinking process'
                            }
                          >
                            {thoughtMode === 'expanded' ? (
                              <Minimize2 className="w-3.5 h-3.5" />
                            ) : (
                              <Maximize2 className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Collapse / Chevron Toggle */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleThoughtCollapse(msg.id);
                            }}
                            className="p-1 text-[#8e8e98] hover:text-[#f4f4f5] hover:bg-[#252530] rounded transition-colors"
                            title={
                              thoughtMode === 'collapsed'
                                ? 'Expand'
                                : 'Collapse'
                            }
                          >
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                thoughtMode === 'collapsed'
                                  ? '-rotate-90 text-[#71717a]'
                                  : 'rotate-0 text-[#d4d4d8]'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Thought Body */}
                      {thoughtMode !== 'collapsed' && (
                        <div
                          className={`p-3.5 border-t border-[#232328] font-mono text-[11.5px] text-[#a1a1aa] whitespace-pre-wrap leading-relaxed selection:bg-[#27272e] ${
                            thoughtMode === 'expanded' ? 'max-h-[500px]' : 'max-h-36'
                          } overflow-y-auto`}
                        >
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

                  {/* Provider Error Card */}
                  {msg.error && (
                    <div className="rounded-xl bg-[#1b1114] border border-rose-900/50 p-4 shadow-lg text-rose-200 space-y-3 max-w-2xl animate-in fade-in duration-200">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/25 shrink-0 mt-0.5">
                          <AlertTriangle className="w-4 h-4 text-rose-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold text-rose-300">
                              Provider Error
                            </h4>
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-800/60 text-rose-400 font-medium">
                              CITEOAI API
                            </span>
                          </div>
                          <p className="text-xs text-rose-400/80 mt-0.5">
                            Permintaan ke AI model provider gagal diproses.
                          </p>
                        </div>
                      </div>

                      {/* Error message detail box */}
                      <div className="p-3 rounded-lg bg-[#120a0d] border border-rose-950/80 font-mono text-xs text-rose-200/90 whitespace-pre-wrap break-words leading-relaxed select-text">
                        {msg.error}
                      </div>

                      {/* Footer action button */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-[#8e8e98]">
                          Silakan periksa API Key atau endpoint di Settings.
                        </span>
                        {onOpenSettings && (
                          <button
                            onClick={onOpenSettings}
                            type="button"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-900/40 hover:bg-rose-900/60 border border-rose-700/50 text-rose-200 text-xs font-medium transition-all shadow-sm hover:border-rose-600"
                          >
                            <Settings className="w-3.5 h-3.5 text-rose-300" />
                            <span>Open Settings</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Message Content formatted with Markdown */}
                  {msg.content ? (
                    <div className="text-sm text-[#d4d4d8] leading-relaxed space-y-2.5 font-normal select-text">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p className="mb-2 leading-relaxed text-[#d4d4d8]">{children}</p>
                          ),
                          h1: ({ children }) => (
                            <h1 className="text-lg font-bold text-[#f4f4f5] mt-4 mb-2 pb-1 border-b border-[#27272e]">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-base font-semibold text-[#f4f4f5] mt-3.5 mb-1.5">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-sm font-semibold text-[#f4f4f5] mt-3 mb-1">
                              {children}
                            </h3>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-2 border-[#0091ff]/70 bg-[#14141a]/60 pl-3.5 py-1.5 my-2.5 rounded-r text-[#a1a1aa] italic">
                              {children}
                            </blockquote>
                          ),
                          ul: ({ children }) => <ul className="space-y-1.5 my-2 pl-1">{children}</ul>,
                          ol: ({ children }) => (
                            <ol className="list-decimal list-outside pl-4 space-y-1.5 my-2 text-[#d4d4d8]">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="flex items-start gap-2">
                              <span className="text-[#8e8e98] mt-1 select-none">•</span>
                              <div className="flex-1">{children}</div>
                            </li>
                          ),
                          table: ({ children }) => (
                            <div className="overflow-x-auto my-3 rounded-lg border border-[#27272e]">
                              <table className="w-full text-left text-xs border-collapse">
                                {children}
                              </table>
                            </div>
                          ),
                          th: ({ children }) => (
                            <th className="bg-[#181820] text-[#f4f4f5] font-semibold p-2.5 border-b border-[#27272e]">
                              {children}
                            </th>
                          ),
                          td: ({ children }) => (
                            <td className="p-2.5 border-b border-[#232328] text-[#a1a1aa] last:border-0">
                              {children}
                            </td>
                          ),
                          pre: ({ children }) => <>{children}</>,
                          code: ({ className, children }) => {
                            const isInline = !className && !String(children).includes('\n');
                            if (isInline) {
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
                            }

                            return <CodeBlock className={className}>{children}</CodeBlock>;
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

                      {/* Blinking cursor for live assistant streaming */}
                      {isLiveGenerating && (
                        <span className="inline-block w-2 h-4 ml-1 bg-[#0091ff] animate-pulse rounded-sm align-middle" />
                      )}
                    </div>
                  ) : isLiveGenerating && !msg.error ? (
                    <div className="flex items-center gap-2.5 text-xs text-[#8e8e98] py-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0091ff]" />
                      <span>CITEOAI sedang memproses respon...</span>
                    </div>
                  ) : null}
                </div>
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
