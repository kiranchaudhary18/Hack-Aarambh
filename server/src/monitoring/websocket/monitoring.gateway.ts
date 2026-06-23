import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MonitoringEvents } from './events';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/monitoring',
})
export class MonitoringGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private connectedClients: Set<Socket> = new Set();

  handleConnection(client: Socket) {
    this.connectedClients.add(client);
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client);
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage(MonitoringEvents.SUBSCRIBE_METRICS)
  handleSubscribeMetrics(client: Socket) {
    // Client subscribes to real-time metrics updates
    client.emit('subscribed', { message: 'Subscribed to metrics updates' });
  }

  @SubscribeMessage(MonitoringEvents.UNSUBSCRIBE_METRICS)
  handleUnsubscribeMetrics(client: Socket) {
    // Client unsubscribes from real-time metrics updates
    client.emit('unsubscribed', { message: 'Unsubscribed from metrics updates' });
  }

  // Broadcast metrics to all connected clients
  broadcastMetrics(type: string, data: any) {
    this.server.emit(MonitoringEvents.METRICS_UPDATE, { type, data, timestamp: new Date() });
  }

  // Broadcast alerts to all connected clients
  broadcastAlert(alert: any) {
    this.server.emit(MonitoringEvents.ALERT, alert);
  }

  getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }
}
