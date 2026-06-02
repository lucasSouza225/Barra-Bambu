import { Router } from "express";
import { 
    getItens,
    getItensPorCategoria,
    getItemById,
    getDestaques,
    createItem,
    updateItem,
    deleteItem,
    toggleDisponivel
} from "./controller.js";

const router = Router();

// Rotas públicas
router.get("/", getItens);
router.get("/destaques", getDestaques);
router.get("/categoria/:categoria", getItensPorCategoria);
router.get("/:id", getItemById);

// Rotas protegidas (admin)
router.post("/", createItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);
router.patch("/:id/disponivel", toggleDisponivel);

export default router;