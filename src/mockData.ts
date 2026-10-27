import { Project, ModelOption, SlashCommand, SystemSettings, RightPanelTab } from './types';

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
  apiKey: '••••••••••••••••••••••••••••••••',
  model: 'gemini-3.8-flash-high',
  provider: 'gemini',
  systemPrompt: 'You are Antigravity autonomous system assistant. Execute tasks with utmost accuracy and speed.',
  sandboxMode: 'isolated',
  autoRotation: true,
  temperature: 0.2,
};

export const MOCK_SERVER_GO = `package web

import (
	"context"
	"fmt"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

type Server struct {
	addr       string
	upgrader   websocket.Upgrader
	clients    map[*websocket.Conn]bool
	broadcast  chan []byte
	mu         sync.RWMutex
	httpServer *http.Server
}

func NewServer(addr string) *Server {
	return &Server{
		addr: addr,
		upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		},
		clients:   make(map[*websocket.Conn]bool),
		broadcast: make(chan []byte, 256),
	}
}

func (s *Server) Start(ctx context.Context) error {
	mux := http.NewServeMux()
	mux.HandleFunc("/ws", s.handleWebSocket)
	mux.HandleFunc("/health", s.handleHealth)

	s.httpServer = &http.Server{
		Addr:         s.addr,
		Handler:      mux,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
	}

	go s.dispatchBroadcast(ctx)

	fmt.Printf("[SERVER] Listening on %s\\n", s.addr)
	return s.httpServer.ListenAndServe()
}

func (s *Server) handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := s.upgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, "Upgrade failed", http.StatusBadRequest)
		return
	}

	s.mu.Lock()
	s.clients[conn] = true
	s.mu.Unlock()

	defer func() {
		s.mu.Lock()
		delete(s.clients, conn)
		s.mu.Unlock()
		conn.Close()
	}()

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			break
		}
		s.broadcast <- message
	}
}

func (s *Server) handleHealth(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}

func (s *Server) dispatchBroadcast(ctx context.Context) {
	for {
		select {
		case <-ctx.Done():
			return
		case msg := <-s.broadcast:
			s.mu.RLock()
			for client := range s.clients {
				client.WriteMessage(websocket.TextMessage, msg)
			}
			s.mu.RUnlock()
		}
	}
}`;

export const MOCK_MAIN_GO = `package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"citeoai/internal/web"
)

func main() {
	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer cancel()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8088"
	}

	server := web.NewServer(fmt.Sprintf(":%s", port))
	log.Printf("[CITEOAI] Starting core engine on :%s ...", port)

	if err := server.Start(ctx); err != nil {
		log.Fatalf("Server shutdown error: %v", err)
	}
}`;

export const MOCK_MAIN_GO_PREVIEW = MOCK_MAIN_GO;

export const MOCK_TASK_OUTPUT = `[TASK agy02_1793131885] Status: RUNNING
Target: /opt/data/home/CITEOAI-agy02
Command: go run cmd/citeoai/main.go serve --port 8088
WebSocket Ingress: ws://127.0.0.1:8088/ws
Cloudflare Tunnel: https://citeoai.agentai.my.id -> http://127.0.0.1:8088

[TASK agy04_1793131862] Status: RUNNING
Target: /opt/data/home/ui-citeoai
Command: npm run build
Result: dist/index.html generated cleanly

2m timer: Timer has expired (120s)
Both background tasks dispatched successfully.`;

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_citeoai',
    name: 'CITEOAI',
    sessions: [
      {
        id: 'sess_citeoai_setup',
        projectId: 'proj_citeoai',
        title: 'CITEOAI Engine Implementation Setup',
        updatedAt: '2026-10-27T20:30:00Z',
        relativeTime: '3h',
        hasActiveDot: false,
        messages: [
          {
            id: 'msg_a1',
            role: 'assistant',
            content: `• **Repository Created**: [dresar/ui-citeoai](https://github.com/dresar/ui-citeoai) initialized with design specifications and mobile reference screenshots.
• **Cloudflare Route Configured**: Subdomain \`citeoai.agentai.my.id\` mapped via CNAME to tunnel \`40522112-be2a-4342-acba-eafef7659cb4\` with ingress target \`http://127.0.0.1:8088\`.
• **AGY04 (Frontend Owner)**: Task \`agy04_1793131862\` dispatched in \`/opt/data/home/ui-citeoai\` to build the mobile-first React/Vite/Tailwind dark dashboard, slash command popup, tool execution accordions, and static \`index.html\` build.
• **AGY02 (Backend Core Owner)**: Task \`agy02_1793131885\` dispatched in \`/opt/data/home/CITEOAI-agy02\` to implement \`internal/web/server.go\`, WebSocket streaming on \`/ws\`, and \`citeoai serve --port 8088\`.

A 120-second timer is active while both workers execute their tasks.`,
            timestamp: '3h ago',
            images: [
              'thumbnail_1',
              'thumbnail_2',
            ],
            steps: [
              {
                id: 'step_timer_expired',
                type: 'timer',
                title: '2m timer: Timer has expired',
                duration: '2m',
                status: 'success',
                output: MOCK_TASK_OUTPUT,
              },
              {
                id: 'step_worked_29s',
                type: 'generic',
                title: 'Worked for 29s',
                duration: '29s',
                status: 'success',
                output: `Compiled internal/web/server.go\nInitialized WebSocket endpoint on /ws\nConfigured CORS and ingress router for citeoai.agentai.my.id`,
              },
              {
                id: 'step_timed_2m',
                type: 'timer',
                title: 'Timed 2m',
                duration: '2m',
                status: 'success',
                output: MOCK_TASK_OUTPUT,
              },
            ],
          },
          {
            id: 'msg_u1',
            role: 'user',
            content: 'pppppp aneh kau ni  kenapa ad ake gitu aku tadi kasih contoh gambar loo astaga  terus di header profil dan lain lain  hapus feedbcak hapus',
            timestamp: 'Just now',
            images: ['user_attachment_1'],
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
        title: 'Remote Access Execution R...',
        updatedAt: '2026-10-22T10:00:00Z',
        relativeTime: '5d',
        hasActiveDot: false,
        messages: [
          {
            id: 'proskill_msg_1',
            role: 'assistant',
            content: 'Remote Access execution verified and configured for proskillai gateway.',
            timestamp: '5d ago',
          },
        ],
      },
      {
        id: 'sess_proskill_setup',
        projectId: 'proj_proskillai',
        title: 'Remote Control Setup...',
        updatedAt: '2026-10-22T08:00:00Z',
        relativeTime: '5d',
        isPinned: true,
        isArchived: true,
        hasActiveDot: false,
        messages: [
          {
            id: 'proskill_msg_2',
            role: 'assistant',
            content: 'Remote Control Daemon running on port 9090.',
            timestamp: '5d ago',
          },
        ],
      },
      {
        id: 'sess_proskill_gh',
        projectId: 'proj_proskillai',
        title: 'GitHub Repository Installat...',
        updatedAt: '2026-10-22T04:00:00Z',
        relativeTime: '5d',
        hasActiveDot: false,
        messages: [
          {
            id: 'proskill_msg_3',
            role: 'assistant',
            content: 'GitHub repository installation validated.',
            timestamp: '5d ago',
          },
        ],
      },
    ],
  },
  {
    id: 'proj_cli',
    name: 'CLI Project',
    sessions: [
      {
        id: 'sess_cli_net_test',
        projectId: 'proj_cli',
        title: 'Network Connection Test',
        updatedAt: '2026-10-26T14:00:00Z',
        relativeTime: '1d',
        hasActiveDot: true,
        messages: [
          {
            id: 'cli_msg_1',
            role: 'assistant',
            content: 'Ping test completed: 12ms latency, 0% packet loss.',
            timestamp: '1d ago',
          },
        ],
      },
      {
        id: 'sess_cli_greeting',
        projectId: 'proj_cli',
        title: 'Casual Greeting',
        updatedAt: '2026-10-25T11:00:00Z',
        relativeTime: '2d',
        hasActiveDot: true,
        messages: [
          {
            id: 'cli_msg_2',
            role: 'assistant',
            content: 'Hello! Antigravity system ready for task execution.',
            timestamp: '2d ago',
          },
        ],
      },
      {
        id: 'sess_cli_test_conv',
        projectId: 'proj_cli',
        title: 'Test Conversation',
        updatedAt: '2026-10-24T09:00:00Z',
        relativeTime: '3d',
        hasActiveDot: true,
        messages: [
          {
            id: 'cli_msg_3',
            role: 'assistant',
            content: 'Test conversation session initialized.',
            timestamp: '3d ago',
          },
        ],
      },
      {
        id: 'sess_cli_net_connect',
        projectId: 'proj_cli',
        title: 'Network Connectivity Test',
        updatedAt: '2026-10-23T18:00:00Z',
        relativeTime: '4d',
        hasActiveDot: true,
        messages: [
          {
            id: 'cli_msg_4',
            role: 'assistant',
            content: 'Ingress and egress routes verified across cluster nodes.',
            timestamp: '4d ago',
          },
        ],
      },
    ],
  },
];
