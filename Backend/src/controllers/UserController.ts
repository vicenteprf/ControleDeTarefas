import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

class UserController {
  async create(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const userExist = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userExist) {
      return res.status(400).json({ error: "Este email já esta cadastrado." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "A senha deve conter no mínimo 10 caracteres." });
    }

    const hashedPassword = await bcrypt.hash(password, 6);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json(userWithoutPassword);
  }
}

export default new UserController();
