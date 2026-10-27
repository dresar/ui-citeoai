import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { SystemSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SystemSettings;
  onSave: (newSettings: SystemSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [formData, setFormData] = useState<SystemSettings>({ ...settings });
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm select-none">
      <div className="w-full max-w-md rounded-2xl bg-[#18181d] border border-[#27272e] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#232328] bg-[#16161a]">
          <h3 className="text-sm font-semibold text-[#f4f4f5]">Settings</h3>
          <button
            onClick={onClose}
            className="p-1 text-[#8e8e98] hover:text-[#f4f4f5] hover:bg-[#202026] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Provider Selection */}
          <div className="space-y-1.5">
            <label className="text-[#8e8e98] font-medium block">Provider</label>
            <div className="grid grid-cols-2 gap-2">
              {(['gemini', 'openai', 'anthropic', 'ollama'] as const).map((prov) => (
                <button
                  key={prov}
                  type="button"
                  onClick={() => setFormData({ ...formData, provider: prov })}
                  className={`py-2 px-3 rounded-lg border text-left capitalize transition-colors ${
                    formData.provider === prov
                      ? 'bg-[#1e1e26] border-[#0091ff] text-[#f4f4f5] font-semibold'
                      : 'bg-[#141418] border-[#27272e] text-[#8e8e98] hover:bg-[#1a1a20]'
                  }`}
                >
                  {prov}
                </button>
              ))}
            </div>
          </div>

          {/* API Key */}
          <div className="space-y-1.5">
            <label className="text-[#8e8e98] font-medium block">API Key</label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                placeholder="Enter API key..."
                className="w-full px-3 py-2 pr-9 rounded-lg bg-[#141418] border border-[#27272e] text-[#f4f4f5] font-mono outline-none focus:border-[#0091ff]"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-[#f4f4f5]"
              >
                {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* System Prompt */}
          <div className="space-y-1.5">
            <label className="text-[#8e8e98] font-medium block">System Prompt</label>
            <textarea
              rows={3}
              value={formData.systemPrompt}
              onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
              className="w-full p-2.5 rounded-lg bg-[#141418] border border-[#27272e] text-[#f4f4f5] outline-none focus:border-[#0091ff] font-mono text-[11px] resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#232328]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-[#18181d] hover:bg-[#202026] text-[#8e8e98] hover:text-[#f4f4f5] border border-[#27272e] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-[#1a73e8] hover:bg-blue-600 text-white font-medium shadow transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
