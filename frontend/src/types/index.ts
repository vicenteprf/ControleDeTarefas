export type Task = {
  id: string; // ou number, dependendo do seu banco
  title: string;
  description: string;
  status: "pendente" | "concluida";
  priority: "baixa" | "media" | "alta"; // Adicione essa linha
  dueDate: string; // Adicione essa linha também
};
