import "express";

declare module "express-serve-static-core" {
  interface Request {
    userId: string;
  }
}

export declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
