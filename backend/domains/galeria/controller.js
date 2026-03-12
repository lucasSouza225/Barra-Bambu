import Galeria from "./models.js";
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

// GET - Listar todas as imagens (admin)
export const getImagens = async (req, res) => {
    try {
        const imagens = await Galeria.find().sort('ordem -destaque createdAt');
        res.json(imagens);
    } catch (error) {
        res.status(500).json({ 
            message: "Erro ao buscar imagens", 
            error: error.message 
        });
    }
};

// GET - Buscar imagens ativas (público)
export const getImagensAtivas = async (req, res) => {
    try {
        const imagens = await Galeria.find({ ativo: true }).sort('ordem -destaque');
        res.json(imagens);
    } catch (error) {
        res.status(500).json({ 
            message: "Erro ao buscar imagens ativas", 
            error: error.message 
        });
    }
};

// GET - Buscar imagem por ID
export const getImagemById = async (req, res) => {
    try {
        const imagem = await Galeria.findById(req.params.id);
        if (!imagem) {
            return res.status(404).json({ message: "Imagem não encontrada" });
        }
        res.json(imagem);
    } catch (error) {
        res.status(500).json({ 
            message: "Erro ao buscar imagem", 
            error: error.message 
        });
    }
};

// POST - Criar nova imagem
export const createImagem = async (req, res) => {
    try {
        const { titulo, descricao, imagem, categoria, ordem, ativo, destaque } = req.body;

        if (!titulo || !imagem) {
            return res.status(400).json({ 
                message: "Título e imagem são obrigatórios" 
            });
        }

        const novaImagem = await Galeria.create({
            titulo,
            descricao: descricao || '',
            imagem,
            categoria: categoria || 'ambiente',
            ordem: ordem || 0,
            ativo: ativo !== false,
            destaque: destaque || false
        });

        res.status(201).json(novaImagem);

    } catch (error) {
        console.error("Erro ao criar imagem:", error);
        res.status(500).json({ 
            message: "Erro ao criar imagem", 
            error: error.message 
        });
    }
};

// PUT - Atualizar imagem
export const updateImagem = async (req, res) => {
    try {
        const { titulo, descricao, imagem, categoria, ordem, ativo, destaque } = req.body;
        
        const imagemAtual = await Galeria.findById(req.params.id);
        
        if (!imagemAtual) {
            return res.status(404).json({ message: "Imagem não encontrada" });
        }

        // Se a imagem foi alterada, deletar a imagem antiga
        if (imagem && imagem !== imagemAtual.imagem) {
            const filename = getFilenameFromUrl(imagemAtual.imagem);
            if (filename) {
                deletarArquivo(filename);
            }
        }

        const imagemAtualizada = await Galeria.findByIdAndUpdate(
            req.params.id,
            { titulo, descricao, imagem, categoria, ordem, ativo, destaque },
            { new: true, runValidators: true }
        );

        res.json(imagemAtualizada);

    } catch (error) {
        console.error("Erro ao atualizar imagem:", error);
        res.status(500).json({ 
            message: "Erro ao atualizar imagem", 
            error: error.message 
        });
    }
};

// DELETE - Remover imagem
export const deleteImagem = async (req, res) => {
    try {
        const imagem = await Galeria.findById(req.params.id);
        
        if (!imagem) {
            return res.status(404).json({ message: "Imagem não encontrada" });
        }

        // Deletar imagem física
        const filename = getFilenameFromUrl(imagem.imagem);
        let imagemDeletada = false;
        
        if (filename) {
            imagemDeletada = deletarArquivo(filename);
        }

        // Deletar do banco
        await Galeria.findByIdAndDelete(req.params.id);

        res.json({ 
            message: "Imagem removida com sucesso",
            imagemDeletada,
            titulo: imagem.titulo
        });

    } catch (error) {
        console.error("Erro ao deletar imagem:", error);
        res.status(500).json({ 
            message: "Erro ao remover imagem", 
            error: error.message 
        });
    }
};

// PATCH - Alternar ativo
export const toggleAtivo = async (req, res) => {
    try {
        const imagem = await Galeria.findById(req.params.id);
        if (!imagem) {
            return res.status(404).json({ message: "Imagem não encontrada" });
        }

        imagem.ativo = !imagem.ativo;
        await imagem.save();

        res.json(imagem);

    } catch (error) {
        res.status(500).json({ 
            message: "Erro ao alterar status", 
            error: error.message 
        });
    }
};

// PATCH - Alternar destaque
export const toggleDestaque = async (req, res) => {
    try {
        const imagem = await Galeria.findById(req.params.id);
        if (!imagem) {
            return res.status(404).json({ message: "Imagem não encontrada" });
        }

        imagem.destaque = !imagem.destaque;
        await imagem.save();

        res.json(imagem);

    } catch (error) {
        res.status(500).json({ 
            message: "Erro ao alterar destaque", 
            error: error.message 
        });
    }
};

// PATCH - Reordenar imagens
export const reordenarImagens = async (req, res) => {
    try {
        const { imagens } = req.body; // Array de { id, ordem }
        
        for (const item of imagens) {
            await Galeria.findByIdAndUpdate(item.id, { ordem: item.ordem });
        }

        res.json({ message: "Ordem atualizada com sucesso" });

    } catch (error) {
        res.status(500).json({ 
            message: "Erro ao reordenar imagens", 
            error: error.message 
        });
    }
};