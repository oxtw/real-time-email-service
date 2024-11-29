import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";
import cors from "cors";
import { createServer } from "http";
import { router } from "./routes";
import { initWebSocket } from "./websocket/websocket";


const app = express();
app.use(express.json());
app.use(cors());
app.use(router);

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

// Cria o servidor HTTP
const serverExpress = createServer(app); 
serverExpress.listen(3001, () => console.log("Http Server Running 🚀"));

// Inicializa o WebSocket em uma porta separada (8080)
initWebSocket(8080);



