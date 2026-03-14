import { Router } from "express"
import { connectDb } from "../../config/db.js";
import User from "../user/models.js";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const router = Router()
const bcryptSalt = bcrypt.genSaltSync(10) // ← Melhor prática: definir rounds
const { JWT_SECRET_KEY, JWT_EXPIRES_IN } = process.env
connectDb();

// Rota GET - Listar todos os usuários
router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({
            message: "Erro ao buscar usuários",
            error: error.message
        });
    }
});

// Rota GET - Profile (verificar usuário logado)
router.get("/profile", async (req, res) => {
    const { token } = req.cookies

    if (token) {
        try {
            const userInfo = jwt.verify(token, JWT_SECRET_KEY)
            res.json(userInfo);
        } catch (error) {
            res.clearCookie("token").json(null);
        }    
    } else {
        res.json(null)
    }
});

// Rota POST - Criar novo usuário 
router.post("/", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validação
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Nome, email e senha são obrigatórios"
            });
        }

        // Verificar se email já existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email já cadastrado"
            });
        }

        // Criar usuário com senha criptografada
        const encryptedPassword = bcrypt.hashSync(password, bcryptSalt);
        const newUser = await User.create({
            name,
            email,
            password: encryptedPassword,
        });

        // Retornar sem a senha
        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email
        });

    } catch (error) {
        console.error("Erro no POST /users:", error);
        res.status(500).json({
            message: "Erro ao criar usuário",
            error: error.message
        });
    }
});

// Rota POST - Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body

    try {
        const userDoc = await User.findOne({ email })
        
        if (!userDoc) {
            return res.status(400).json({ message: "Usuário não encontrado!" });
        }

        const passwordCorrect = bcrypt.compareSync(password, userDoc.password)
        
        if (!passwordCorrect) {
            return res.status(400).json({ message: "Senha inválida!" });
        }

        const { name, _id } = userDoc
        const newUserObj = { _id, name, email }
        
        const token = jwt.sign(newUserObj, JWT_SECRET_KEY, {
            expiresIn: JWT_EXPIRES_IN || '20m' // ← fallback se não tiver no .env
        })
        
        return res.cookie("token", token).json(newUserObj)

    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ message: "Erro no servidor", error: error.message });
    }
})

// Rota POST - Logout
router.post("/logout", (req, res) => {
    res.clearCookie("token").json({ message: "Logout realizado com sucesso" });
});

// Rota PUT - Atualizar usuário
router.put("/:id", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        let updateData = { name, email };
        
        if (password) {
            updateData.password = bcrypt.hashSync(password, bcryptSalt);
        }
        
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { returnDocument: 'after', runValidators: true } // ← CORRETO (sem new: true)
        );
        
        if (!updatedUser) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }
        
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota DELETE - Remover usuário
router.delete("/:id", async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        
        if (!deletedUser) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }
        
        res.json({ message: "Usuário removido com sucesso" });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;