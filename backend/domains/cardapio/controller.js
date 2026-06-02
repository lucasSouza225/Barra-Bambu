// backend/src/domains/cardapio/controller.js
import Cardapio from "./models.js";
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

// GET - Listar todos os itens (público)
export const getItens = async (req, res) => {
    try {
        const itens = await Cardapio.find().sort('-destaque createdAt');
        res.json(itens);
    } catch (error) {
        res.status(500).json({ 
            message: "Erro ao buscar cardápio", 
            error: error.message 
        });
    }
};

// GET - Buscar por categoria (público)
export const getItensPorCategoria = async (req, res) => {
    try {
        const { categoria } = req.params;
        const itens = await Cardapio.find({ categoria });
        res.json(itens);
    } catch (error) {
        res.status(500).json({ 
            message: "Erro ao buscar categoria", 
            error: error.message 
        });
    }
};

// GET - Buscar um item específico (público)
export const getItemById = async (req, res) => {
    try {
        const item = await Cardapio.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Item não encontrado" });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ 
            message: "Erro ao buscar item", 
            error: error.message 
        });
    }
};

// GET - Buscar itens em destaque (público)
export const getDestaques = async (req, res) => {
    try {
        const destaques = await Cardapio.find({ 
            destaque: true, 
            disponivel: true 
        }).sort('-createdAt').limit(8);
        res.json(destaques);
    } catch (error) {
        res.status(500).json({ 
            message: "Erro ao buscar destaques", 
            error: error.message 
        });
    }
};

// POST - Criar novo item (admin)
export const createItem = async (req, res) => {
    try {
        const { 
            nome, 
            descricao, 
            preco, 
            categoria, 
            subcategoria, 
            imagem, 
            destaque,
            tamanhos 
        } = req.body;

        if (!nome || !descricao || !preco || !categoria) {
            return res.status(400).json({ 
                message: "Nome, descrição, preço e categoria são obrigatórios" 
            });
        }

        const novoItem = await Cardapio.create({
            nome,
            descricao,
            preco,
            categoria,
            subcategoria: subcategoria || '',
            imagem: imagem || '',
            destaque: destaque || false,
            disponivel: true,
            tamanhos: tamanhos || {}
        });

        res.status(201).json(novoItem);

    } catch (error) {
        console.error("Erro ao criar item:", error);
        res.status(500).json({ 
            message: "Erro ao criar item", 
            error: error.message 
        });
    }
};

// PUT - Atualizar item (admin)
export const updateItem = async (req, res) => {
    try {
        const { 
            nome, 
            descricao, 
            preco, 
            categoria, 
            subcategoria, 
            imagem, 
            disponivel, 
            destaque,
            tamanhos 
        } = req.body;
        
        const itemAtual = await Cardapio.findById(req.params.id);
        
        if (!itemAtual) {
            return res.status(404).json({ message: "Item não encontrado" });
        }

        // Se a imagem foi alterada, deletar a imagem antiga
        if (imagem && imagem !== itemAtual.imagem) {
            const filename = getFilenameFromUrl(itemAtual.imagem);
            if (filename) {
                deletarArquivo(filename);
            }
        }

        const itemAtualizado = await Cardapio.findByIdAndUpdate(
            req.params.id,
            { 
                nome, 
                descricao, 
                preco, 
                categoria, 
                subcategoria, 
                imagem, 
                disponivel, 
                destaque,
                tamanhos
            },
            { new: true, runValidators: true }
        );

        res.json(itemAtualizado);

    } catch (error) {
        console.error("Erro ao atualizar item:", error);
        res.status(500).json({ 
            message: "Erro ao atualizar item", 
            error: error.message 
        });
    }
};

// DELETE - Remover item (admin)
export const deleteItem = async (req, res) => {
    try {
        const itemRemovido = await Cardapio.findById(req.params.id);
        
        if (!itemRemovido) {
            return res.status(404).json({ message: "Item não encontrado" });
        }

        // Deletar imagem física se existir
        const filename = getFilenameFromUrl(itemRemovido.imagem);
        let imagemDeletada = false;
        
        if (filename) {
            imagemDeletada = deletarArquivo(filename);
        }

        await Cardapio.findByIdAndDelete(req.params.id);

        res.json({ 
            message: "Item removido com sucesso",
            imagemDeletada,
            item: itemRemovido.nome
        });

    } catch (error) {
        console.error("Erro ao remover item:", error);
        res.status(500).json({ 
            message: "Erro ao remover item", 
            error: error.message 
        });
    }
};

// PATCH - Alternar disponibilidade (admin)
export const toggleDisponivel = async (req, res) => {
    try {
        const item = await Cardapio.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Item não encontrado" });
        }

        item.disponivel = !item.disponivel;
        await item.save();

        res.json(item);

    } catch (error) {
        res.status(500).json({ 
            message: "Erro ao alterar disponibilidade", 
            error: error.message 
        });
    }
};