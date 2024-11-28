import prismaClient from "../../prisma";

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
