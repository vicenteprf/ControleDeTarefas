import { Router } from "express";

import authMiddleware from "../middlewares/auth.ts";

import UserController from "../controllers/UserController.ts";
import SessionController from "../controllers/SessionController.ts";
import TaskControllers from "../controllers/TaskController.ts";

const routes = Router();

routes.post("/users", UserController.create);

routes.post("/password/forgot", UserController.forgotPassword);

routes.post("/sessions", SessionController.store);

// As rotas abaixo exigem autenticação
routes.use(authMiddleware);

routes.get("/tasks", TaskControllers.index);

routes.post("/task", TaskControllers.store);

routes.put("/task/:id", TaskControllers.update);

routes.delete("/task/:id", TaskControllers.delete);

export default routes;
