import React, { useState } from 'react';
import { X, Eye, EyeOff, Save, ShieldAlert, Cpu } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
      <div className="w-full max-w-lg rounded-[4px] bg-[#18181c] border border-[#27272a] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#27272a] bg-[#121215]">
          <h3 className="text-sm font-semibold text-[#f4f4f5]">Settings</h3>
          <button
            onClick={onClose}
            className="p-1 text-[#71717a] hover:text-[#f4f4f5] hover:bg-[#1e1e24] rounded-[4px] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 text-xs">
          {/* Provider Selection */}
          <div className="space-y-1.5">
            <label className="text-[#a1a1aa] font-medium block">Provider</label>
            <div className="grid grid-cols-2 gap-2">
              {(['gemini', 'openai', 'anthropic', 'ollama'] as const).map((prov) => (
                <button
                  key={prov}
                  type="button"
                  onClick={() => setFormData({ ...formData, provider: prov })}
                  className={`py-2 px-3 rounded-[4px] border text-left capitalize transition-colors ${
                    formData.provider === prov
                      ? 'bg-cyan-950/40 border-cyan-800 text-cyan-300 font-semibold'
                      : 'bg-[#121215] border-[#27272a] text-[#a1a1aa] hover:bg-[#1e1e24]'
                  }`}
                >
                  {prov}
                </button>
              ))}
            </div>
          </div>

          {/* API Key */}
          <div className="space-y-1.5">
            <label className="text-[#a1a1aa] font-medium block">API Key</label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                placeholder="sk-..."
                className="w-full px-3 py-2 pr-9 rounded-[4px] bg-[#121215] border border-[#27272a] text-[#f4f4f5] font-mono outline-none focus:border-cyan-500"
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

          {/* Sandbox Mode */}
          <div className="space-y-1.5">
            <label className="text-[#a1a1aa] font-medium block">Sandbox Mode</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, sandboxMode: 'isolated' })}
                className={`p-2.5 rounded-[4px] border text-left transition-colors ${
                  formData.sandboxMode === 'isolated'
                    ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300'
                    : 'bg-[#121215] border-[#27272a] text-[#a1a1aa] hover:bg-[#1e1e24]'
                }`}
              >
                <div className="font-semibold text-xs">Isolated Cgroup</div>
                <div className="text-[10px] text-[#71717a] mt-0.5 font-mono">2 vCPU, 4GB RAM</div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, sandboxMode: 'full_vps' })}
                className={`p-2.5 rounded-[4px] border text-left transition-colors ${
                  formData.sandboxMode === 'full_vps'
                    ? 'bg-amber-950/30 border-amber-800 text-amber-300'
                    : 'bg-[#121215] border-[#27272a] text-[#a1a1aa] hover:bg-[#1e1e24]'
                }`}
              >
                <div className="font-semibold text-xs">Full VPS</div>
                <div className="text-[10px] text-[#71717a] mt-0.5 font-mono">Direct Host Access</div>
              </button>
            </div>
          </div>

          {/* Auto Rotation Switch */}
          <div className="flex items-center justify-between p-2.5 rounded-[4px] bg-[#121215] border border-[#27272a]">
            <div>
              <div className="font-medium text-[#f4f4f5]">Auto Rotation</div>
              <div className="text-[10px] text-[#71717a]">Failover on 429 quota</div>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, autoRotation: !formData.autoRotation })}
              className={`w-9 h-5 rounded-[4px] p-0.5 transition-colors border ${
                formData.autoRotation
                  ? 'bg-cyan-600 border-cyan-500 justify-end'
                  : 'bg-[#18181c] border-[#27272a] justify-start'
              } flex items-center`}
            >
              <div className="w-3.5 h-3.5 bg-white rounded-[2px]" />
            </button>
          </div>

          {/* System Prompt */}
          <div className="space-y-1.5">
            <label className="text-[#a1a1aa] font-medium block">System Prompt</label>
            <textarea
              rows={3}
              value={formData.systemPrompt}
              onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
              className="w-full p-2.5 rounded-[4px] bg-[#121215] border border-[#27272a] text-[#f4f4f5] outline-none focus:border-cyan-500 font-mono text-[11px] resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#27272a]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-[4px] bg-[#121215] hover:bg-[#1e1e24] text-[#a1a1aa] hover:text-[#f4f4f5] border border-[#27272a]"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-[4px] bg-cyan-600 hover:bg-cyan-500 text-white font-medium shadow-sm shadow-cyan-900/40"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
