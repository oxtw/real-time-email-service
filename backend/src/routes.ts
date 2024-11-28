import { Router } from "express";

import { CreateUserController } from "./controllers/user/CreateUserController";

const router = Router();

//ROTAS USER
router.post("/users", new CreateUserController().createUser);

export { router };
