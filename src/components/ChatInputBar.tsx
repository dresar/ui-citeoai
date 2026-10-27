import React, { useState, useRef } from 'react';
import {
  Plus,
  ChevronUp,
  Mic,
  ArrowRight,
  Check,
} from 'lucide-react';
import { SlashCommand } from '../types';
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentModel = INITIAL_MODELS.find((m) => m.id === selectedModel) || INITIAL_MODELS[0];

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputText(val);

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
      setTimeout(() => {
        setInputText((prev) => (prev ? `${prev} ` : '') + 'Jalankan verifikasi sistem...');
        setIsRecording(false);
      }, 2000);
    }
  };

  return (
    <div className="w-full px-3 sm:px-4 pb-3 sm:pb-4 pt-1 shrink-0 z-10">
      <div className="w-full max-w-4xl mx-auto relative flex flex-col">
        {/* Slash Command Autocomplete Popover */}
        {showSlashPopup && (
          <div className="absolute bottom-full mb-2 left-0 w-full max-w-sm rounded-xl bg-[#18181c] border border-[#2b2b34] shadow-2xl p-1.5 max-h-56 overflow-y-auto z-50">
            <div className="px-2.5 py-1 text-[11px] font-semibold text-[#8e8e98] uppercase tracking-wider">
              Commands
            </div>
            {SLASH_COMMANDS.filter((cmd) =>
              cmd.command.toLowerCase().includes(inputText.toLowerCase())
            ).map((cmd) => (
              <button
                key={cmd.command}
                onClick={() => handleSelectSlash(cmd)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs hover:bg-[#22222a] text-left transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[#0091ff] font-medium">{cmd.command}</span>
                  <span className="text-[#a1a1aa]">{cmd.label}</span>
                </div>
                <span className="text-[11px] text-[#71717a] truncate max-w-[140px]">
                  {cmd.description}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Input Box Card */}
        <div className="rounded-2xl bg-[#18181d] border border-[#27272e] p-3 shadow-xl focus-within:border-[#3b3b44] transition-all">
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything, @ to mention, / for actions"
            rows={1}
            disabled={disabled}
            className="w-full bg-transparent text-sm text-[#f4f4f5] placeholder-[#71717a] resize-none outline-none max-h-32 min-h-[38px] py-1 px-1 font-normal leading-relaxed"
          />

          {/* Bottom Row Controls */}
          <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-[#232328]">
            {/* Left Controls: Plus & Model Picker */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-1.5 text-[#8e8e98] hover:text-[#f4f4f5] hover:bg-[#22222a] rounded-lg transition-colors"
                title="Add context or attachment"
              >
                <Plus className="w-4 h-4" />
              </button>

              {/* Model Picker */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setModelPickerOpen(!modelPickerOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-[#8e8e98] hover:text-[#f4f4f5] hover:bg-[#22222a] transition-colors"
                >
                  <span>{currentModel.name}</span>
                  <ChevronUp className="w-3.5 h-3.5 text-[#71717a]" />
                </button>

                {modelPickerOpen && (
                  <div className="absolute bottom-full left-0 mb-2 w-48 rounded-xl bg-[#18181c] border border-[#2b2b34] shadow-2xl p-1.5 z-50">
                    <div className="px-2 py-1 text-[11px] font-semibold text-[#71717a] uppercase tracking-wider">
                      Select Model
                    </div>
                    {INITIAL_MODELS.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => {
                          onSelectModel(model.id);
                          setModelPickerOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                          model.id === selectedModel
                            ? 'bg-[#22222a] text-[#f4f4f5] font-medium'
                            : 'text-[#8e8e98] hover:text-[#f4f4f5] hover:bg-[#1e1e24]'
                        }`}
                      >
                        <span>{model.name}</span>
                        {model.id === selectedModel && (
                          <Check className="w-3.5 h-3.5 text-[#0091ff]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Controls: Mic & Blue Send Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleVoice}
                className={`p-1.5 rounded-lg transition-colors ${
                  isRecording
                    ? 'text-rose-400 bg-rose-950/40 animate-pulse'
                    : 'text-[#8e8e98] hover:text-[#f4f4f5] hover:bg-[#22222a]'
                }`}
                title="Voice input"
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleSend}
                disabled={!inputText.trim() || disabled}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  inputText.trim() && !disabled
                    ? 'bg-[#1a73e8] hover:bg-blue-600 text-white shadow-md cursor-pointer'
                    : 'bg-[#1a73e8] text-white opacity-80 cursor-pointer'
                }`}
                title="Send prompt"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
