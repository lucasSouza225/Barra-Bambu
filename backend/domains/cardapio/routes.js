import { Router } from "express";
import { 
    getItens,
    getItensPorCategoria,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
    toggleDisponivel
} from "./controller.js";

const router = Router();


router.get("/", getItens);
router.get("/categoria/:categoria", getItensPorCategoria);
router.get("/:id", getItemById);

router.post("/", createItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);
router.patch("/:id/disponivel", toggleDisponivel);

export default router;