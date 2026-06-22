import express, { type Express } from "express";
import routes from "./routes.ts";

class App {
  public server: Express;

  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  private middlewares() {
    this.server.use(express.json());
  }

  private routes() {
    this.server.use(routes);
  }
}

export default new App().server;
