import type React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

// Componente responsável por proteger rotas privadas
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Verifica se existe um token no localStorage (usuário autenticado)
  const isAuthenticated = !!localStorage.getItem("token");

  // Se não estiver autenticado, redireciona para a página de login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Se estiver autenticado, renderiza a rota normalmente
  return children;
}
