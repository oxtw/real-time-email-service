import WebSocket, { WebSocketServer } from "ws";

// Mapeamento de usuários conectados
export const connectedUsers = new Map<string, WebSocket>();

// Função para enviar notificações a um cliente específico
export const sendNotification = (user_id: string, message: string) => {
  const socket = connectedUsers.get(user_id);
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ notification: message }));
  }
};

// Configuração do servidor WebSocket
export const initWebSocket = (port: number) => {
  const wss = new WebSocketServer({ port });

  console.log(`Servidor WebSocket rodando na porta ${port}.`);

  wss.on("connection", (socket: WebSocket, req) => {
    const params = new URLSearchParams(req.url?.substring(1));
    const user_id = params.get("user_id");

    if (!user_id) {
      console.log("Conexão recusada: user_id não fornecido.");
      socket.close();
      return;
    }

    connectedUsers.set(user_id, socket);
    console.log(`Usuário ${user_id} conectado.`);

    socket.send(JSON.stringify({ message: "Conexão WebSocket estabelecida!" }));

    socket.on("message", (data) => {
      console.log(`Mensagem recebida de ${user_id}: ${data}`);
    });

    socket.on("close", () => {
      console.log(`Usuário ${user_id} desconectado.`);
      connectedUsers.delete(user_id);
    });
  });
};
