import prismaClient from "../../prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

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

    const token = sign(
      {
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: '30d'
      }
    );

    return {
        id: user.id,
        username: user.username,
        email: user.email,
        token: token,
    };
  }
}

export { AuthUserService };
