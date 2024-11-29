import prismaClient from "../../prisma";
import { connectedUsers } from "../../websocket/websocket";

interface MensagemRequest {
  remetenteId: string;
  destinatarioId: string;
  titulo: string;
  corpo: string;
}

class MensagemService {
  async enviarMensagem({
    remetenteId,
    destinatarioId,
    titulo,
    corpo,
  }: MensagemRequest) {
    const mensagem = await prismaClient.mensagem.create({
      data: {
        idRemetente: remetenteId,
        idDestinatario: destinatarioId,
        titulo,
        corpo,
      },
    });

    // Envia a mensagem em tempo real ao destinatário, se estiver conectado
    const socket = connectedUsers.get(destinatarioId);
    if (socket && socket.readyState === 1) {
      // 1 é o valor de WebSocket.OPEN
      console.log("Enviando mensagem em tempo real para:", destinatarioId);
      socket.send(
        JSON.stringify({
          type: "message", // Definindo o tipo como "message"
          remetenteId,
          titulo,
          corpo,
        })
      );
    } else {
      console.log(
        `Usuário ${destinatarioId} não está conectado ou o socket não está aberto.`
      );
    }

    return mensagem;
  }

  async listarInbox(destinatarioId: string) {
    const mensagens = await prismaClient.mensagem.findMany({
      where: {
        idDestinatario: destinatarioId,
      },
      orderBy: {
        dataEnvio: "desc",
      },
    });
    return mensagens;
  }

  async listarOutbox(remetenteId: string) {
    const mensagens = await prismaClient.mensagem.findMany({
      where: { idRemetente: remetenteId },
      orderBy: { dataEnvio: "desc" },
    });
    return mensagens;
  }

  async marcarComoLida(mensagemId: string) {
    const mensagens = await prismaClient.mensagem.update({
      where: { id: mensagemId },
      data: { estaLida: true },
    });
    return mensagens;
  }
}

export { MensagemService };