import "dotenv/config";
import express from "express";
import UserRouter from "./domains/user/routes.js"
import cors from 'cors'
import cookieParser from "cookie-parser";

const app = express();
const { PORT } = process.env;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5174', 
    credentials: true
}));
app.use("/users", UserRouter)

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

