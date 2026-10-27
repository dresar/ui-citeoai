import React, { useState } from 'react';
import { X } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
      <div className="w-full max-w-sm rounded-2xl bg-[#18181d] border border-[#27272e] shadow-2xl p-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#232328]">
          <h3 className="text-sm font-semibold text-[#f4f4f5]">New Conversation</h3>
          <button
            onClick={onClose}
            className="p-1 text-[#8e8e98] hover:text-[#f4f4f5] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="text-xs text-[#8e8e98] mb-1.5">
              Project: <span className="text-[#f4f4f5] font-medium">{projectName}</span>
            </div>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Audit API routes"
              className="w-full px-3 py-2 rounded-lg bg-[#141418] border border-[#27272e] text-xs text-[#f4f4f5] outline-none focus:border-[#0091ff] font-normal"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#232328]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-[#8e8e98] hover:text-[#f4f4f5] bg-[#18181d] hover:bg-[#202026] rounded-lg border border-[#27272e] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-4 py-1.5 text-xs bg-[#1a73e8] hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 font-medium transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
