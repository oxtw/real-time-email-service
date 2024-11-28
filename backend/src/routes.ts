import { Router } from "express";

import { CreateUserController } from "./controllers/user/CreateUserController";
import { AuthUserController } from "./controllers/user/AuthUserController";

const router = Router();

//ROTAS USER
router.post("/users", new CreateUserController().createUser);

router.post("/session", new AuthUserController().authUser);

export { router };
