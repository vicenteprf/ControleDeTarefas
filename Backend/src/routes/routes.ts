import { Router } from "express";
import UserController from "../controllers/UserController.ts";
import SessionController from "../controllers/SessionController.ts";

const routes = Router();

routes.post("/users", UserController.create);

routes.post("/sessions", SessionController.store);

export default routes;
