import React, { useState } from 'react';
import {
  Folder,
  FolderPlus,
  SlidersHorizontal,
  Clock,
  Plus,
  ChevronDown,
  Pin,
  Archive,
  MoreVertical,
  Settings,
  PanelLeftClose,
} from 'lucide-react';
import { Project, Session } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  projects: Project[];
  activeSessionId: string;
  onSelectSession: (session: Session) => void;
  onNewConversation: () => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  projects,
  activeSessionId,
  onSelectSession,
  onNewConversation,
  onOpenSettings,
}) => {
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    proj_citeoai: true,
    proj_proskillai: true,
    proj_cli: true,
  });

  const toggleFolder = (folderId: string) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
        onClick={onToggle}
      />

      <aside className="fixed md:static inset-y-0 left-0 z-40 w-64 md:w-[260px] bg-[#16161a] border-r border-[#232328] flex flex-col justify-between select-none shrink-0 transition-all duration-200 ease-in-out">
        {/* Top Section */}
        <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar p-3">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 pt-1 px-1">
            <span className="text-[15px] font-semibold tracking-tight text-[#f4f4f5]">
              Antigravity
            </span>
            <button
              onClick={onToggle}
              className="p-1.5 text-[#8e8e98] hover:text-[#f4f4f5] hover:bg-[#202026] rounded-md transition-colors"
              title="Close sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          {/* New Conversation Button */}
          <button
            onClick={onNewConversation}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#1c1c22] hover:bg-[#24242d] border border-[#27272e] text-[#f4f4f5] text-sm font-medium transition-all shadow-sm group mb-3"
          >
            <Plus className="w-4 h-4 text-[#8e8e98] group-hover:text-white transition-colors" />
            <span>New Conversation</span>
          </button>

          {/* Conversation History Nav */}
          <div className="mb-4">
            <button className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#8e8e98] hover:text-[#f4f4f5] hover:bg-[#1e1e24] transition-colors">
              <Clock className="w-4 h-4 text-[#8e8e98]" />
              <span>Conversation History</span>
            </button>
          </div>

          {/* Projects Section */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between px-2 py-1 mb-1">
              <span className="text-xs font-medium text-[#8e8e98]">Projects</span>
              <div className="flex items-center gap-1">
                <button
                  className="p-1 text-[#8e8e98] hover:text-[#f4f4f5] hover:bg-[#202026] rounded transition-colors"
                  title="Filter projects"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onNewConversation}
                  className="p-1 text-[#8e8e98] hover:text-[#f4f4f5] hover:bg-[#202026] rounded transition-colors"
                  title="New project"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Project List */}
            <div className="space-y-3 mt-1">
              {projects.map((project) => {
                const isFolderOpen = openFolders[project.id] ?? true;

                return (
                  <div key={project.id} className="space-y-1">
                    {/* Project Folder Header */}
                    <button
                      onClick={() => toggleFolder(project.id)}
                      className="w-full flex items-center gap-2 px-2 py-1 rounded-md text-xs font-medium text-[#8e8e98] hover:text-[#f4f4f5] hover:bg-[#1e1e24] transition-colors text-left"
                    >
                      <Folder className="w-3.5 h-3.5 text-[#8e8e98] shrink-0" />
                      <span className="truncate">{project.name}</span>
                    </button>

                    {/* Sessions inside Project */}
                    {isFolderOpen && (
                      <div className="space-y-0.5 pl-2">
                        {project.sessions.map((sess) => {
                          const isActive = sess.id === activeSessionId;

                          return (
                            <button
                              key={sess.id}
                              onClick={() => onSelectSession(sess)}
                              className={`w-full group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                                isActive
                                  ? 'bg-[#22222a] text-[#f4f4f5] font-medium'
                                  : 'text-[#8e8e98] hover:text-[#f4f4f5] hover:bg-[#1b1b20]'
                              }`}
                            >
                              <span className="truncate flex-1 pr-1">{sess.title}</span>

                              {/* Right badges & indicators */}
                              <div className="flex items-center gap-1 shrink-0">
                                {sess.isPinned && (
                                  <Pin className="w-3 h-3 text-[#71717a] group-hover:text-[#a1a1aa]" />
                                )}
                                {sess.isArchived && (
                                  <Archive className="w-3 h-3 text-[#71717a] group-hover:text-[#a1a1aa]" />
                                )}
                                {sess.relativeTime && (
                                  <span className="text-[11px] text-[#71717a] font-normal">
                                    {sess.relativeTime}
                                  </span>
                                )}
                                {sess.hasActiveDot && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#0091ff] shadow-[0_0_6px_#0091ff]" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="p-3 border-t border-[#232328] space-y-2">
          {/* Profile Bar */}
          <div className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg bg-[#18181d] border border-[#27272c] text-xs font-mono">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-[#f4f4f5] truncate font-medium">agy01-eka.ckp16799</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#8e8e98] shrink-0" />
          </div>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-[#8e8e98] hover:text-[#f4f4f5] hover:bg-[#1e1e24] transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-[#8e8e98]" />
            <span>Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
};
