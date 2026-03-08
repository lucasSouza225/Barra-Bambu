import "dotenv/config";
import express from "express";
import UserRouter from "./domains/user/routes.js"
import CardapioRouter from "./domains/cardapio/routes.js"
import cors from 'cors'
import cookieParser from "cookie-parser";

const app = express();
const { PORT } = process.env;

app.use(express.json());
app.use(cookieParser());

// ✅ AJUSTE AQUI - Coloque a porta do seu frontend
app.use(cors({
    origin: 'http://localhost:5173', // Mude de 5174 para 5173
    credentials: true
}));

app.use("/users", UserRouter)
app.use("/cardapio", CardapioRouter)

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});