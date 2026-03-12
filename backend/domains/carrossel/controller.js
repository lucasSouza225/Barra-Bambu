import Carrossel from "./models.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Função para extrair nome do arquivo da URL
const getFilenameFromUrl = (url) => {
    if (!url) return null;
    const parts = url.split('/uploads/');
    return parts[1] || null;
};

// Função para deletar arquivo físico
const deletarArquivo = (filename) => {
    if (!filename) return false;
    
    const filePath = path.join(__dirname, '../../uploads', filename);
    
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`✅ Arquivo deletado: ${filename}`);
        return true;
    }
    console.log(`❌ Arquivo não encontrado: ${filename}`);
    return false;
};

// GET - Listar todos os banners (público)
export const getBanners = async (req, res) => {
    try {
        const banners = await Carrossel.find().sort('ordem');
        res.json(banners);
    } catch (error) {
        res.status(500).json({ 
            message: "Erro ao buscar banners", 
            error: error.message 
        });
    }
};

// GET - Buscar banners ativos (público - para o site)
export const getBannersAtivos = async (req, res) => {
    try {
        const banners = await Carrossel.find({ ativo: true }).sort('ordem');
        res.json(banners);
    } catch (error) {
        res.status(500).json({ 
            message: "Erro ao buscar banners ativos", 
            error: error.message 
        });
    }
};

// GET - Buscar um banner por ID (admin)
export const getBannerById = async (req, res) => {
    try {
        const banner = await Carrossel.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ message: "Banner não encontrado" });
        }
        res.json(banner);
    } catch (error) {
        res.status(500).json({ 
            message: "Erro ao buscar banner", 
            error: error.message 
        });
    }
};

// POST - Criar novo banner (admin)
export const createBanner = async (req, res) => {
    try {
        const { titulo, descricao, imagem, ordem, link, ativo } = req.body;

        if (!titulo || !imagem) {
            return res.status(400).json({ 
                message: "Título e imagem são obrigatórios" 
            });
        }

        const novoBanner = await Carrossel.create({
            titulo,
            descricao,
            imagem,
            ordem: ordem || 0,
            link: link || '',
            ativo: ativo !== false
        });

        res.status(201).json(novoBanner);

    } catch (error) {
        console.error("Erro ao criar banner:", error);
        res.status(500).json({ 
            message: "Erro ao criar banner", 
            error: error.message 
        });
    }
};

// PUT - Atualizar banner (admin) - COM DELETE DE IMAGEM ANTIGA
export const updateBanner = async (req, res) => {
    try {
        const { titulo, descricao, imagem, ordem, link, ativo } = req.body;
        
        const bannerAtual = await Carrossel.findById(req.params.id);
        
        if (!bannerAtual) {
            return res.status(404).json({ message: "Banner não encontrado" });
        }

        // Se a imagem foi alterada, deletar a imagem antiga
        if (imagem && imagem !== bannerAtual.imagem) {
            const filename = getFilenameFromUrl(bannerAtual.imagem);
            if (filename) {
                deletarArquivo(filename);
            }
        }

        const bannerAtualizado = await Carrossel.findByIdAndUpdate(
            req.params.id,
            { titulo, descricao, imagem, ordem, link, ativo },
            { new: true, runValidators: true }
        );

        res.json(bannerAtualizado);

    } catch (error) {
        console.error("Erro ao atualizar banner:", error);
        res.status(500).json({ 
            message: "Erro ao atualizar banner", 
            error: error.message 
        });
    }
};

// DELETE - Remover banner (admin) - COM DELETE DE IMAGEM
export const deleteBanner = async (req, res) => {
    try {
        const banner = await Carrossel.findById(req.params.id);
        
        if (!banner) {
            return res.status(404).json({ message: "Banner não encontrado" });
        }

        // Deletar imagem física
        const filename = getFilenameFromUrl(banner.imagem);
        let imagemDeletada = false;
        
        if (filename) {
            imagemDeletada = deletarArquivo(filename);
        }

        // Deletar do banco
        await Carrossel.findByIdAndDelete(req.params.id);

        res.json({ 
            message: "Banner removido com sucesso",
            imagemDeletada,
            banner: banner.titulo
        });

    } catch (error) {
        console.error("Erro ao deletar banner:", error);
        res.status(500).json({ 
            message: "Erro ao remover banner", 
            error: error.message 
        });
    }
};

// PATCH - Reordenar banners (admin)
export const reordenarBanners = async (req, res) => {
    try {
        const { banners } = req.body;
        
        for (const item of banners) {
            await Carrossel.findByIdAndUpdate(item.id, { ordem: item.ordem });
        }

        res.json({ message: "Ordem atualizada com sucesso" });

    } catch (error) {
        res.status(500).json({ 
            message: "Erro ao reordenar banners", 
            error: error.message 
        });
    }
};

// PATCH - Alternar ativo (admin)
export const toggleAtivo = async (req, res) => {
    try {
        const banner = await Carrossel.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ message: "Banner não encontrado" });
        }

        banner.ativo = !banner.ativo;
        await banner.save();

        res.json(banner);

    } catch (error) {
        res.status(500).json({ 
            message: "Erro ao alterar status", 
            error: error.message 
        });
    }
};