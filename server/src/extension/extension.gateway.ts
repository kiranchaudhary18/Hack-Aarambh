import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ExtensionService } from "./extension.service";
import { JwtService } from "@nestjs/jwt";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class ExtensionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private connectedUsers = new Map<string, string>(); // userId -> socketId

  constructor(
    private extensionService: ExtensionService,
    private jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        client.disconnect();
        return;
      }

      const decoded = this.jwtService.verify(token);
      const userId = decoded.sub;

      this.connectedUsers.set(userId, client.id);
      client.join(`user:${userId}`);

      // Send unread notification count on connection
      const unreadCount = await this.extensionService.getUnreadCount(userId);
      client.emit("notifications:unread-count", { count: unreadCount });

      console.log(`Extension connected: userId=${userId}, socketId=${client.id}`);
    } catch (error) {
      console.error("WebSocket connection error:", error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // Remove user from connected users
    for (const [userId, socketId] of this.connectedUsers.entries()) {
      if (socketId === client.id) {
        this.connectedUsers.delete(userId);
        console.log(`Extension disconnected: userId=${userId}, socketId=${client.id}`);
        break;
      }
    }
  }

  @SubscribeMessage("extension:heartbeat")
  handleHeartbeat(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    const userId = this.getUserIdFromSocket(client);
    if (userId) {
      this.extensionService.updateDeviceLastSeen(userId, data.deviceInfo);
    }
    return { status: "ok" };
  }

  @SubscribeMessage("extension:settings-sync")
  handleSettingsSync(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { settings: any; deviceInfo?: any }
  ) {
    const userId = this.getUserIdFromSocket(client);
    if (userId) {
      return this.extensionService.updateSettings(userId, data.settings, data.deviceInfo);
    }
    return { error: "User not authenticated" };
  }

  @SubscribeMessage("extension:scan-complete")
  handleScanComplete(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {
      url: string;
      scanType: "url" | "text" | "email";
      result: any;
      pageTitle?: string;
      domain?: string;
    }
  ) {
    const userId = this.getUserIdFromSocket(client);
    if (userId) {
      return this.extensionService.createScan(userId, data);
    }
    return { error: "User not authenticated" };
  }

  // Helper methods for sending notifications from other parts of the application
  sendNotificationToUser(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit("notification:new", notification);
  }

  sendBadgeUpdate(userId: string, count: number) {
    this.server.to(`user:${userId}`).emit("notifications:unread-count", { count });
  }

  sendScamAlert(userId: string, alert: any) {
    this.server.to(`user:${userId}`).emit("scam:alert", alert);
  }

  sendPatternUpdate(userId: string, pattern: any) {
    this.server.to(`user:${userId}`).emit("pattern:update", pattern);
  }

  sendSecurityAlert(userId: string, alert: any) {
    this.server.to(`user:${userId}`).emit("security:alert", alert);
  }

  private getUserIdFromSocket(client: Socket): string | null {
    for (const [userId, socketId] of this.connectedUsers.entries()) {
      if (socketId === client.id) {
        return userId;
      }
    }
    return null;
  }
}
