import { Router } from "express";

import { CreateUserController } from "./controllers/user/CreateUserController";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { DetailUserController } from "./controllers/user/DetailUserController";

import { MensagemController } from "./controllers/mensagem/MensagemController";

import { isAuthenticated } from "./middlewares/isAuthenticated";

const router = Router();

//--ROTAS USER--
router.post("/users", new CreateUserController().createUser);

router.post("/session", new AuthUserController().authUser);

router.get("/me", isAuthenticated, new DetailUserController().handle);

//--ROTAS MENSAGENS--

router.post("/mensagens", isAuthenticated, new MensagemController().enviar);

router.get('/mensagens/inbox', isAuthenticated, new MensagemController().inbox);

router.get("/mensagens/outbox", isAuthenticated, new MensagemController().outbox);

router.patch("/mensagens/:mensagemId", isAuthenticated, new MensagemController().marcarLida);

export { router };
