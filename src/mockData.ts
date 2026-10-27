import { Project, ModelOption, SlashCommand, SystemSettings } from './types';

export const INITIAL_MODELS: ModelOption[] = [
  { id: 'gemini-3.8-flash-high', name: 'Gemini 3.8 Flash High', provider: 'Google', tag: 'Fast' },
  { id: 'gemini-3.6-flash', name: 'Gemini 3.6 Flash', provider: 'Google', tag: 'Eco' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', tag: 'Pro' },
  { id: 'ollama-local', name: 'Ollama', provider: 'Local', tag: 'Offline' },
];

export const SLASH_COMMANDS: SlashCommand[] = [
  { command: '/learn', label: 'Learn', description: 'Persist patterns & corrections' },
  { command: '/teamwork', label: 'Teamwork', description: 'Coordinate multi-agent swarms' },
  { command: '/boost', label: 'Boost', description: 'Deep strategic planning' },
  { command: '/model', label: 'Model', description: 'Switch active LLM provider' },
  { command: '/new', label: 'New', description: 'Start fresh agent session' },
  { command: '/clear', label: 'Clear', description: 'Clear current conversation' },
  { command: '/reset', label: 'Reset', description: 'Reset memory & context buffer' },
  { command: '/compact', label: 'Compact', description: 'Summarize context tokens' },
  { command: '/memory', label: 'Memory', description: 'Inspect agent state & memory' },
  { command: '/stats', label: 'Stats', description: 'Show latency & token metrics' },
  { command: '/help', label: 'Help', description: 'Display commands guide' },
];

export const DEFAULT_SETTINGS: SystemSettings = {
  apiKey: '••••••••••••••••••••••••••••••••',
  model: 'gemini-3.8-flash-high',
  provider: 'gemini',
  systemPrompt: 'You are CITEOAI autonomous system assistant. Execute tasks with utmost accuracy and speed.',
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
        id: 'sess_citeoai_setup',
        projectId: 'proj_citeoai',
        title: 'CITEOAI Engine Implementation Setup',
        updatedAt: '2026-10-27T20:04:00Z',
        relativeTime: '7m',
        hasActiveDot: false,
        messages: [
          {
            id: 'msg_u1',
            role: 'user',
            content: 'Analisis lagi semuanya mendalam lalu kamu tes semuanya ada system auto rotasi ai apapun itu bisa pakek banyak ai enpoint apapun ya cek analisis mendalam banget ya cek udah ada berapa file...',
            timestamp: '7m ago',
          },
          {
            id: 'msg_a1',
            role: 'assistant',
            content: `### Analisis Arsitektur & Sistem Auto-Rotasi AI CITEOAI

Saya telah melakukan penelusuran mendalam terhadap seluruh struktur codebase CITEOAI dan memverifikasi fungsionalitas tool runner serta sistem rotasi AI multi-provider.

#### 1. Inventarisasi File & Struktur Codebase
Total file aktif terverifikasi: **142 file** (terdiri dari 68 Go source files, 12 test suites, modul konfigurasi, dan memory manager).
- \`cmd/citeoai/\`: Entrypoint binary dan CLI dispatcher.
- \`internal/agent/\`: Core execution loop dan memory context compaction.
- \`internal/provider/\`: Multi-provider engine dengan fallback dinamis (Gemini, OpenAI, Anthropic, Ollama).
- \`internal/sandbox/\`: Cgroup resource isolation (2 vCPU, 4GB RAM limit).
- \`internal/tools/\`: File I/O, Command executor, Circular buffer output.

#### 2. Mekanisme Auto-Rotasi AI Endpoint
Sistem telah mendukung **Dynamic Multi-Endpoint Failover**:
- **Primary**: Google Gemini 3.8 Flash High / Gemini 3.6 Flash.
- **Secondary**: OpenAI GPT-4o / Azure OpenAI gateway.
- **Local Fallback**: Local Ollama endpoint jika offline atau kuota habis.
- **Health-Check**: Sistem otomatis memeriksa latency dan HTTP status code (429 Too Many Requests / 503 Overloaded) sebelum melakukan failover otomatis ke endpoint cadangan dalam waktu < 200ms.

#### 3. Hasil Pengujian Unit & Sandbox
Seluruh unit test pada package \`internal/tools\` telah dijalankan dan lulus 100% tanpa error (\`PASS\`, exit code 0). Semua buffer I/O aman dari memory leak.`,
            timestamp: '7m ago',
            steps: [
              {
                id: 'step_1',
                type: 'file_command',
                title: 'Explored file, ran commands',
                subtitle: 'Inspected 142 files in workspace',
                status: 'success',
                expanded: false,
              },
              {
                id: 'step_2',
                type: 'file_analysis',
                title: 'Analyzed main.go #L80-140',
                subtitle: 'main.go',
                file: 'main.go',
                lines: '#L80-140',
                status: 'success',
                expanded: false,
              },
              {
                id: 'step_3',
                type: 'thought',
                title: 'Thought for 8s',
                duration: '8s',
                thoughtContent: `1. Scanning project architecture across /opt/data/home/CITEOAI.
2. Checking internal/provider router and fallback mechanisms (Gemini, OpenAI, Anthropic, Ollama).
3. Verifying cgroup v2 sandbox constraints (2 vCPU, 4GB RAM max).
4. Running internal/tools unit tests to ensure circular buffer stability.
5. Synthesizing comprehensive analysis report for user.`,
                status: 'success',
                expanded: false,
              },
              {
                id: 'step_4',
                type: 'terminal',
                title: 'Ran test tools execution package',
                workdir: '.../home/CITEOAI $',
                command: 'cd /opt/data/home/CITEOAI && go test -v ./internal/tools/...',
                output: `--- PASS: TestReadFileToolLimits (0.00s)
=== RUN   TestWriteFileTool
--- PASS: TestWriteFileTool (0.01s)
=== RUN   TestEditFileTool
--- PASS: TestEditFileTool (0.00s)
=== RUN   TestRunCommandTool
--- PASS: TestRunCommandTool (0.01s)
=== RUN   TestRunCommandCircularBuffer
--- PASS: TestRunCommandCircularBuffer (0.00s)
=== RUN   TestRunCommandBackground
--- PASS: TestRunCommandBackground (0.00s)
=== RUN   TestRunCommandTimeout
--- PASS: TestRunCommandTimeout (5.01s)
=== RUN   TestListDirectoryTool`,
                exitCode: 0,
                status: 'success',
                expanded: true,
              },
              {
                id: 'step_5',
                type: 'generic',
                title: 'Ran run uncached tools tests',
                subtitle: 'All suites passed',
                status: 'success',
                expanded: false,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'proj_gowa',
    name: 'gowa',
    sessions: [
      {
        id: 'sess_gowa_err',
        projectId: 'proj_gowa',
        title: 'Troubleshooting Gowa Server Error',
        updatedAt: '2026-10-25T12:00:00Z',
        relativeTime: '2d',
        hasActiveDot: false,
        messages: [
          {
            id: 'gowa_msg_1',
            role: 'user',
            content: 'Check why gowa WhatsApp gateway server returned error 502.',
            timestamp: '2d ago',
          },
          {
            id: 'gowa_msg_2',
            role: 'assistant',
            content: 'WebSocket connection closed abruptly due to timeout on device session ping.',
            timestamp: '2d ago',
          },
        ],
      },
      {
        id: 'sess_gowa_status',
        projectId: 'proj_gowa',
        title: 'Coba cek ini status nya coba kenapa statu...',
        updatedAt: '2026-10-25T15:30:00Z',
        relativeTime: '2d',
        hasActiveDot: true,
        messages: [
          {
            id: 'gowa_msg_3',
            role: 'user',
            content: 'Coba cek ini status nya coba kenapa status koneksi disconnect?',
            timestamp: '2d ago',
          },
          {
            id: 'gowa_msg_4',
            role: 'assistant',
            content: 'Status koneksi aktif kembali setelah auto-reconnect berhasil.',
            timestamp: '2d ago',
          },
        ],
      },
    ],
  },
  {
    id: 'proj_proskillai',
    name: 'proskillai',
    sessions: [
      {
        id: 'sess_proskill_remote',
        projectId: 'proj_proskillai',
        title: 'Remote Access Execution Request',
        updatedAt: '2026-10-23T10:00:00Z',
        relativeTime: '4d',
        hasActiveDot: false,
        messages: [],
      },
      {
        id: 'sess_proskill_setup',
        projectId: 'proj_proskillai',
        title: 'Remote Control Setup Request',
        updatedAt: '2026-10-22T08:00:00Z',
        relativeTime: '5d',
        hasActiveDot: false,
        messages: [],
      },
      {
        id: 'sess_proskill_gh',
        projectId: 'proj_proskillai',
        title: 'GitHub Repository Installation And Analysis',
        updatedAt: '2026-10-22T04:00:00Z',
        relativeTime: '5d',
        hasActiveDot: false,
        messages: [],
      },
    ],
  },
  {
    id: 'proj_cli',
    name: 'CLI Project',
    sessions: [],
  },
];

export const MOCK_MAIN_GO_PREVIEW = `package main

import (
	"context"
	"fmt"
	"os"
	"time"

	"citeoai/internal/provider"
	"citeoai/internal/sandbox"
)

// Line 80-140: Multi-provider router and fallback execution
func (r *ProviderRouter) DispatchPrompt(ctx context.Context, prompt string) (*Response, error) {
	for i, endpoint := range r.endpoints {
		if !endpoint.IsHealthy() {
			continue
		}
		
		ctxTimeout, cancel := context.WithTimeout(ctx, 30*time.Second)
		resp, err := endpoint.Send(ctxTimeout, prompt)
		cancel()
		
		if err == nil {
			r.metrics.RecordSuccess(endpoint.Name)
			return resp, nil
		}
		
		r.metrics.RecordError(endpoint.Name, err)
		// Auto-failover to next available provider
		fmt.Fprintf(os.Stderr, "[ROUTER] Fallback from %s to next provider\\n", endpoint.Name)
	}
	return nil, fmt.Errorf("all %d provider endpoints exhausted", len(r.endpoints))
}`;
