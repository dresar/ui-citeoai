import React, { useEffect } from 'react';
import { Check, ChevronRight, Info, TrendingUp } from 'lucide-react';
import { ModelOption } from '../types';

interface ModelPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  models: ModelOption[];
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
  onViewUsage?: () => void;
}

export const ModelPickerModal: React.FC<ModelPickerModalProps> = ({
  isOpen,
  onClose,
  models,
  selectedModelId,
  onSelectModel,
  onViewUsage,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl sm:rounded-2xl bg-[#141416] border-t sm:border border-[#27272e] shadow-2xl p-4 sm:p-3.5 pb-7 sm:pb-3.5 sm:absolute sm:bottom-full sm:left-0 sm:inset-x-auto sm:mb-2.5 sm:w-[380px] sm:max-w-[calc(100vw-2rem)] select-none"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Model Selection"
      >
        <div className="w-9 h-1 bg-[#3f3f46] rounded-full mx-auto mb-3 shrink-0" />

        <div className="text-sm font-medium text-[#f4f4f5] px-2 mb-2">
          Model
        </div>

        <div className="space-y-0.5">
          {models.map((model) => {
            const isSelected = model.id === selectedModelId;
            const isDisabled = Boolean(model.disabled);

            return (
              <button
                key={model.id}
                type="button"
                disabled={isDisabled}
                onClick={() => {
                  if (isDisabled) return;
                  onSelectModel(model.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2.5 rounded-xl text-left transition-colors ${
                  isDisabled
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:bg-[#202026] active:bg-[#25252e] cursor-pointer'
                }`}
              >
                <div className="flex items-center min-w-0 pr-2">
                  <span
                    className={`text-sm truncate ${
                      isDisabled
                        ? 'text-[#71717a]'
                        : isSelected
                        ? 'text-[#f4f4f5] font-medium'
                        : 'text-[#e4e4e7] font-normal'
                    }`}
                  >
                    {model.name}
                  </span>

                  {model.tag && (
                    <span className="text-xs text-[#71717a] font-normal ml-1.5 shrink-0">
                      {model.tag}
                    </span>
                  )}

                  {model.badge === 'Notice' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#27272a] border border-[#3f3f46]/40 text-[11px] font-normal text-[#a1a1aa] ml-2 shrink-0">
                      <span>Notice</span>
                      <Info className="w-3 h-3 text-[#a1a1aa]" />
                    </span>
                  )}

                  {model.badge === 'Unavailable' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1b1b1f] border border-[#2a2a30] text-[11px] font-normal text-[#71717a] ml-2 shrink-0">
                      <span>Unavailable</span>
                      <Info className="w-3 h-3 text-[#71717a]" />
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isSelected && (
                    <Check className="w-4 h-4 text-[#f4f4f5]" />
                  )}
                  <ChevronRight
                    className={`w-4 h-4 ${
                      isDisabled ? 'text-[#3f3f46]' : 'text-[#71717a]'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        <div className="border-t border-[#26262e] my-2" />

        <button
          type="button"
          onClick={() => {
            if (onViewUsage) {
              onViewUsage();
            }
            onClose();
          }}
          className="w-full flex items-center justify-between px-2.5 py-2.5 rounded-xl text-left hover:bg-[#202026] active:bg-[#25252e] text-[#d4d4d8] hover:text-[#f4f4f5] transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-4 h-4 text-[#a1a1aa] group-hover:text-[#f4f4f5] transition-colors" />
            <span className="text-sm font-medium">View Usage</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#71717a] group-hover:text-[#a1a1aa] transition-colors" />
        </button>
      </div>
    </>
  );
};
