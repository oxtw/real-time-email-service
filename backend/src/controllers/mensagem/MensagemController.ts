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
    const { mensagemId } = req.params; // Obtendo o ID da mensagem nos parâmetros da URL

    // Instanciando o serviço responsável por mensagens
    const mensagemService = new MensagemService();

    // Atualizando o status da mensagem para "lida" no banco de dados
    const mensagem = await mensagemService.marcarComoLida(mensagemId);

    // Retornando a mensagem atualizada
    return res.json(mensagem);
  }
}

export { MensagemController };
