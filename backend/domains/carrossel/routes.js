import { Router } from "express";
import {
    getBanners,
    getBannersAtivos,
    getBannerById,
    createBanner,
    updateBanner,
    deleteBanner,
    reordenarBanners,
    toggleAtivo
} from "./controller.js";

const router = Router();

// Rotas públicas
router.get("/", getBanners);
router.get("/ativos", getBannersAtivos);

// Rotas públicas com ID
router.get("/:id", getBannerById);

// Rotas protegidas (admin)
router.post("/", createBanner);
router.put("/:id", updateBanner);
router.delete("/:id", deleteBanner);
router.patch("/reordenar", reordenarBanners);
router.patch("/:id/toggle", toggleAtivo);

export default router;