import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { getAllowedOrigins } from "./config/clientOrigins";

const userSocketMap = new Map<string, string>();

let io: SocketIOServer;

const extractToken = (value: unknown): string | undefined => {
  if (!value) return undefined;
  if (Array.isArray(value)) return value[0];
  if (typeof value === "string") return value;
  return undefined;
};

const authenticateSocket = (socket: Socket, next: (err?: Error) => void) => {
  const tokenHeader = extractToken(socket.handshake.headers.token);
  const authHeader = extractToken(socket.handshake.headers.authorization);
  const authToken = extractToken((socket.handshake.auth as any)?.token);
  const queryToken = extractToken((socket.handshake.query as any)?.token);

  const rawToken = authToken || queryToken || tokenHeader || authHeader;
  const actualToken = rawToken?.startsWith("Bearer ")
    ? rawToken.slice(7)
    : rawToken;

  if (!actualToken) {
    return next(new Error("Authentication failed: No token provided."));
  }

  try {
    const tokenSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!tokenSecret) {
      return next(new Error("Authentication failed: Token secret is not configured."));
    }

    const decoded = jwt.verify(
      actualToken,
      tokenSecret,
    ) as any;

    if (!decoded?._id) {
      return next(new Error("Authentication failed: Invalid token payload."));
    }

    (socket as any).userId = decoded._id.toString();
    (socket as any).userRole = decoded.role;
    return next();
  } catch (error) {
    return next(new Error("Authentication failed: Invalid token."));
  }
};

export const initSocket = (server: HttpServer) => {
  const allowedOrigins = getAllowedOrigins();

  io = new SocketIOServer(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
      methods: ["GET", "POST"],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    const userId = (socket as any).userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
    } else {
      socket.disconnect();
      return;
    }

    socket.on("disconnect", (reason) => {
      const disconnectUserId = (socket as any).userId;
      if (disconnectUserId) {
        userSocketMap.delete(disconnectUserId);
      }
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

export const emitToUser = (userId: string, event: string, data: any) => {
  const socketId = userSocketMap.get(userId.toString());
  if (socketId) {
    getIO().to(socketId).emit(event, data);
    return true;
  }
  return false;
};
