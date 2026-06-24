import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import * as Yup from "yup";

const prisma = new PrismaClient();

class TaskControllers {
  async index(req: Request, res: Response) {
    try {
      const id = req.userId;

      const userWithTasks = await prisma.user.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          tasks: true,
        },
      });

      if (!userWithTasks) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      res.json({
        tasks: userWithTasks,
      });
    } catch {
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  }

  async store(req: Request, res: Response) {
    try {
      const schema = Yup.object().shape({
        title: Yup.string().required(),
        description: Yup.string().required(),
        priority: Yup.string().required(),
        dueDate: Yup.date().required(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: "Falha ao cadastrar." });
      }

      const { title, description, priority, dueDate } = req.body;

      const newTask = await prisma.task.create({
        data: {
          title,
          description,
          priority,
          dueDate: new Date(dueDate),
          userId: Number(req.userId),
        },
      });

      return res.status(201).json(newTask);
    } catch {
      return res.status(500).json({ error: "Erro ao cadastrar a tarefa." });
    }
  }
}

export default new TaskControllers();
