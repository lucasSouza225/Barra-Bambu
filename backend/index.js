import "dotenv/config";
import express from "express";
import UserRouter from "./domains/user/routes.js"
import CardapioRouter from "./domains/cardapio/routes.js"
import cors from 'cors'
import cookieParser from "cookie-parser";
import UploadRouter from "./domains/upload/routes.js"
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const { PORT } = process.env;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cookieParser());

// ✅ AJUSTE AQUI - Coloque a porta do seu frontend
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/users", UserRouter)
app.use("/cardapio", CardapioRouter)
app.use("/upload", UploadRouter)

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});