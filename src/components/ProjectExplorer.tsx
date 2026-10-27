import React, { useState } from 'react';
import { Folder, Plus, ChevronDown, ChevronRight, SlidersHorizontal, FolderPlus } from 'lucide-react';
import { Project, Session } from '../types';

interface ProjectExplorerProps {
  projects: Project[];
  activeSessionId?: string;
  onSelectSession: (session: Session) => void;
  onCreateSession: (projectId: string) => void;
  onNewProject?: () => void;
}

export const ProjectExplorer: React.FC<ProjectExplorerProps> = ({
  projects,
  activeSessionId,
  onSelectSession,
  onCreateSession,
  onNewProject,
}) => {
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [collapsedProjects, setCollapsedProjects] = useState<Record<string, boolean>>({});

  const toggleProject = (projectId: string) => {
    setCollapsedProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-3 select-none overflow-y-auto">
      {/* Accordion Header: Projects v with icons on the right */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#27272a]/60">
        <button
          onClick={() => setIsProjectsOpen(!isProjectsOpen)}
          className="flex items-center gap-1.5 text-sm font-medium text-[#f4f4f5] hover:text-white transition-colors"
        >
          <span>Projects</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-[#a1a1aa] transition-transform duration-150 ${
              isProjectsOpen ? '' : '-rotate-90'
            }`}
          />
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {}}
            className="p-1 text-[#71717a] hover:text-[#f4f4f5] hover:bg-[#18181c] rounded-[4px] transition-colors"
            title="Filter"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onNewProject}
            className="p-1 text-[#71717a] hover:text-[#f4f4f5] hover:bg-[#18181c] rounded-[4px] transition-colors"
            title="New Project"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Projects List */}
      {isProjectsOpen && (
        <div className="space-y-4">
          {projects.map((project) => {
            const isCollapsed = collapsedProjects[project.id];

            return (
              <div key={project.id} className="space-y-1">
                {/* Project Header Row */}
                <div className="flex items-center justify-between group py-1">
                  <button
                    onClick={() => toggleProject(project.id)}
                    className="flex items-center gap-2 text-sm text-[#f4f4f5] font-medium hover:text-cyan-400 transition-colors"
                  >
                    <Folder className="w-4 h-4 text-[#a1a1aa] group-hover:text-cyan-400 transition-colors" />
                    <span>{project.name}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCreateSession(project.id);
                    }}
                    className="p-1 text-[#71717a] hover:text-[#f4f4f5] hover:bg-[#1e1e24] rounded-[4px] transition-colors"
                    title="New Session"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Sessions under this project */}
                {!isCollapsed && (
                  <div className="pl-6 space-y-1">
                    {project.sessions.length === 0 ? (
                      <div className="text-xs text-[#71717a] py-1.5 italic font-mono">
                        No sessions
                      </div>
                    ) : (
                      project.sessions.map((session) => {
                        const isActive = activeSessionId === session.id;

                        return (
                          <div
                            key={session.id}
                            onClick={() => onSelectSession(session)}
                            className={`flex items-center justify-between py-2 px-2.5 rounded-[4px] cursor-pointer transition-colors group ${
                              isActive
                                ? 'bg-[#1e1e24] text-[#f4f4f5] border border-[#27272a]'
                                : 'hover:bg-[#18181c] text-[#a1a1aa] hover:text-[#f4f4f5]'
                            }`}
                          >
                            <span className="text-xs sm:text-[13px] font-normal truncate max-w-[70vw] sm:max-w-md">
                              {session.title}
                            </span>

                            <div className="flex items-center gap-2 shrink-0 ml-2">
                              {session.hasActiveDot && (
                                <span className="w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
                              )}
                              <span className="text-[11px] font-mono text-[#71717a] group-hover:text-[#a1a1aa]">
                                {session.relativeTime}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
