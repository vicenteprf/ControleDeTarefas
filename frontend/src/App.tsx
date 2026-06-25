import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/login.tsx";
import CadastroPage from "./pages/cadastro.tsx";
import TasksPage from "./pages/TasksPage.tsx";

import ProtectedRoute from "./components/ProtectdRoute.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
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
