import { io, Socket } from "socket.io-client";

const WS_BASE_URL = import.meta.env.VITE_WS_URL || "http://localhost:3000";

class WebSocketClient {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(token: string) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(WS_BASE_URL, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
    });

    this.socket.on("connect", () => {
      console.log("WebSocket connected");
      this.reconnectAttempts = 0;
    });

    this.socket.on("disconnect", (reason: string) => {
      console.log("WebSocket disconnected:", reason);
    });

    this.socket.on("connect_error", (error: Error) => {
      console.error("WebSocket connection error:", error);
      this.reconnectAttempts++;
    });

    // Notification events
    this.socket.on("notification:new", (notification: any) => {
      console.log("New notification received:", notification);
      this.emit("notification:new", notification);
    });

    this.socket.on("notifications:unread-count", (data: any) => {
      console.log("Unread count updated:", data);
      this.emit("notifications:unread-count", data);
    });

    this.socket.on("scam:alert", (alert: any) => {
      console.log("Scam alert received:", alert);
      this.emit("scam:alert", alert);
    });

    this.socket.on("pattern:update", (pattern: any) => {
      console.log("Pattern update received:", pattern);
      this.emit("pattern:update", pattern);
    });

    this.socket.on("security:alert", (alert: any) => {
      console.log("Security alert received:", alert);
      this.emit("security:alert", alert);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: (...args: any[]) => void) {
    this.socket?.on(event, callback);
  }

  off(event: string, callback?: (...args: any[]) => void) {
    this.socket?.off(event, callback);
  }

  emit(event: string, data?: any) {
    this.socket?.emit(event, data);
  }

  sendHeartbeat(deviceInfo?: any) {
    this.emit("extension:heartbeat", { deviceInfo });
  }

  sendSettingsSync(settings: any, deviceInfo?: any) {
    this.emit("extension:settings-sync", { settings, deviceInfo });
  }

  sendScanComplete(scanData: any) {
    this.emit("extension:scan-complete", scanData);
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Event emitter for local event handling
class EventEmitter {
  private listeners: Map<string, Set<(...args: any[]) => void>> = new Map();

  on(event: string, callback: (...args: any[]) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback?: (...args: any[]) => void) {
    if (callback) {
      this.listeners.get(event)?.delete(callback);
    } else {
      this.listeners.delete(event);
    }
  }

  emit(event: string, data?: any) {
    this.listeners.get(event)?.forEach((callback) => callback(data));
  }
}

export const wsClient = new WebSocketClient();
export const eventEmitter = new EventEmitter();
