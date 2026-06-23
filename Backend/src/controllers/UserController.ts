import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Conexão com o bd
const prisma = new PrismaClient();

class UserController {
  async create(req: Request, res: Response) {
    // Desestruturação do body
    const { name, email, password } = req.body;

    // Verificação de email
    const userExist = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userExist) {
      return res.status(400).json({ error: "Este email já esta cadastrado." });
    }

    // Verificação de senha, se tem os caracteres minimos.
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "A senha deve conter no mínimo 10 caracteres." });
    }

    // Criptografando a senha
    const hashedPassword = await bcrypt.hash(password, 6);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Retirando o password da variavel user para não aparecer no body
    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json(userWithoutPassword);
  }
}

export default new UserController();
