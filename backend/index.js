import "dotenv/config";
import express from "express";
import UserRouter from "./domains/user/routes.js"
import CardapioRouter from "./domains/cardapio/routes.js"
import GaleriaRouter from "./domains/galeria/routes.js"
import CarrosselRouter from "./domains/carrossel/routes.js"
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

/* app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
})); */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://frontend-naia22urs-lucas-projects225.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/users", UserRouter)
app.use("/cardapio", CardapioRouter)
app.use("/upload", UploadRouter)
app.use("/galeria", GaleriaRouter)
app.use("/carrossel", CarrosselRouter)

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});