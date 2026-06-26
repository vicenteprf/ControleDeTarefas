import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { api } from "../services/api.ts";

import type { Task } from "../types/index.ts";

import { FaTrashAlt, FaPencilAlt, FaSignOutAlt } from "react-icons/fa";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Estado dos campos do formulário
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "baixa",
    dueDate: "",
  });

  // Controla qual tarefa está sendo editada
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  // Função auxiliar para o cabeçalho de autenticação
  const getAuthHeader = useCallback(
    () => ({
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }),
    [],
  );

  const handleLogout = useCallback((): void => {
    localStorage.removeItem("token");
    navigate("/");
  }, [navigate]);

  // Carrega as tarefas ao abrir a página
  useEffect(() => {
    async function loadTasks() {
      try {
        // Busca as tarefas do usuário autenticado
        const response = await api.get("/tasks", getAuthHeader());

        if (response.data && Array.isArray(response.data.tasks)) {
          setTasks(response.data.tasks);
        } else {
          setTasks([]);
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
          handleLogout();
        } else {
          setErro("Erro ao carregar as tarefas.");
        }
      }
    }

    loadTasks();
  }, [handleLogout, getAuthHeader]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // Cria ou atualiza uma tarefa
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim() || !form.dueDate) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      if (editingTaskId) {
        // Atualiza a tarefa selecionada
        const task = tasks.find((t) => t.id === editingTaskId);

        const response = await api.put(
          `/task/${editingTaskId}`,
          {
            ...form,
            status: task?.status,
          },
          getAuthHeader(),
        );

        // Atualiza a tarefa editada na lista do estado local
        setTasks((prev) =>
          prev.map((task) =>
            task.id === editingTaskId ? response.data : task,
          ),
        );

        // Finaliza o modo de edição
        setEditingTaskId(null);
      } else {
        // Cria uma nova tarefa
        const response = await api.post("/task", form, getAuthHeader());
        setTasks((prev) => [...prev, response.data]);
      }

      // Limpa o formulário
      setForm({
        title: "",
        description: "",
        priority: "baixa",
        dueDate: "",
      });
      setErro("");
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        handleLogout();
      } else {
        setErro("Erro ao salvar a tarefa. Verifique as validações.");
      }
    }
  }

  // Preenche o formulário com os dados da tarefa selecionada
  function handleStartEdit(task: Task) {
    setEditingTaskId(task.id);

    // Cancela a edição atual e limpa o formulário
    const formattedDate = task.dueDate ? task.dueDate.split("T")[0] : "";

    setForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: formattedDate,
    });
  }

  // Cancela a edição atual e limpa o formulário
  function handleCancelEdit() {
    setEditingTaskId(null);
    setForm({
      title: "",
      description: "",
      priority: "baixa",
      dueDate: "",
    });
    setErro("");
  }

  // Exclui uma tarefa
  async function handleDeleteTask(id: number) {
    if (!window.confirm("Tem certeza que deseja excluir esta tarefa?")) return;

    try {
      await api.delete(`/task/${id}`, getAuthHeader());

      // Remove a tarefa da lista sem recarregar a página
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        handleLogout();
      } else {
        setErro("Erro ao excluir a tarefa.");
      }
    }
  }

  // Alterna o status da tarefa entre pendente e concluída
  async function handleToggleStatus(task: Task) {
    try {
      const response = await api.put(
        `/task/${task.id}`,
        {
          title: task.title,
          description: task.description,
          priority: task.priority,
          dueDate: task.dueDate,
          status: !task.status,
        },
        getAuthHeader(),
      );

      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? response.data : t)),
      );
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 401) {
        handleLogout();
      } else {
        setErro("Erro ao atualizar o status da tarefa.");
      }
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col items-center p-6">
      {/* Cabeçalho da página */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Minhas Tarefas
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Organize suas atividades do dia
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition border border-red-200 dark:border-red-900 cursor-pointer"
        >
          <FaSignOutAlt size={18} />
        </button>
      </div>

      {/* Formulário de criação e edição */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm"
      >
        <h2 className="text-sm font-semibold mb-3 text-blue-600 dark:text-blue-400">
          {editingTaskId ? "✍️ Editando Tarefa" : "➕ Nova Tarefa"}
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Título da tarefa"
            className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Descrição"
            className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </select>

          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition cursor-pointer"
          >
            {editingTaskId ? "Salvar Alterações" : "Criar tarefa"}
          </button>

          {/* Exibido apenas durante a edição */}
          {editingTaskId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium transition cursor-pointer"
            >
              Cancelar
            </button>
          )}
        </div>

        {erro && <p className="text-red-500 text-sm mt-2">{erro}</p>}
      </form>

      {/* Lista de tarefas */}
      <div className="w-full max-w-4xl mt-6 space-y-3">
        {tasks.length === 0 && (
          <p className="text-center text-slate-500 dark:text-slate-400">
            Nenhuma tarefa criada ainda.
          </p>
        )}

        {Array.isArray(tasks) &&
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm"
            >
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                  {task.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {task.description}
                </p>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs text-blue-500 font-medium capitalize">
                    Prioridade: {task.priority}
                  </span>
                  <span className="text-xs text-slate-400">
                    • Limite:{" "}
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString("pt-BR")
                      : "Sem data"}
                  </span>
                </div>
              </div>

              {/* Ações da tarefa */}
              <div className="flex flex-row justify-center items-center gap-2">
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium mr-2 ${
                    task.status
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {task.status ? "Concluída" : "Pendente"}
                </span>

                {/* Botão para alterar o status da tarefa */}
                <button
                  onClick={() => handleToggleStatus(task)}
                  className={`text-xs px-3 py-1.5 font-medium rounded-lg transition cursor-pointer ${
                    !task.status
                      ? "text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30 border border-green-200 dark:border-green-900"
                      : "text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900"
                  }`}
                >
                  {task.status ? "Concluir" : "Reabrir"}
                </button>

                {/* Botão Editar */}
                <button
                  onClick={() => handleStartEdit(task)}
                  className="text-xs px-3 py-1.5 font-medium rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-blue-200 dark:border-blue-900 transition cursor-pointer"
                >
                  <FaPencilAlt size={18} />
                </button>

                {/* Botão Excluir */}
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-xs px-3 py-1.5 font-medium rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-200 dark:border-red-900 transition cursor-pointer"
                >
                  <FaTrashAlt size={18} />
                </button>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}
