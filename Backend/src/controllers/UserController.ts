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

  // Gera o token de recuperação de senha
  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;

    try {
      // Busca o usuário pelo e-mail informado
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      // Verifica se o e-mail está cadastrado
      if (!user) {
        return res
          .status(404)
          .json({ error: "Este email não está cadastrado em nosso sistema." });
      }

      // Gera um token temporário para recuperação de senha
      const token = crypto.randomBytes(20).toString("hex");

      // Define o prazo de validade do token
      const expirationTime = new Date();
      expirationTime.setMinutes(expirationTime.getMinutes() + 15);

      // Salva o token e sua data de expiração
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: token,
          passwordResetExpires: expirationTime,
        },
      });

      // Monta o link de redefinição de senha
      const resetPasswordUrl = `http://localhost:5173/redefinir-senha?token=${token}`;

      // Retorna confirmação da solicitação
      return res.status(200).send();
    } catch {
      return res
        .status(500)
        .json({ error: "Erro interno ao processar a recuperação de senha." });
    }
  }

  async resetPassword(req: Request, res: Response) {
    const { token, password } = req.body;

    try {
      // Procura um usuário com o token informado
      const user = await prisma.user.findFirst({
        where: {
          passwordResetToken: token,
        },
      });

      // Verifica se o token é válido
      if (!user) {
        return res
          .status(400)
          .json({ error: "O link de redefinição é invalido ou expirou." });
      }

      // Verifica se o token expirou
      const now = new Date();
      if (user.passwordResetExpires && now > user.passwordResetExpires) {
        return res
          .status(400)
          .json({ error: "O link expirou. Solicite uma nova recuperação." });
      }

      // Valida o tamanho mínimo da nova senha
      if (password.length < 6) {
        return res
          .status(400)
          .json({ error: "A senha deve conter no mínimo 6 caracteres." });
      }

      // Criptografa a nova senha
      const hashedPassword = await bcrypt.hash(password, 6);

      // Atualiza a senha e invalida o token de recuperação
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetExpires: null,
        },
      });

      return res
        .status(200)
        .json({ message: "Sua senha foi redefinida com sucesso!" });
    } catch {
      return res
        .status(500)
        .json({ error: "Erro interno ao salvar a nova senha." });
    }
  }
}

export default new UserController();
