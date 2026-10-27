import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatHeader } from './components/ChatHeader';
import { ChatView } from './components/ChatView';
import { ChatInputBar } from './components/ChatInputBar';
import { RightPanel } from './components/RightPanel';
import { SettingsModal } from './components/SettingsModal';
import { NewSessionModal } from './components/NewSessionModal';
import {
  INITIAL_PROJECTS,
  DEFAULT_SETTINGS,
  MOCK_MAIN_GO,
  MOCK_SERVER_GO,
  MOCK_TASK_OUTPUT,
} from './mockData';
import { Project, Session, ChatMessage, SystemSettings, RightPanelTab } from './types';
import { wsService, ConnectionStatus, WSMessage } from './services/websocket';

export const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [activeSessionId, setActiveSessionId] = useState<string>('sess_citeoai_setup');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.8-flash-high');
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [isStreaming, setIsStreaming] = useState(false);

  // 3-Column Layout States
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  // Right Panel Tabs
  const [rightPanelTabs, setRightPanelTabs] = useState<RightPanelTab[]>([
    {
      id: 'tab_timer_task',
      type: 'task',
      title: 'ner: 2m, Prompt: 120s timer...',
      taskTitle: 'Background Task Output',
      taskLogs: MOCK_TASK_OUTPUT,
    },
    {
      id: 'tab_main_go',
      type: 'file',
      title: 'main.go',
      filePath: 'main.go #L1-30',
      fileContent: MOCK_MAIN_GO,
    },
    {
      id: 'tab_server_go',
      type: 'file',
      title: 'server.go',
      filePath: 'internal/web/server.go #L1-96',
      fileContent: MOCK_SERVER_GO,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab_timer_task');

  // New session modal
  const [newSessionData, setNewSessionData] = useState<{
    open: boolean;
    projectId: string;
    projectName: string;
  }>({
    open: false,
    projectId: 'proj_citeoai',
    projectName: 'CITEOAI',
  });

  // Active Session & Project
  const activeProject =
    projects.find((p) => p.sessions.some((s) => s.id === activeSessionId)) || projects[0];

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

  const activeRightPanelTab =
    rightPanelTabs.find((t) => t.id === activeTabId) || rightPanelTabs[0];

  // Auto-adapt sidebar on initial resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // WebSocket Subscription
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
          case 'token': {
            lastMsg.content = (lastMsg.content || '') + (msg.delta || '');
            break;
          }
          case 'done': {
            if (msg.final_text) {
              lastMsg.content = msg.final_text;
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

  const handleSendMessage = (text: string, modelId: string) => {
    if (text.startsWith('/clear')) {
      handleClearSession();
      return;
    }

    if (text.startsWith('/new')) {
      handleNewConversation();
      return;
    }

    if (text.startsWith('/reset')) {
      handleClearSession();
      return;
    }

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

  const handleOpenFile = (filePath: string) => {
    const cleanPath = filePath.replace(/[`#]/g, '').trim();
    const isServer = cleanPath.includes('server');
    const tabId = isServer ? 'tab_server_go' : 'tab_main_go';

    setActiveTabId(tabId);
    setIsRightPanelOpen(true);
  };

  const handleOpenTask = (taskTitle: string, taskLogs: string) => {
    const existing = rightPanelTabs.find((t) => t.title === taskTitle || t.id === 'tab_timer_task');
    if (existing) {
      existing.taskTitle = 'Background Task Output';
      existing.taskLogs = taskLogs;
      setActiveTabId(existing.id);
    } else {
      const newTab: RightPanelTab = {
        id: `tab_task_${Date.now()}`,
        type: 'task',
        title: taskTitle.slice(0, 25) + '...',
        taskTitle: 'Background Task Output',
        taskLogs,
      };
      setRightPanelTabs((prev) => [...prev, newTab]);
      setActiveTabId(newTab.id);
    }
    setIsRightPanelOpen(true);
  };

  const handleNewConversation = () => {
    setNewSessionData({
      open: true,
      projectId: activeProject.id,
      projectName: activeProject.name,
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
  };

  return (
    <div className="flex h-screen w-full bg-[#0e0e11] text-[#f4f4f5] overflow-hidden antialiased">
      {/* Column 1: Sidebar (Left) */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        projects={projects}
        activeSessionId={activeSessionId}
        onSelectSession={(sess) => {
          setActiveSessionId(sess.id);
          if (window.innerWidth < 768) setIsSidebarOpen(false);
        }}
        onNewConversation={handleNewConversation}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Column 2: Center Chat Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-[#0e0e11] relative">
        <ChatHeader
          projectName={activeProject.name}
          sessionTitle={activeSession.title}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isRightPanelOpen={isRightPanelOpen}
          onToggleRightPanel={() => setIsRightPanelOpen(!isRightPanelOpen)}
          onUpdateClick={() => wsService.connect()}
        />

        <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          <ChatView
            session={activeSession}
            onOpenFile={handleOpenFile}
            onOpenTask={handleOpenTask}
          />

          <ChatInputBar
            onSendMessage={handleSendMessage}
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
            disabled={isStreaming}
          />
        </main>
      </div>

      {/* Column 3: Right Panel (Collapsible File Viewer & Task Output) */}
      <RightPanel
        isOpen={isRightPanelOpen}
        onClose={() => setIsRightPanelOpen(false)}
        activeTab={activeRightPanelTab}
        tabs={rightPanelTabs}
        onSelectTab={(tabId) => setActiveTabId(tabId)}
      />

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={(newS) => setSettings(newS)}
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
