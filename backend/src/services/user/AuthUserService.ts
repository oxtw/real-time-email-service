import prismaClient from "../../prisma";
import { compare } from "bcryptjs";

interface AuthRequest {
  username: string;
  password: string;
}

class AuthUserService {
  async execute({ username, password }: AuthRequest) {
    //Verificar se o username já existe.
    const user = await prismaClient.user.findFirst({
      where: {
        username: username,
      },
    });
    if (!user) {
      throw new Error("Usuario ou senha incorretos.");
    }

    //Verificar se a senha que ele enviou está correta
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Usuario ou senha incorretos.");
    }

    //Gerar um token JWT e retornar os dados do usuario

    return { ok: true };
  }
}

export { AuthUserService };
