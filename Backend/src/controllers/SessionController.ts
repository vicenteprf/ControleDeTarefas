import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import authConfig from "../config/auth.ts";

// Instância do Prisma Client (conexão com o banco de dados)
const prisma = new PrismaClient();

class SessionControllers {
  async store(req: Request, res: Response) {
    // Extrai email e senha do corpo da requisição
    const { email, password } = req.body;

    // Busca usuário pelo email no banco de dados
    const userExist = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // Se não encontrar o usuário, retorna erro de autenticação
    if (!userExist) {
      return res
        .status(401)
        .json({ message: "Este  email não esta cadastrado." });
    }

    // Compara a senha enviada com a senha criptografada no banco
    const isPasswordValid = await bcrypt.compare(password, userExist.password);

    // Se a senha for inválida, bloqueia o acesso
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Senha inválida." });
    }

    // Extrai dados do usuário para o token e resposta
    const { id, name } = userExist;

    // Gera o token JWT com o ID do usuário
    const token = jwt.sign({ id }, authConfig.secret as jwt.Secret, {
      expiresIn: authConfig.expiresIn as any,
    });

    // Retorna dados do usuário e token de autenticaçãol
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
