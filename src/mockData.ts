import { Project, ModelOption, SlashCommand, SystemSettings } from './types';

export const INITIAL_MODELS: ModelOption[] = [
  { id: 'gemini-3.8-flash-high', name: 'Gemini 3.8 Flash High', provider: 'Google', tag: 'Recommended' },
  { id: 'gemini-3.6-flash', name: 'Gemini 3.6 Flash', provider: 'Google', tag: 'Fast' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', tag: 'Pro' },
  { id: 'ollama-local', name: 'Ollama', provider: 'Local', tag: 'Offline' },
];

export const SLASH_COMMANDS: SlashCommand[] = [
  { command: '/learn', label: 'Learn', description: 'Persist patterns & corrections to memory' },
  { command: '/teamwork', label: 'Teamwork', description: 'Coordinate multi-agent swarms' },
  { command: '/boost', label: 'Boost', description: 'Deep strategic planning & multi-turn reasoning' },
  { command: '/model', label: 'Model', description: 'Switch active LLM provider endpoint' },
  { command: '/new', label: 'New', description: 'Start fresh agent session' },
  { command: '/clear', label: 'Clear', description: 'Clear current conversation messages' },
  { command: '/reset', label: 'Reset', description: 'Reset memory & context buffer' },
  { command: '/compact', label: 'Compact', description: 'Summarize context tokens' },
  { command: '/memory', label: 'Memory', description: 'Inspect agent state & memory cache' },
  { command: '/stats', label: 'Stats', description: 'Show latency & token metrics' },
  { command: '/help', label: 'Help', description: 'Display commands guide' },
];

export const DEFAULT_SETTINGS: SystemSettings = {
  apiKey: '',
  model: 'gemini-3.8-flash-high',
  provider: 'gemini',
  systemPrompt: 'You are CITEOAI autonomous remote control assistant. Execute tasks with utmost accuracy and speed.',
  sandboxMode: 'isolated',
  autoRotation: true,
  temperature: 0.2,
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_citeoai',
    name: 'CITEOAI',
    sessions: [
      {
        id: 'sess_default',
        projectId: 'proj_citeoai',
        title: 'Main Session',
        updatedAt: new Date().toISOString(),
        relativeTime: 'now',
        messages: [],
      },
    ],
  },
];
