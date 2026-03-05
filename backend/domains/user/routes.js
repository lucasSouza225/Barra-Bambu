import { Router } from "express"
import { connectDb } from "../../config/db.js";
import User from "../user/models.js";
import bcrypt, { compare } from "bcrypt"
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const router = Router()
const bcryptSalt = bcrypt.genSaltSync()
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
        const encryptedPassword = bcrypt.hashSync(password, bcryptSalt);


        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Nome, email e senha são obrigatórios"
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email já cadastrado"
            });
        }

        const newUser = await User.create({
            name,
            email,
            password: encryptedPassword,
        });


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

// Rota POST - Procura o usuário
router.post("/login", async (req, res) => {
    const { email, password } = req.body

    try {
        const userDoc = await User.findOne({ email })
        
        if (userDoc) {
            const passwordCorrect = bcrypt.compareSync(password, userDoc.password)
            
            if (passwordCorrect) {
                const { name, _id } = userDoc
                const newUserObj = { _id, name, email }
                
                const token = jwt.sign(newUserObj, JWT_SECRET_KEY, {
                    expiresIn: JWT_EXPIRES_IN
                })
                return res.cookie("token", token).json(newUserObj)
            } else {

                return res.status(400).json("Senha invalida!")
            }
        } else {
            return res.status(400).json("Usuario não encontrado!")
        }
  
        
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ message: "Erro no servidor", error: error.message });
    }
})

// Rota Post - Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logout realizado" });
});
export default router;