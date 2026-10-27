import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  ChevronUp,
  Mic,
  MicOff,
  ArrowRight,
  Check,
  Sparkles,
  Paperclip,
  Code,
  Layers,
} from 'lucide-react';
import { ModelOption, SlashCommand } from '../types';
import { SLASH_COMMANDS, INITIAL_MODELS } from '../mockData';

interface ChatInputBarProps {
  onSendMessage: (text: string, model: string) => void;
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
  disabled?: boolean;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  onSendMessage,
  selectedModel,
  onSelectModel,
  disabled,
}) => {
  const [inputText, setInputText] = useState('');
  const [modelPickerOpen, setModelPickerOpen] = useState(false);
  const [showSlashPopup, setShowSlashPopup] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [contextAttachOpen, setContextAttachOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentModel = INITIAL_MODELS.find((m) => m.id === selectedModel) || INITIAL_MODELS[0];

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputText(val);

    // If starts with / or contains /
    if (val.startsWith('/') && !val.includes(' ')) {
      setShowSlashPopup(true);
    } else {
      setShowSlashPopup(false);
    }
  };

  const handleSelectSlash = (cmd: SlashCommand) => {
    setInputText(`${cmd.command} `);
    setShowSlashPopup(false);
    textareaRef.current?.focus();
  };

  const handleSend = () => {
    if (!inputText.trim() || disabled) return;
    onSendMessage(inputText.trim(), currentModel.id);
    setInputText('');
    setShowSlashPopup(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleVoice = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // simulate speech recognition
      setTimeout(() => {
        setInputText((prev) => (prev ? `${prev} ` : '') + 'Jalankan analisis mendalam performa agent...');
        setIsRecording(false);
      }, 2500);
    }
  };

  return (
    <div className="w-full fixed bottom-0 left-0 right-0 z-30 p-2 sm:p-3 pointer-events-none flex flex-col items-center">
      <div className="w-full max-w-3xl pointer-events-auto flex flex-col gap-1.5">
        {/* Slash Command Autocomplete Popover */}
        {showSlashPopup && (
          <div className="rounded-[4px] bg-[#18181c] border border-[#27272a] shadow-2xl p-1.5 max-h-56 overflow-y-auto mb-1 animate-in fade-in slide-in-from-bottom-2">
            <div className="px-2 py-1 text-[11px] font-semibold text-[#71717a] uppercase tracking-wider">
              Commands
            </div>
            {SLASH_COMMANDS.filter((cmd) => cmd.command.toLowerCase().includes(inputText.toLowerCase())).map(
              (cmd) => (
                <button
                  key={cmd.command}
                  onClick={() => handleSelectSlash(cmd)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-[4px] text-xs hover:bg-[#1e1e24] text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-400 font-medium">{cmd.command}</span>
                    <span className="text-[#a1a1aa]">{cmd.label}</span>
                  </div>
                  <span className="text-[11px] text-[#71717a]">{cmd.description}</span>
                </button>
              )
            )}
          </div>
        )}

        {/* Quick Slash Chips Bar (Scrollable horizontally) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-0.5">
          {SLASH_COMMANDS.slice(0, 7).map((cmd) => (
            <button
              key={cmd.command}
              onClick={() => handleSelectSlash(cmd)}
              className="text-[11px] font-mono px-2 py-0.5 rounded-[4px] bg-[#18181c]/90 hover:bg-[#1e1e24] border border-[#27272a] text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors shrink-0 shadow-sm"
            >
              {cmd.command}
            </button>
          ))}
        </div>

        {/* Main Input Container Card */}
        <div className="rounded-[4px] bg-[#18181c] border border-[#27272a] p-2.5 shadow-2xl backdrop-blur-md">
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything, @ to mention, / for actions"
            rows={1}
            disabled={disabled}
            className="w-full bg-transparent text-sm text-[#f4f4f5] placeholder-[#71717a] resize-none outline-none max-h-32 min-h-[36px] py-1 px-1 font-normal"
          />

          {/* Bottom Bar inside Input: Actions & Controls */}
          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#27272a]/60">
            {/* Left Controls: Plus Button & Model Picker */}
            <div className="flex items-center gap-2">
              {/* Plus Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setContextAttachOpen(!contextAttachOpen)}
                  className="p-1.5 text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#1e1e24] rounded-[4px] border border-[#27272a] transition-colors"
                  title="Attach file"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>

                {contextAttachOpen && (
                  <div className="absolute left-0 bottom-full mb-2 w-48 rounded-[4px] bg-[#18181c] border border-[#27272a] shadow-xl py-1 z-50 text-xs">
                    <button
                      onClick={() => {
                        setContextAttachOpen(false);
                        setInputText((prev) => (prev ? `${prev} ` : '') + '@file:main.go ');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#1e1e24]"
                    >
                      <Code className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Attach main.go</span>
                    </button>
                    <button
                      onClick={() => {
                        setContextAttachOpen(false);
                        setInputText((prev) => (prev ? `${prev} ` : '') + '@sandbox:status ');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#1e1e24]"
                    >
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      <span>Sandbox State</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Model Picker Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setModelPickerOpen(!modelPickerOpen)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-[4px] bg-[#121215] hover:bg-[#1e1e24] border border-[#27272a] text-xs font-normal text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors"
                >
                  <span className="font-normal">{currentModel.name}</span>
                  <ChevronUp
                    className={`w-3.5 h-3.5 text-[#71717a] transition-transform duration-150 ${
                      modelPickerOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {modelPickerOpen && (
                  <div className="absolute left-0 bottom-full mb-2 w-56 rounded-[4px] bg-[#18181c] border border-[#27272a] shadow-2xl py-1 z-50">
                    <div className="px-2.5 py-1 text-[10px] font-semibold text-[#71717a] uppercase tracking-wider border-b border-[#27272a]/60">
                      Select Model
                    </div>
                    {INITIAL_MODELS.map((model) => {
                      const isSelected = model.id === currentModel.id;
                      return (
                        <button
                          key={model.id}
                          onClick={() => {
                            onSelectModel(model.id);
                            setModelPickerOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-left transition-colors ${
                            isSelected
                              ? 'bg-[#1e1e24] text-cyan-400'
                              : 'text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#1e1e24]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{model.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono px-1 py-0.5 rounded-[4px] bg-[#121215] text-[#71717a]">
                              {model.tag}
                            </span>
                            {isSelected && <Check className="w-3 h-3 text-cyan-400" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Controls: Mic & Send Arrow */}
            <div className="flex items-center gap-1.5">
              {/* Mic / Voice toggle */}
              <button
                type="button"
                onClick={toggleVoice}
                className={`p-1.5 rounded-[4px] border border-[#27272a] transition-colors ${
                  isRecording
                    ? 'text-rose-400 bg-rose-950/40 border-rose-800 animate-pulse'
                    : 'text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#1e1e24]'
                }`}
                title="Voice input"
              >
                {isRecording ? <Mic className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>

              {/* Send Arrow Button */}
              <button
                type="button"
                onClick={handleSend}
                disabled={!inputText.trim() || disabled}
                className={`p-1.5 rounded-[4px] flex items-center justify-center transition-colors ${
                  inputText.trim() && !disabled
                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm shadow-cyan-900/40'
                    : 'bg-[#1e1e24] text-[#71717a] cursor-not-allowed border border-[#27272a]'
                }`}
                title="Send"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
