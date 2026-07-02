import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { api } from "../services/api.ts";

import toast, { Toaster } from "react-hot-toast";

export default function CadastroPage() {
  // Estado do formulário de cadastro
  const [dados, setDados] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Controla a exibição da senha no campo
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // Utilizado para redirecionar o usuário após o cadastro
  const navigate = useNavigate();

  // Atualiza os campos do formulário conforme o usuário digita
  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setDados({
      ...dados,
      [name]: value,
    });
  }

  // Valida os dados e realiza o cadastro do usuário
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    // Validação simples de campos obrigatórios
    if (!dados.email.trim() || !dados.name.trim() || !dados.password.trim()) {
      toast.error("Preencha todos os campos.");
      return;
    }

    try {
      // Requisição para criar usuário no backend
      await api.post("users", dados);

      // Limpa o formulário após sucesso
      setDados({
        name: "",
        email: "",
        password: "",
      });

      // Redireciona para a página de login
      navigate("/");
    } catch {
      // Exibe erro caso a requisição falhe
      toast.error("Erro ao cadastrar usuário.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col justify-center items-center gap-4 p-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 sm:p-10"
      >
        <div className="flex flex-col items-center gap-1 mb-10">
          <h1 className="text-2xl font-bold text-slate-100">Cadastro</h1>

          <div className="w-66 h-px bg-slate-500 my-4"></div>

          <p className="text-sm text-slate-400 mt-1">
            Crie sua conta gratuitamente.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Campo: Nome */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="name"
              className="text-sm font-medium text-slate-600 dark:text-slate-400"
            >
              Nome
            </label>
            <input
              onChange={handleOnChange}
              value={dados.name}
              type="text"
              name="name"
              placeholder="Digite o seu nome"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Campo: E-mail */}
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
              placeholder="Digite o seu email"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Campo: Senha */}
          <div className="flex flex-col gap-1.5">
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

          {/* Botão de envio */}
          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-semibold transition duration-200 cursor-pointer"
          >
            Cadastrar
          </button>

          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-4 text-center">
            Já tem uma conta?
            {/* Link para retornar à tela de login */}
            <Link to={"/"} className="text-sm font-medium text-blue-600">
              Entre aqui
            </Link>
          </p>
        </div>
      </form>

      {/* Container responsável por exibir os toast de feedback */}
      <Toaster />
    </main>
  );
}
