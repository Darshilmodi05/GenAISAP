import { Server } from 'socket.io';
import { createClient } from '@/lib/supabase/server';
import { logInfo, logError } from '@/lib/error-handler';

export class WebSocketManager {
  private io: Server;
  private connectedClients: Map<string, any> = new Map();

  constructor(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? process.env.NEXT_PUBLIC_APP_URL 
          : ["http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket) => {
      this.handleConnection(socket);
      
      socket.on('disconnect', () => {
        this.handleDisconnection(socket);
      });

      socket.on('error', (error: any) => {
        logError(new Error('WebSocket error'), { 
          socketId: socket.id, 
          error: error?.message 
        });
      });
    });
  }

  private async handleConnection(socket: any): Promise<void> {
    try {
      // Authenticate the socket connection
      const token = socket.handshake.auth.token;
      if (!token) {
        socket.emit('error', { message: 'Authentication required' });
        socket.disconnect();
        return;
      }

      // Verify token with Supabase
      const supabase = await createClient();
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        socket.emit('error', { message: 'Invalid authentication token' });
        socket.disconnect();
        return;
      }

      // Store connected client
      this.connectedClients.set(socket.id, {
        userId: user.id,
        tenantId: user.user_metadata?.tenant_id || 'default',
        socket,
        connectedAt: new Date(),
      });

      // Join tenant-specific room
      const tenantRoom = `tenant_${user.user_metadata?.tenant_id || 'default'}`;
      socket.join(tenantRoom);

      // Join user-specific room
      const userRoom = `user_${user.id}`;
      socket.join(userRoom);

      // Send welcome message
      socket.emit('authenticated', {
        userId: user.id,
        tenantId: user.user_metadata?.tenant_id || 'default',
        message: 'Connected to real-time updates',
      });

      // Notify other clients in tenant about new connection
      socket.to(tenantRoom).emit('user_connected', {
        userId: user.id,
        timestamp: new Date().toISOString(),
      });

      logInfo('WebSocket client connected', {
        socketId: socket.id,
        userId: user.id,
        tenantId: user.user_metadata?.tenant_id || 'default',
      });
    } catch (error: any) {
      logError(new Error('WebSocket connection error'), { 
        socketId: socket.id, 
        error: error?.message 
      });
      socket.disconnect();
    }
  }

  private handleDisconnection(socket: any): void {
    try {
      const clientInfo = this.connectedClients.get(socket.id);
      
      if (clientInfo) {
        // Leave rooms
        const tenantRoom = `tenant_${clientInfo.tenantId}`;
        const userRoom = `user_${clientInfo.userId}`;
        socket.leave(tenantRoom);
        socket.leave(userRoom);

        // Notify other clients about disconnection
        socket.to(tenantRoom).emit('user_disconnected', {
          userId: clientInfo.userId,
          timestamp: new Date().toISOString(),
        });

        // Remove from connected clients
        this.connectedClients.delete(socket.id);

        logInfo('WebSocket client disconnected', {
          socketId: socket.id,
          userId: clientInfo.userId,
          tenantId: clientInfo.tenantId,
        });
      }
    } catch (error: any) {
      logError(new Error('WebSocket disconnection error'), { 
        socketId: socket.id, 
        error: error?.message 
      });
    }
  }

  // Broadcasting methods
  public broadcastToTenant(tenantId: string, event: string, data: any): void {
    const room = `tenant_${tenantId}`;
    this.io.to(room).emit(event, {
      data,
      timestamp: new Date().toISOString(),
    });
  }

  public broadcastToUser(userId: string, event: string, data: any): void {
    const room = `user_${userId}`;
    this.io.to(room).emit(event, {
      data,
      timestamp: new Date().toISOString(),
    });
  }

  public broadcastToAll(event: string, data: any): void {
    this.io.emit(event, {
      data,
      timestamp: new Date().toISOString(),
    });
  }

  // Real-time events for different features
  public notifyDashboardUpdate(tenantId: string, metrics: any): void {
    this.broadcastToTenant(tenantId, 'dashboard_update', metrics);
  }

  public notifyChatMessage(tenantId: string, message: any): void {
    this.broadcastToTenant(tenantId, 'new_message', message);
  }

  public notifyJobStatusUpdate(userId: string, jobData: any): void {
    this.broadcastToUser(userId, 'job_update', jobData);
  }

  public notifySystemAlert(tenantId: string, alert: any): void {
    this.broadcastToTenant(tenantId, 'system_alert', alert);
  }

  // Get connection statistics
  public getConnectionStats(): {
    totalConnections: number;
    connectionsByTenant: Record<string, number>;
  } {
    const connectionsByTenant: Record<string, number> = {};
    
    this.connectedClients.forEach((client) => {
      const tenantId = client.tenantId;
      connectionsByTenant[tenantId] = (connectionsByTenant[tenantId] || 0) + 1;
    });

    return {
      totalConnections: this.connectedClients.size,
      connectionsByTenant,
    };
  }

  // Clean up disconnected clients
  public cleanup(): void {
    this.connectedClients.forEach((client, socketId) => {
      if (client.socket.disconnected) {
        this.connectedClients.delete(socketId);
      }
    });
  }
}

// Singleton instance
let wsManager: WebSocketManager | null = null;

export function getWebSocketManager(server?: any): WebSocketManager {
  if (!wsManager && server) {
    wsManager = new WebSocketManager(server);
  }
  return wsManager!;
}
