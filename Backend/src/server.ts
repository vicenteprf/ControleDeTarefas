import "dotenv/config";
import app from "./app.ts";

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});
