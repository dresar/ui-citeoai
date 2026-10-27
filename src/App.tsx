import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProjectExplorer } from './components/ProjectExplorer';
import { ChatView } from './components/ChatView';
import { ChatInputBar } from './components/ChatInputBar';
import { SettingsModal } from './components/SettingsModal';
import { FilePreviewModal } from './components/FilePreviewModal';
import { NewSessionModal } from './components/NewSessionModal';
import { INITIAL_PROJECTS, DEFAULT_SETTINGS, INITIAL_MODELS } from './mockData';
import { Project, Session, ChatMessage, ExecutionStep, SystemSettings } from './types';
import { wsService, ConnectionStatus, WSMessage } from './services/websocket';

export const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  // Default to Screen 1 (Project Explorer), but with active session available
  const [currentView, setCurrentView] = useState<'projects' | 'chat'>('projects');
  const [activeSessionId, setActiveSessionId] = useState<string>('sess_citeoai_setup');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.8-flash-high');
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [isStreaming, setIsStreaming] = useState(false);

  // Modals state
  const [filePreview, setFilePreview] = useState<{ open: boolean; file: string; lines: string }>({
    open: false,
    file: 'main.go',
    lines: '#L80-140',
  });

  const [newSessionData, setNewSessionData] = useState<{
    open: boolean;
    projectId: string;
    projectName: string;
  }>({
    open: false,
    projectId: 'proj_citeoai',
    projectName: 'CITEOAI',
  });

  // Find currently active session object
  const activeSession: Session =
    projects
      .flatMap((p) => p.sessions)
      .find((s) => s.id === activeSessionId) ||
    projects[0]?.sessions[0] || {
      id: 'sess_default',
      projectId: 'proj_citeoai',
      title: 'Default Session',
      updatedAt: new Date().toISOString(),
      relativeTime: 'Just now',
      messages: [],
    };

  // Subscribe to WebSocket status & messages
  useEffect(() => {
    const unsubStatus = wsService.onStatusChange((status) => {
      setConnectionStatus(status);
    });

    const unsubMsg = wsService.subscribe((msg: WSMessage) => {
      handleIncomingWSMessage(msg);
    });

    return () => {
      unsubStatus();
      unsubMsg();
    };
  }, [activeSessionId]);

  const handleIncomingWSMessage = (msg: WSMessage) => {
    const targetSessionId = msg.session_id || activeSessionId;

    setProjects((prevProjects) => {
      return prevProjects.map((project) => {
        const sessionIndex = project.sessions.findIndex((s) => s.id === targetSessionId);
        if (sessionIndex === -1) return project;

        const session = project.sessions[sessionIndex];
        const messages = [...session.messages];
        const lastMsgIndex = messages.length - 1;

        if (lastMsgIndex < 0 || messages[lastMsgIndex].role !== 'assistant') {
          return project;
        }

        const lastMsg = { ...messages[lastMsgIndex] };
        const steps = lastMsg.steps ? [...lastMsg.steps] : [];

        switch (msg.type) {
          case 'thought': {
            let thoughtStep = steps.find((s) => s.type === 'thought');
            if (!thoughtStep) {
              thoughtStep = {
                id: `step_thought_${Date.now()}`,
                type: 'thought',
                title: 'Thinking...',
                status: 'running',
                thoughtContent: msg.delta || '',
                expanded: true,
              };
              steps.push(thoughtStep);
            } else {
              thoughtStep.thoughtContent = (thoughtStep.thoughtContent || '') + '\n' + (msg.delta || '');
            }
            break;
          }

          case 'tool_start': {
            steps.push({
              id: `step_tool_${Date.now()}`,
              type: 'terminal',
              title: `Ran ${msg.name || 'tool'}`,
              workdir: '.../home/CITEOAI $',
              command: msg.args || '',
              output: '',
              status: 'running',
              expanded: true,
            });
            break;
          }

          case 'tool_log': {
            const toolStep = steps.filter((s) => s.type === 'terminal').pop();
            if (toolStep) {
              toolStep.output = (toolStep.output || '') + '\n' + (msg.output || '');
            }
            break;
          }

          case 'tool_end': {
            const toolStep = steps.filter((s) => s.type === 'terminal').pop();
            if (toolStep) {
              toolStep.status = msg.success ? 'success' : 'failed';
              toolStep.exitCode = msg.success ? 0 : 1;
            }
            break;
          }

          case 'token': {
            lastMsg.content = (lastMsg.content || '') + (msg.delta || '');
            break;
          }

          case 'done': {
            if (msg.final_text) {
              lastMsg.content = msg.final_text;
            }
            const thoughtStep = steps.find((s) => s.type === 'thought');
            if (thoughtStep) {
              thoughtStep.title = 'Thought for 4s';
              thoughtStep.status = 'success';
            }
            setIsStreaming(false);
            break;
          }
        }

        lastMsg.steps = steps;
        messages[lastMsgIndex] = lastMsg;

        const updatedSessions = [...project.sessions];
        updatedSessions[sessionIndex] = {
          ...session,
          messages,
          relativeTime: 'Just now',
        };

        return {
          ...project,
          sessions: updatedSessions,
        };
      });
    });
  };

  const handleSelectSession = (session: Session) => {
    setActiveSessionId(session.id);
    setCurrentView('chat');
  };

  const handleCreateSessionPrompt = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    setNewSessionData({
      open: true,
      projectId,
      projectName: project ? project.name : 'Project',
    });
  };

  const handleConfirmCreateSession = (title: string) => {
    const newSession: Session = {
      id: `sess_${Date.now()}`,
      projectId: newSessionData.projectId,
      title,
      updatedAt: new Date().toISOString(),
      relativeTime: 'Just now',
      messages: [],
    };

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === newSessionData.projectId) {
          return {
            ...p,
            sessions: [newSession, ...p.sessions],
          };
        }
        return p;
      })
    );

    setActiveSessionId(newSession.id);
    setCurrentView('chat');
  };

  const handleSendMessage = (text: string, modelId: string) => {
    // Process client slash commands if typed
    if (text.startsWith('/clear')) {
      handleClearSession();
      return;
    }

    if (text.startsWith('/new')) {
      handleCreateSessionPrompt('proj_citeoai');
      return;
    }

    if (text.startsWith('/reset')) {
      handleClearSession();
      return;
    }

    // Ensure we are in chat view
    setCurrentView('chat');

    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: 'Just now',
    };

    const initialAssistantMessage: ChatMessage = {
      id: `ast_${Date.now()}`,
      role: 'assistant',
      content: '',
      timestamp: 'Just now',
      steps: [],
    };

    setProjects((prev) =>
      prev.map((p) => {
        const sIndex = p.sessions.findIndex((s) => s.id === activeSessionId);
        if (sIndex === -1) return p;

        const updatedSessions = [...p.sessions];
        updatedSessions[sIndex] = {
          ...p.sessions[sIndex],
          relativeTime: 'Just now',
          messages: [...p.sessions[sIndex].messages, userMessage, initialAssistantMessage],
        };

        return {
          ...p,
          sessions: updatedSessions,
        };
      })
    );

    setIsStreaming(true);

    // Send to WebSocket service
    wsService.send({
      type: 'prompt',
      session_id: activeSessionId,
      content: text,
      model: modelId,
    });
  };

  const handleClearSession = () => {
    setProjects((prev) =>
      prev.map((p) => ({
        ...p,
        sessions: p.sessions.map((s) => (s.id === activeSessionId ? { ...s, messages: [] } : s)),
      }))
    );
  };

  const handleRefresh = () => {
    wsService.connect();
  };

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-[#f4f4f5] flex flex-col justify-between selection:bg-[#27272a]">
      {/* Top Header - Always visible on Screen 1; on Screen 2, Header in ChatView handles chat actions */}
      <Header
        status={connectionStatus}
        onRefresh={handleRefresh}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleChat={() => setCurrentView(currentView === 'projects' ? 'chat' : 'projects')}
        inChatView={currentView === 'chat'}
      />

      {/* Main Content Area: Responsive Dual/Mobile View */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {currentView === 'projects' ? (
          /* Screen 1: Project & Session Explorer */
          <div className="flex-1 flex flex-col pb-36">
            <ProjectExplorer
              projects={projects}
              activeSessionId={activeSessionId}
              onSelectSession={handleSelectSession}
              onCreateSession={handleCreateSessionPrompt}
              onNewProject={() => handleCreateSessionPrompt('proj_citeoai')}
            />
          </div>
        ) : (
          /* Screen 2: Chat & Live Execution Stream */
          <div className="flex-1 flex flex-col overflow-hidden">
            <ChatView
              session={activeSession}
              onBack={() => setCurrentView('projects')}
              onViewFile={(file, lines) => setFilePreview({ open: true, file, lines })}
              onClearSession={handleClearSession}
            />
          </div>
        )}
      </main>

      {/* Bottom Floating/Docked Input Bar (Always accessible, matching both screenshots) */}
      <ChatInputBar
        onSendMessage={handleSendMessage}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        disabled={isStreaming}
      />

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={(newS) => setSettings(newS)}
      />

      <FilePreviewModal
        isOpen={filePreview.open}
        onClose={() => setFilePreview({ ...filePreview, open: false })}
        file={filePreview.file}
        lines={filePreview.lines}
      />

      <NewSessionModal
        isOpen={newSessionData.open}
        onClose={() => setNewSessionData({ ...newSessionData, open: false })}
        projectName={newSessionData.projectName}
        onCreate={handleConfirmCreateSession}
      />
    </div>
  );
};
