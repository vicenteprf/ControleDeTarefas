import "dotenv/config";
import express, { type Express } from "express";
import cors from "cors";
import routes from "./routes/routes.ts";

class App {
  public server: Express;

  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  private middlewares() {
    this.server.use(
      cors({
        origin: "http://localhost:5173",
      }),
    );

    this.server.use(express.json());
  }

  private routes() {
    this.server.use(routes);
  }
}

export default new App().server;
