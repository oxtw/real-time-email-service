import prismaClient from "../../prisma";

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

    if (userAlreadyExists) {
      throw new Error("O usuário já existe.");
    }

    const user = await prismaClient.user.create({
      data: {
        username: username,
        email: email,
        password: password,
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
