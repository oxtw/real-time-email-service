import { Request, Response } from "express";
import { DetailUserService } from "../../services/user/DetailUserService";

class DetailUserController {
  // Método para obter detalhes do usuário
  async handle(req: Request, res: Response) {
    // Extraindo o ID do usuário da requisição 
    const user_id = req.user_id;

    // Iniciando o serviço que irá buscar os detalhes do usuário
    const detailUserService = new DetailUserService();

    // Chamando o serviço para obter os dados do usuário
    const user = await detailUserService.execute(user_id);

    // Retornando os detalhes do usuário como resposta da requisição
    return res.json(user);
  }
}

export { DetailUserController };
