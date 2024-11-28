import { Request, Response } from "express";
import { CreateUserService } from "../../services/user/CreateUserService";

class CreateUserController {
  // Método para criar um novo usuário
  async createUser(req: Request, res: Response) {
    // Extraindo dados do corpo da requisição
    const { username, email, password } = req.body;

    // Instanciando o serviço responsável pela criação de usuários
    const createUserService = new CreateUserService();

    // Chamando o método de criação e passando os dados do usuário
    const user = await createUserService.execute({
      username,
      email,
      password,
    });

    // Retornando o usuário criado com status HTTP 201
    return res.status(201).json(user);
  }
}

export { CreateUserController };
