import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import authConfig from "../config/auth.ts";

const prisma = new PrismaClient();

class SessionControllers {
  async store(req: Request, res: Response) {
    const { email, password } = req.body;

    const userExist = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!userExist) {
      return res
        .status(401)
        .json({ error: "Este  email não esta cadastrado." });
    }

    const isPasswordValid = await bcrypt.compare(password, userExist.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Senha inválida." });
    }

    const { id, name } = userExist;

    const token = jwt.sign({ id }, authConfig.secret as jwt.Secret, {
      expiresIn: authConfig.expiresIn as any,
    });

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token,
    });
  }
}

export default new SessionControllers();
