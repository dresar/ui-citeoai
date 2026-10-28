export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

export interface WSMessage {
  type: string;
  session_id?: string;
  project?: string;
  content?: string;
  prompt?: string;
  model?: string;
  delta?: string;
  name?: string;
  args?: string;
  output?: string;
  success?: boolean;
  final_text?: string;
  error?: string;
  projects?: string[];
  sessions?: any[];
}

export type WSHandler = (msg: WSMessage) => void;
export type StatusHandler = (status: ConnectionStatus) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private handlers: Set<WSHandler> = new Set();
  private statusHandlers: Set<StatusHandler> = new Set();
  private status: ConnectionStatus = 'disconnected';
  private reconnectTimer: any = null;

  constructor() {
    this.connect();
  }

  public getStatus(): ConnectionStatus {
    return this.status;
  }

  public subscribe(handler: WSHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  public onStatusChange(handler: StatusHandler): () => void {
    this.statusHandlers.add(handler);
    handler(this.status);
    return () => this.statusHandlers.delete(handler);
  }

  private setStatus(newStatus: ConnectionStatus) {
    if (this.status !== newStatus) {
      this.status = newStatus;
      this.statusHandlers.forEach((h) => h(newStatus));
    }
  }

  public connect() {
    if (this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    if (typeof window === 'undefined') return;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.setStatus('connecting');
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host || 'localhost:8088';
    const url = `${protocol}//${host}/ws`;

    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.setStatus('connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const data: WSMessage = JSON.parse(event.data);
          this.handlers.forEach((h) => h(data));
        } catch {
          // Ignore non-json payload
        }
      };

      this.ws.onerror = () => {
        this.setStatus('disconnected');
      };

      this.ws.onclose = () => {
        this.ws = null;
        this.setStatus('disconnected');
        this.scheduleReconnect();
      };
    } catch {
      this.setStatus('disconnected');
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, 3000);
  }

  public send(msg: WSMessage): boolean {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
      return true;
    } else {
      this.handlers.forEach((h) =>
        h({
          type: 'error',
          session_id: msg.session_id,
          error: 'WebSocket is not connected. Reconnecting to CITEOAI backend...',
        })
      );
      this.connect();
      return false;
    }
  }
}

export const wsService = new WebSocketService();
