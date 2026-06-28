export type Task = {
  id: number;
  title: string;
  description: string;
  status: boolean;
  priority: "baixa" | "media" | "alta";
  dueDate: string;
};

export type Filter = "todas" | "pendentes" | "concluidas";
