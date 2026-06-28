import { useState } from "react";
import { AxiosError } from "axios";
import { Link } from "react-router-dom";
import { api } from "../services/api.ts";

export default function RecuperacaoSenhaPage() {
  // Estado do formulário
  const [dados, setDados] = useState({ email: "" });
  // Estado para mensagens de erro
  const [erro, setErro] = useState("");
  // Estado para mensagens de sucesso
  const [sucesso, setSucesso] = useState("");
  // Controla o estado de carregamento da requisição
  const [carregando, setCarregando] = useState(false);

  // Atualiza o campo do formulário conforme o usuário digita
  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setDados({
      ...dados,
      [name]: value,
    });
  }

  // Envia a solicitação de recuperação de senha
  async function handleRecuperarSenha(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    // Verifica se o campo de e-mail foi preenchido
    if (!dados.email.trim()) {
      setErro("Por favor, preencha o campo de e-mail.");
      return;
    }

    try {
      setCarregando(true);

      // Solicita ao backend o envio do link de recuperação
      await api.post("/password/forgot", { email: dados.email });

      // Evita informar se o e-mail está cadastrado no sistema
      setSucesso(
        "Se o e-mail estiver cadastrado, um link de redefinição será enviado para a sua caixa de entrada.",
      );
      setDados({ email: "" });
    } catch (error) {
      // Trata o caso em que o e-mail não está cadastrado
      const err = error as AxiosError;

      // Verifica o código de resposta da requisição
      if (err.response && err.response.status === 404) {
        setErro("Este e-mail não está cadastrado em nosso sistema.");
      } else {
        setErro(
          "Ocorreu um erro ao processar a solicitação. Tente novamente mais tarde.",
        );
      }
      // Finaliza o estado de carregamento
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col justify-center items-center gap-4 p-4">
      <form
        onSubmit={handleRecuperarSenha}
        className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 sm:p-10"
      >
        <div className="flex flex-col items-center gap-2 mb-10">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Recuperar senha
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
            Insira o seu e-mail cadastrado para receber as instruções de
            recuperação.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Campo: E-mail */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-600 dark:text-slate-400"
            >
              E-mail
            </label>
            <input
              onChange={handleOnChange}
              value={dados.email}
              type="email"
              name="email"
              placeholder="Ex: seuemail@provedor.com"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Botão de envio */}
          <button
            type="submit"
            disabled={carregando}
            className="w-full mt-2 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-semibold transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {carregando ? "Enviando..." : "Enviar link de recuperação"}
          </button>

          <div className="flex flex-row justify-center items-center mt-2">
            <Link
              className="text-sm font-medium text-blue-600 hover:underline"
              to={"/"}
            >
              Voltar para o login
            </Link>
          </div>
        </div>

        {/* Mensagens de erro e sucesso */}
        {erro && (
          <p className="mt-4 p-3 text-sm text-red-600 text-center">{erro}</p>
        )}
        {sucesso && (
          <div className="mt-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-sm text-green-600 dark:text-green-400 font-medium">
            {sucesso}
          </div>
        )}
      </form>
    </main>
  );
}
