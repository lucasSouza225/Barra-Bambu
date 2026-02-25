import { Router } from "express"
import { connectDb } from "../../config/db.js";
import User from "../user/models.js";
import bcrypt, { compare } from "bcrypt"

const router = Router()
const bcryptSalt = bcrypt.genSaltSync()
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

router.post("/login", async (req, res) => {

    const { email, password } = req.body

    try {
        const userDoc = await User.findOne({ email })
        if (userDoc) {
            const passwordCorrect = bcrypt.compareSync(password, userDoc.password)
            const {name, _id} = userDoc

                passwordCorrect 
                ? res.json({_id, name, email})
                : res.status(400).json("Senha invalida!")

        } else {
            res.status(400).json("Usuario não encontrado!")
        }
        res.json(userDoc[0])
    } catch (error) {
        res.status(500).json(error);
    }
})
export default router;