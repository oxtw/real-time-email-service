import prismaClient from "../../prisma";

interface UserRequest {
  username: string;
  email: string;
  password: string;
}

class CreateUserService {
  async execute({ username, email, password }: UserRequest) {
    return { username: username };
  }
}

export { CreateUserService };
