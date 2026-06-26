import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { api } from "../services/api.ts";

export default function LoginPage() {
  // Estado do formulário de login
  const [dados, setDados] = useState({
    email: "",
    password: "",
  });

  // Estado para mensagens de erro
  const [erro, setErro] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const navigate = useNavigate();

  // Atualiza os campos do formulário conforme o usuário digita
  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setDados({
      ...dados,
      [name]: value,
    });
  }

  // Envia os dados para autenticação do usuário
  async function handleAcessar(e: React.FormEvent) {
    e.preventDefault();

    // Validação simples de campos obrigatórios
    if (!dados.email.trim() || !dados.password.trim()) {
      setErro("Preencha todos os campos.");
      return;
    }

    try {
      // Requisição de login para o backend
      const response = await api.post("/sessions", dados);

      // Extrai o token retornado pela API
      const token = response.data.token;

      // Se existir token, salva no localStorage
      if (token) {
        localStorage.setItem("token", token);
      }

      // Limpa o formulário após login
      setDados({
        email: "",
        password: "",
      });

      // Limpa mensagens de erro
      setErro("");

      // Redireciona para a página de tarefas
      navigate("/tasks");
    } catch {
      // Exibe erro caso o login falhe
      setErro("Erro ao realizar login.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col justify-center items-center gap-4 p-4">
      <form
        onSubmit={handleAcessar}
        className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 sm:p-10"
      >
        <div className="flex flex-col items-center gap-2 mb-10">
          <h1 className="text-2xl font-bold text-slate-100">
            Controle de Tarefas
          </h1>

          <div className="w-66 h-px bg-slate-500 my-4"></div>

          <h2 className="text-lg font-medium text-slate-300 mt-1">Login</h2>

          <p className="text-sm text-slate-400 mt-1">
            Acesse sua conta para continuar.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Campo: Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-600 dark:text-slate-400"
            >
              Email
            </label>
            <input
              onChange={handleOnChange}
              value={dados.email}
              type="email"
              name="email"
              placeholder="Digite seu email"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Campo: Senha */}
          <div className=" flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-600 dark:text-slate-400"
            >
              Senha
            </label>
            <div className="relative">
              <input
                onChange={handleOnChange}
                value={dados.password}
                type={mostrarSenha ? "text" : "password"}
                name="password"
                placeholder="Digite sua senha"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />

              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
              >
                {mostrarSenha ? (
                  <FaEyeSlash
                    size={18}
                    className="hover:text-blue-400
                    transition-colors
                    duration-200"
                  />
                ) : (
                  <FaEye
                    size={18}
                    className="hover:text-blue-400
                    transition-colors
                    duration-200"
                  />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-row justify-between items-center gap-4">
            <Link
              className="text-sm font-medium text-blue-600"
              to={"/cadastro"}
            >
              Criar conta
            </Link>

            <Link
              className="text-sm font-medium text-blue-600"
              to={"/recuperacao-senha"}
            >
              Esqueceu a senha?
            </Link>
          </div>

          {/* Botão de login */}
          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-semibold transition duration-200 cursor-pointer"
          >
            Entrar
          </button>
        </div>

        {/* Mensagem de erro */}
        {erro && <p className="mt-2 text-sm text-red-500">{erro}</p>}
      </form>
    </main>
  );
}
