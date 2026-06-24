import { Router } from "express";

import authMiddleware from "../middlewares/auth.ts";

import UserController from "../controllers/UserController.ts";
import SessionController from "../controllers/SessionController.ts";
import TaskControllers from "../controllers/TaskController.ts";

const routes = Router();

routes.post("/users", UserController.create);

routes.post("/sessions", SessionController.store);

// Todas rotas abaixo desse middleware precisa estar autenticado
routes.use(authMiddleware);

routes.get("/task", TaskControllers.index);

routes.post("/task", TaskControllers.store);

export default routes;
