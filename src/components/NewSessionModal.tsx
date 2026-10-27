import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface NewSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  onCreate: (title: string) => void;
}

export const NewSessionModal: React.FC<NewSessionModalProps> = ({
  isOpen,
  onClose,
  projectName,
  onCreate,
}) => {
  const [title, setTitle] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate(title.trim());
    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="w-full max-w-sm rounded-[4px] bg-[#18181c] border border-[#27272a] shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#27272a]">
          <h3 className="text-xs font-semibold text-[#f4f4f5]">New Session</h3>
          <button
            onClick={onClose}
            className="p-1 text-[#71717a] hover:text-[#f4f4f5] rounded-[4px]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <div className="text-[11px] text-[#71717a] mb-1 font-mono">
              Project: <span className="text-[#f4f4f5] font-semibold">{projectName}</span>
            </div>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Audit API routes"
              className="w-full px-2.5 py-1.5 rounded-[4px] bg-[#121215] border border-[#27272a] text-xs text-[#f4f4f5] outline-none focus:border-cyan-500 font-normal"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#27272a]/60">
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1 text-xs text-[#a1a1aa] hover:text-[#f4f4f5] bg-[#121215] rounded-[4px] border border-[#27272a]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-3 py-1 text-xs bg-cyan-600 hover:bg-cyan-500 text-white rounded-[4px] disabled:opacity-50 font-medium"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
