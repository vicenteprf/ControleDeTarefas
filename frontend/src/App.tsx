import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/login.tsx";
import CadastroPage from "./pages/cadastro.tsx";
import TasksPage from "./pages/tasksPage.tsx";
import RecuperacaoSenhaPage from "./pages/recuperacaoSenha.tsx";
import RedefinicaoSenhaPage from "./pages/redefinirSenha.tsx";

import ProtectedRoute from "./components/ProtectdRoute.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/recuperacao-senha" element={<RecuperacaoSenhaPage />} />
        <Route path="/redefinir-senha" element={<RedefinicaoSenhaPage />} />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TasksPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
