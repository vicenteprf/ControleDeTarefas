import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

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

  // Gera o token de recuperação e "envia" o link para o usuário
  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;

    try {
      // Busca o usuário pelo e-mail informado
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      // Gera um token hexadecimal seguro e temporário
      const token = crypto.randomBytes(20).toString("hex");

      // Retorna erro 404 se o e-mail não constar no banco de dados
      if (!user) {
        return res
          .status(404)
          .json({ error: "Este email não está cadastrado em nosso sistema." });
      }

      // Configura o prazo de validade do token
      const expirationTime = new Date();
      expirationTime.setMinutes(expirationTime.getMinutes() + 15);

      // Salva o token gerado e o tempo de expiração na tabela do usuário
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResertToken: token,
          passwordResetExpires: expirationTime,
        },
      });

      // Cria a URL completa que aponta para a página de redefinição no Frontend
      const resetPasswordUrl = `http://localhost:5173/redefinir-senha?token=${token}`;

      // Retorna confirmação de sucesso
      return res.status(200).send();
    } catch {
      return res
        .status(500)
        .json({ error: "Erro interno ao processar a recuperaão de senha." });
    }
  }
}

export default new UserController();
