import express, { Express } from "express";

class App {
  public server: Express;

  constructor() {
    this.server = express();
  }
}

export default new App().server;
