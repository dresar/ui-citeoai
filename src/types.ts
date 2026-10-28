export interface Project {
  id: string;
  name: string;
  icon?: string;
  sessions: Session[];
}

export interface Session {
  id: string;
  projectId: string;
  title: string;
  updatedAt: string;
  relativeTime: string;
  hasActiveDot?: boolean;
  isPinned?: boolean;
  isArchived?: boolean;
  messages: ChatMessage[];
}

export interface ExecutionStep {
  id: string;
  type: 'file_command' | 'file_analysis' | 'thought' | 'terminal' | 'generic' | 'timer' | 'tool';
  title: string;
  subtitle?: string;
  duration?: string;
  expanded?: boolean;
  file?: string;
  lines?: string;
  command?: string;
  workdir?: string;
  output?: string;
  exitCode?: number;
  thoughtContent?: string;
  status: 'running' | 'success' | 'failed';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  thought?: string;
  images?: string[];
  steps?: ExecutionStep[];
  error?: string;
}

export interface ModelOption {
  id: string;
  name: string;
  provider: string;
  tag?: string;
  badge?: 'Notice' | 'Unavailable' | string;
  disabled?: boolean;
}

export interface SlashCommand {
  command: string;
  label: string;
  description: string;
}

export interface SystemSettings {
  apiKey: string;
  model: string;
  provider: 'gemini' | 'openai' | 'anthropic' | 'ollama';
  systemPrompt: string;
  sandboxMode: 'isolated' | 'full_vps';
  autoRotation: boolean;
  temperature: number;
}

export interface RightPanelTab {
  id: string;
  type: 'task' | 'file';
  title: string;
  subtitle?: string;
  filePath?: string;
  fileContent?: string;
  taskTitle?: string;
  taskLogs?: string;
}
