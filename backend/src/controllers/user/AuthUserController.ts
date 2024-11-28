import { Request, Response } from "express";
import { AuthUserService } from "../../services/user/AuthUserService";

class AuthUserController {

  // Método para autenticar o usuário
  async authUser(req: Request, res: Response) {
    
    // Obtendo as credenciais do corpo da requisição
    const { username, password } = req.body;

    // Instanciando o serviço responsável pela autenticação
    const authUserService = new AuthUserService();

    // Chamando o método de autenticação e passando as credenciais
    const auth = await authUserService.execute({
      username,
      password,
    });

    // Retornando o token gerado e informações do usuário autenticado com status HTTP 200
    return res.status(200).json(auth);
  }
}

export { AuthUserController };
