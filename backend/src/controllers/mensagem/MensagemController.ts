import { Request, Response } from "express";
import { MensagemService } from "../../services/mensagem/MensagemService";
import { sendNotification } from "../../websocket/websocket";

class MensagemController {
  // Método para enviar uma nova mensagem
  async enviar(req: Request, res: Response) {
    // Obtendo dados da requisição
    const { destinatarioId, titulo, corpo } = req.body;
    const remetenteId = req.user_id; // ID do usuário autenticado (remetente)

    // Instanciando o serviço responsável por mensagens
    const mensagemService = new MensagemService();

    // Enviando a mensagem e salvando no banco de dados
    const mensagem = await mensagemService.enviarMensagem({
      remetenteId,
      destinatarioId,
      titulo,
      corpo,
    });

    // Envia uma notificação em tempo real para o destinatário via WebSocket
    sendNotification(
      destinatarioId,
      `Nova mensagem de ${remetenteId}: ${titulo}`
    );

    // Retornando a mensagem criada com status HTTP 201
    return res.status(201).json(mensagem);
  }

  // Método para listar todas as mensagens recebidas (inbox)
  async inbox(req: Request, res: Response) {
    const userId = req.user_id; // ID do usuário autenticado (destinatário)

    // Instanciando o serviço responsável por mensagens
    const mensagemService = new MensagemService();

    // Obtendo as mensagens recebidas ordenadas pela data de envio
    const mensagens = await mensagemService.listarInbox(userId);

    // Retornando a lista de mensagens recebidas
    return res.json(mensagens);
  }

  // Método para listar todas as mensagens enviadas (outbox)
  async outbox(req: Request, res: Response) {
    const userId = req.user_id; // ID do usuário autenticado (remetente)

    // Instanciando o serviço responsável por mensagens
    const mensagemService = new MensagemService();

    // Obtendo as mensagens enviadas ordenadas pela data de envio
    const mensagens = await mensagemService.listarOutbox(userId);

    // Retornando a lista de mensagens enviadas
    return res.json(mensagens);
  }

  // Método para marcar uma mensagem como lida
  async marcarLida(req: Request, res: Response) {
    const { mensagemId } = req.params; // ID da mensagem
    const { estaLida } = req.body; // ID da mensagem

    console.log( 'Teste',req.body)

    const mensagemService = new MensagemService();

    // ID do usuário autenticado (destinatário)
    const userId = req.user_id;

    // Atualiza o status da mensagem para "lida"
    const mensagem = await mensagemService.marcarComoLida(mensagemId, userId, estaLida);

    // Após marcar como lida, contar as mensagens não lidas
    const mensagensNaoLidas = await mensagemService.contarMensagensNaoLidas(
      mensagem.idDestinatario
    );

    // Envia a notificação de contagem de mensagens não lidas via WebSocket
    sendNotification(
      mensagem.idDestinatario,
      `Você tem ${mensagensNaoLidas} mensagens não lidas.`
    );

    return res.json(mensagem);
  }

  async contarNaoLidas(req: Request, res: Response) {
    const userId = req.user_id; // Ou o ID do usuário autenticado
    const mensagemService = new MensagemService();
    const mensagensNaoLidas = await mensagemService.contarMensagensNaoLidas(
      userId
    );

    sendNotification(
      userId,
      `Você tem ${mensagensNaoLidas} mensagens não lidas.`
    );
    
    return res.json({ mensagensNaoLidas });
  }
}

export { MensagemController };
