import WebSocket, { WebSocketServer } from "ws";
import prismaClient from "../prisma";

// Mapeamento de usuários conectados
export const connectedUsers = new Map<string, WebSocket>();

// Função para enviar notificações a um cliente específico
export const sendNotification = async (user_id: string, message: string) => {
  // Consulta ao banco de dados para obter o nome de usuário
  const user = await prismaClient.user.findUnique({
    where: { id: user_id },
    select: { username: true }, // Selecionando apenas o campo 'username'
  });

  if (!user) {
    console.log(`Usuário com ID ${user_id} não encontrado.`);
    return;
  }

  const socket = connectedUsers.get(user_id);

  if (socket && socket.readyState === WebSocket.OPEN) {
    // Substituindo o ID pelo nome de usuário na mensagem
    const notificationMessage = message.replace(new RegExp(user_id, 'g'), user.username);

    socket.send(JSON.stringify({ notification: notificationMessage }));
  } else {
    console.log(
      `O socket para o usuário ${user_id} não está disponível ou não está aberto.`
    );
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
