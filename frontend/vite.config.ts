import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // ou vue(), etc. se não for React
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Adicione o plugin aqui!
  ],
});
