import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import * as Yup from "yup";

// Instância do Prisma Client (conexão com o banco de dados)
const prisma = new PrismaClient();

class TaskControllers {
  async index(req: Request, res: Response) {
    try {
      // Obtém o ID do usuário autenticado
      const id = req.userId;

      // Busca o usuário e suas tarefas
      const userWithTasks = await prisma.user.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          tasks: true,
        },
      });

      // Retorna erro caso o usuário não seja encontrado
      if (!userWithTasks) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      // Retorna a lista de tarefas do usuário
      res.json({
        tasks: userWithTasks.tasks,
      });
    } catch {
      // Retorna erro em caso de falha interna
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  }

  async store(req: Request, res: Response) {
    try {
      // Define as regras de validação da tarefa
      const schema = Yup.object().shape({
        title: Yup.string().required(),
        description: Yup.string().required(),
        priority: Yup.string().required(),
        dueDate: Yup.date().required(),
      });

      // Valida os dados enviados na requisição
      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: "Falha ao cadastrar." });
      }

      // Extrai os dados da tarefa
      const { title, description, priority, dueDate } = req.body;

      // Cria a tarefa vinculada ao usuário autenticado
      const newTask = await prisma.task.create({
        data: {
          title,
          description,
          priority,
          dueDate: new Date(dueDate),
          userId: Number(req.userId),
        },
      });

      // Retorna a tarefa criada
      return res.status(201).json(newTask);
    } catch {
      // Retorna erro em caso de falha no cadastro
      return res.status(500).json({ error: "Erro ao cadastrar a tarefa." });
    }
  }

  async update(req: Request, res: Response) {
    try {
      // Obtém o ID da tarefa
      const { id } = req.params;

      // Define as regras de validação dos campos de atualização
      const schema = Yup.object().shape({
        title: Yup.string(),
        description: Yup.string(),
        priority: Yup.string(),
        dueDate: Yup.date(),
        status: Yup.boolean(),
      });

      // Valida e filtra os dados enviados na requisição
      const validatedData = await schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      // Atualiza a tarefa no banco de dados
      const updatedTask = await prisma.task.update({
        where: {
          id: Number(id),
        },
        data: validatedData,
      });

      // Retorna a tarefa atualizada
      return res.json(updatedTask);
    } catch (e) {
      // Retorna os erros de validação
      if (e instanceof Yup.ValidationError) {
        return res
          .status(400)
          .json({ error: "Falha na validação.", details: e.errors });
      }

      // Retorna erro em caso de falha interna
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  }

  async delete(req: Request, res: Response) {
    // Obtém o ID da tarefa e do usuário autenticado
    const { id } = req.params;
    const loggedUserId = req.userId;

    // Verifica se o ID informado é válido
    if (isNaN(Number(id))) {
      return res.status(400).json({ error: "ID da tarefa inválido." });
    }

    // Busca a tarefa pelo ID
    const task = await prisma.task.findUnique({
      where: {
        id: Number(id),
      },
    });

    // Retorna erro caso a tarefa não exista
    if (!task) {
      return res.status(400).json({ error: "Tarefa não existe." });
    }

    // Verifica se a tarefa pertence ao usuário autenticado
    if (task.userId !== Number(loggedUserId)) {
      return res.status(401).json({ error: "Requisição não autorizada." });
    }

    // Remove a tarefa do banco de dados
    await prisma.task.delete({
      where: {
        id: Number(id),
      },
    });

    // Retorna sucesso sem conteúdo
    return res.status(204).send();
  }
}

export default new TaskControllers();
