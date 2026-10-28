import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatHeader } from './components/ChatHeader';
import { ChatView } from './components/ChatView';
import { ChatInputBar } from './components/ChatInputBar';
import { RightPanel } from './components/RightPanel';
import { SettingsModal } from './components/SettingsModal';
import { NewSessionModal } from './components/NewSessionModal';
import { INITIAL_PROJECTS, DEFAULT_SETTINGS } from './mockData';
import { Project, Session, ChatMessage, ExecutionStep, SystemSettings, RightPanelTab } from './types';
import { wsService, ConnectionStatus, WSMessage } from './services/websocket';

export const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [activeSessionId, setActiveSessionId] = useState<string>('sess_default');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.8-flash-high');
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [isStreaming, setIsStreaming] = useState(false);

  // 3-Column Layout States
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  // Right Panel Tabs - starts clean and populated on demand
  const [rightPanelTabs, setRightPanelTabs] = useState<RightPanelTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');

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
      title: 'Main Session',
      updatedAt: new Date().toISOString(),
      relativeTime: 'now',
      messages: [],
    };

  const activeRightPanelTab =
    rightPanelTabs.find((t) => t.id === activeTabId) || null;

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

  const handleOpenTask = (taskTitle: string, taskLogs: string) => {
    const tabId = `tab_task_${taskTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
    setRightPanelTabs((prev) => {
      const existing = prev.find((t) => t.id === tabId);
      if (existing) {
        return prev.map((t) =>
          t.id === tabId
            ? { ...t, taskLogs: taskLogs || t.taskLogs }
            : t
        );
      }
      return [
        ...prev,
        {
          id: tabId,
          type: 'task',
          title: taskTitle.slice(0, 20) + (taskTitle.length > 20 ? '...' : ''),
          taskTitle,
          taskLogs,
        },
      ];
    });
    setActiveTabId(tabId);
    setIsRightPanelOpen(true);
  };

  const handleOpenFile = async (rawPath: string) => {
    const cleanPath = rawPath.replace(/[`#]/g, '').trim().split(' ')[0];
    if (!cleanPath) return;

    const tabId = `file_${cleanPath.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
    const filename = cleanPath.split('/').pop() || cleanPath;

    // Check if already in tabs
    const existing = rightPanelTabs.find((t) => t.id === tabId);
    if (existing) {
      setActiveTabId(tabId);
      setIsRightPanelOpen(true);
      return;
    }

    // Add placeholder tab with loading
    const newTab: RightPanelTab = {
      id: tabId,
      type: 'file',
      title: filename,
      filePath: cleanPath,
      fileContent: `Loading ${cleanPath}...`,
    };

    setRightPanelTabs((prev) => [...prev, newTab]);
    setActiveTabId(tabId);
    setIsRightPanelOpen(true);

    try {
      const res = await fetch(`/api/file?path=${encodeURIComponent(cleanPath)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'ok' && typeof data.content === 'string') {
          setRightPanelTabs((prev) =>
            prev.map((t) => (t.id === tabId ? { ...t, fileContent: data.content } : t))
          );
          return;
        } else {
          setRightPanelTabs((prev) =>
            prev.map((t) =>
              t.id === tabId
                ? { ...t, fileContent: `Failed to load file: ${data.error || 'File not found'}` }
                : t
            )
          );
        }
      } else {
        setRightPanelTabs((prev) =>
          prev.map((t) =>
            t.id === tabId
              ? { ...t, fileContent: `HTTP Error: ${res.status} ${res.statusText}` }
              : t
          )
        );
      }
    } catch (err: any) {
      setRightPanelTabs((prev) =>
        prev.map((t) =>
          t.id === tabId
            ? { ...t, fileContent: `Network Error: ${err?.message || 'Could not fetch file content'}` }
            : t
        )
      );
    }
  };

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
          case 'token':
          case 'delta': {
            lastMsg.content = (lastMsg.content || '') + (msg.delta || '');
            break;
          }

          case 'thought': {
            lastMsg.thought = (lastMsg.thought || '') + (msg.delta || msg.content || '');
            break;
          }

          case 'tool_start': {
            const stepId = `tool_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
            const stepTitle = msg.name ? `${msg.name} ${msg.args || ''}`.trim() : 'Tool Execution';
            steps.push({
              id: stepId,
              type: 'tool',
              title: stepTitle,
              command: msg.args,
              output: '',
              status: 'running',
            });
            break;
          }

          case 'tool_log':
          case 'tool_result': {
            const runningIndex = steps.map((s) => s.status).lastIndexOf('running');
            const targetStep = runningIndex >= 0 ? runningIndex : steps.length - 1;
            if (targetStep >= 0) {
              const updated = { ...steps[targetStep] };
              updated.output = (updated.output || '') + (msg.output || '');
              steps[targetStep] = updated;
            }
            break;
          }

          case 'tool_end': {
            const runningIndex = steps.map((s) => s.status).lastIndexOf('running');
            const targetStep = runningIndex >= 0 ? runningIndex : steps.length - 1;
            if (targetStep >= 0) {
              const updated = { ...steps[targetStep] };
              updated.status = msg.success !== false ? 'success' : 'failed';
              steps[targetStep] = updated;

              // Open right panel when tool finishes
              handleOpenTask(updated.title, updated.output || 'Execution complete.');
            }
            break;
          }

          case 'done': {
            if (msg.final_text) {
              lastMsg.content = msg.final_text;
            }
            setIsStreaming(false);
            break;
          }

          case 'error': {
            if (msg.error) {
              lastMsg.content = (lastMsg.content ? lastMsg.content + '\n\n' : '') + `⚠️ ${msg.error}`;
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
          relativeTime: 'now',
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
      timestamp: 'now',
    };

    const initialAssistantMessage: ChatMessage = {
      id: `ast_${Date.now()}`,
      role: 'assistant',
      content: '',
      timestamp: 'now',
      steps: [],
    };

    setProjects((prev) =>
      prev.map((p) => {
        const sIndex = p.sessions.findIndex((s) => s.id === activeSessionId);
        if (sIndex === -1) return p;

        const updatedSessions = [...p.sessions];
        updatedSessions[sIndex] = {
          ...p.sessions[sIndex],
          relativeTime: 'now',
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

  const handleCloseTab = (tabId: string) => {
    setRightPanelTabs((prev) => {
      const filtered = prev.filter((t) => t.id !== tabId);
      if (activeTabId === tabId) {
        setActiveTabId(filtered.length > 0 ? filtered[filtered.length - 1].id : '');
        if (filtered.length === 0) {
          setIsRightPanelOpen(false);
        }
      }
      return filtered;
    });
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
      relativeTime: 'now',
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
    <div className="flex h-screen w-full bg-[#0e0e11] text-[#f4f4f5] overflow-hidden antialiased font-sans">
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
        connectionStatus={connectionStatus}
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
        onCloseTab={handleCloseTab}
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
