import { Router } from "express";
import { 
    getImagens,
    getImagensAtivas,
    getImagemById,
    createImagem,
    updateImagem,
    deleteImagem,
    toggleAtivo,
    toggleDestaque,
    reordenarImagens
} from "./controller.js";

const router = Router();

// Rotas públicas
router.get("/", getImagens);
router.get("/ativas", getImagensAtivas);

// Rotas públicas com ID
router.get("/:id", getImagemById);

// Rotas protegidas (admin)
router.post("/", createImagem);
router.put("/:id", updateImagem);
router.delete("/:id", deleteImagem);
router.patch("/reordenar", reordenarImagens);
router.patch("/:id/toggle", toggleAtivo);
router.patch("/:id/destaque", toggleDestaque);

export default router;