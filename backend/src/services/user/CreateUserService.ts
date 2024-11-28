import prismaClient from "../../prisma";
import { hash } from "bcryptjs";

interface UserRequest {
  username: string;
  email: string;
  password: string;
}

class CreateUserService {
  async execute({ username, email, password }: UserRequest) {
    //verificar se foi enviado um email
    if (!email) {
      throw new Error("Email incorreto");
    }

    //Verificar se este email já está cadastrado na plataforma
    const userAlreadyExists = await prismaClient.user.findFirst({
      where: {
        email: email,
      },
    });

    //Verificar se este nome de usuario já está cadastrado na plataforma
    const usernameAlreadyExists = await prismaClient.user.findFirst({
        where: {
          username: username,
        },
      });

    if (userAlreadyExists) {
      throw new Error("Nome de usuário ou email já existe.");
    }

    if (usernameAlreadyExists) {
      throw new Error("Nome de usuário ou email já existe.");
    }

    const passwordHash = await hash(password, 8)

    const user = await prismaClient.user.create({
      data: {
        username: username,
        email: email,
        password: passwordHash,
      },
      
      //utilizando select para escolher o que eu quero que retorne
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    return user;
  }
}

export { CreateUserService };
