import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Instância do Prisma Client (conexão com o banco de dados)
const prisma = new PrismaClient();

class UserController {
  async create(req: Request, res: Response) {
    // Extrai os dados enviados no corpo da requisição
    const { name, email, password } = req.body;

    // Verifica se já existe um usuário com o mesmo email
    const userExist = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // Retorna erro se o email já estiver cadastrado
    if (userExist) {
      return res.status(400).json({ error: "Este email já esta cadastrado." });
    }

    // Valida o tamanho mínimo da senha
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "A senha deve conter no mínimo 6 caracteres." });
    }

    // Gera hash da senha usando bcrypt
    const hashedPassword = await bcrypt.hash(password, 6);

    // Cria o usuário no banco de dados
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Remove a senha do objeto antes de retornar a resposta
    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json(userWithoutPassword);
  }
}

export default new UserController();
