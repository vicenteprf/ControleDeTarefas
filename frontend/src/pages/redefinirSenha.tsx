import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AxiosError } from "axios";
import { api } from "../services/api.ts";

export default function RedefinicaoSenhaPage() {
  // Estado do formulário de redefinição
  const [dados, setDados] = useState({
    password: "",
    newPassword: "",
  });

  // Estado para mensagens de erro
  const [erro, setErro] = useState("");
  // Estado para mensagens de sucesso
  const [sucesso, setSucesso] = useState("");
  // Controla o estado de carregamento da requisição
  const [carregando, setCarregando] = useState(false);
  // Controla a exibição da senha nos campos
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const navigate = useNavigate();

  // Obtém o token enviado na URL
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // Atualiza os campos do formulário
  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setDados({
      ...dados,
      [name]: value,
    });
  }

  // Envia os dados para salvar a nova senha no backend
  async function handleRedefinirSenha(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    // Valida os dados antes de enviar a requisição
    if (!token) {
      setErro(
        "O token de recuperação está ausente ou é inválido. Solicite um novo link.",
      );
      return;
    }

    if (!dados.password.trim() || !dados.newPassword.trim()) {
      setErro("Preencha todos os campos.");
      return;
    }

    if (dados.password.length < 6) {
      setErro("A nova senha deve conter no mínimo 6 caracteres.");
      return;
    }

    if (dados.password !== dados.newPassword) {
      setErro("A nova senha e a confirmação não coincidem.");
      return;
    }

    try {
      setCarregando(true);

      // Envia a nova senha e o token para o backend
      await api.post("/password/reset", {
        token,
        password: dados.password,
      });

      setSucesso("Sua senha foi redefinida com sucesso!");

      // Limpa os campos do formulário
      setDados({ password: "", newPassword: "" });

      // Aguarda alguns segundos e redireciona para o login
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;

      // Exibe a mensagem de erro retornada pelo backend
      if (err.response && err.response.data && err.response.data.error) {
        setErro(err.response.data.error);
      } else {
        setErro("Erro ao redefinir a senha. Tente novamente mais tarde.");
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col justify-center items-center gap-4 p-4">
      <form
        onSubmit={handleRedefinirSenha}
        noValidate // Desativa as validações nativas do navegador
        className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 sm:p-10"
      >
        <div className="flex flex-col justify-center items-center gap-2 mb-10">
          {/* Título da página */}
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center">
            Redefinir senha
          </h1>
        </div>

        <div className="flex flex-col gap-4">
          {/* Campo: Confirmação da senha */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-600 dark:text-slate-400"
            >
              Nova senha
            </label>

            <div className="relative">
              <input
                onChange={handleOnChange}
                value={dados.password}
                type={mostrarSenha ? "text" : "password"}
                name="password"
                placeholder="Digite a nova senha"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <button
                type="button"
                // Alterna entre exibir e ocultar a senha
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-300 cursor-pointer flex items-center justify-center"
              >
                {mostrarSenha ? (
                  <FaEyeSlash
                    size={18}
                    className="hover:text-blue-400 transition-colors duration-200"
                  />
                ) : (
                  <FaEye
                    size={18}
                    className="hover:text-blue-400 transition-colors duration-200"
                  />
                )}
              </button>
            </div>
          </div>

          {/* Campo: Confirmação de Senha */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="newPassword"
              className="text-sm font-medium text-slate-600 dark:text-slate-400"
            >
              Confirmação da senha
            </label>

            <div className="relative">
              <input
                onChange={handleOnChange}
                value={dados.newPassword}
                type={mostrarSenha ? "text" : "password"}
                name="newPassword"
                placeholder="Confirme a nova senha"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-300 cursor-pointer flex items-center justify-center"
              >
                {mostrarSenha ? (
                  <FaEyeSlash
                    size={18}
                    className="hover:text-blue-400 transition-colors duration-200"
                  />
                ) : (
                  <FaEye
                    size={18}
                    className="hover:text-blue-400 transition-colors duration-200"
                  />
                )}
              </button>
            </div>
          </div>

          {/* Botão para redefinir a senha */}
          <button
            type="submit"
            disabled={carregando || !!sucesso}
            className="w-full mt-2 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-semibold transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {carregando ? "Atualizando..." : "Redefinir senha"}
          </button>
        </div>

        {/* Mensagens de erro e sucesso */}
        {erro && (
          <p className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400 font-medium">
            {erro}
          </p>
        )}
        {sucesso && (
          <div className="mt-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-sm text-green-600 dark:text-green-400 font-medium">
            {sucesso} Redirecionando para o login...
          </div>
        )}
      </form>
    </main>
  );
}
