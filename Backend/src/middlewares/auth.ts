import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import authConfig from "../config/auth.ts";

import type { TokenPayload } from "../types/types.ts";

export default async (req: Request, res: Response, next: NextFunction) => {
  // Captura o token de autenticação do usuário
  const authHeader = req.headers.authorization;

  // Verifica se o token existe; caso contrário, bloqueia o acesso
  if (!authHeader) {
    return res.status(401).json({ error: "Token não existe." });
  }

  // Extrai o token do header (formato: Bearer token)
  const [, token] = authHeader.split(" ");

  try {
    // Valida o token (assinatura, integridade e expiração)
    const decoded = jwt.verify(token, authConfig.secret) as TokenPayload;

    // Armazena o ID do usuário na request
    req.userId = decoded.id;

    // Libera o acesso para a próxima etapa
    return next();
  } catch {
    // Em caso de token inválido, expirado ou adulterado, bloqueia o acesso
    return res.status(401).json({ error: "Token inválido." });
  }
};
