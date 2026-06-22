import { Router } from "express";
import UserController from "../controllers/UserController.ts";

const routes = Router();

routes.post("/users", UserController.create);

export default routes;
