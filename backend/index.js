import "dotenv/config";
import express from "express";
import UserRouter from "./domains/user/routes.js"

const app = express();
const { PORT } = process.env;

app.use(express.json());
app.use("/users", UserRouter)

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

