import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";
import cors from "cors";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import { router } from "./routes";

const app = express();
app.use(express.json());
app.use(cors());
app.use(router);

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'none'; connect-src 'self' ws://localhost:3000");
  next();
});

const server = createServer(app);  // Cria o servidor HTTP
const io = new Server(server, {
  cors: {
    origin: "*",  // Permite conexões de qualquer origem
  },
});

// Armazena os sockets dos usuários
const userSockets: { [userId: string]: string } = {};

// Escuta conexões WebSocket
io.on("connection", (socket) => {
  console.log(`Novo cliente conectado: ${socket.id}`);

  // Recebe o ID do usuário
  socket.on("register", (userId: string) => {
    userSockets[userId] = socket.id;  // Associa o ID do usuário ao socket
    console.log(`Usuário ${userId} registrado com socket ID ${socket.id}`);
  });

  // Envia uma notificação para um usuário específico
  socket.on("send_notification", (userId: string, message: string) => {
    const userSocketId = userSockets[userId];
    if (userSocketId) {
      io.to(userSocketId).emit("notification", message);  // Envia a notificação
    }
  });

  // Escuta quando o cliente se desconecta
  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);
    // Remove o usuário do registro
    for (let userId in userSockets) {
      if (userSockets[userId] === socket.id) {
        delete userSockets[userId];
        break;
      }
    }
  });
});

// Middleware de erro
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    return res.status(400).json({
      error: err.message,
    });
  }
  return res.status(500).json({
    status: "error",
    message: "Internal server error.",
  });
});

server.listen(3000, () => console.log("Http Server Running 🚀"));
