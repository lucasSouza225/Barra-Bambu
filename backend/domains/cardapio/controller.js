import Cardapio from "./models.js";

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

// POST - Criar novo item (admin)
export const createItem = async (req, res) => {
    try {
        const { nome, descricao, preco, categoria, imagem, destaque } = req.body;

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
            imagem: imagem || undefined,
            destaque: destaque || false
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
        const { nome, descricao, preco, categoria, imagem, disponivel, destaque } = req.body;

        const itemAtualizado = await Cardapio.findByIdAndUpdate(
            req.params.id,
            { nome, descricao, preco, categoria, imagem, disponivel, destaque },
            { new: true, runValidators: true }
        );

        if (!itemAtualizado) {
            return res.status(404).json({ message: "Item não encontrado" });
        }

        res.json(itemAtualizado);

    } catch (error) {
        res.status(500).json({ 
            message: "Erro ao atualizar item", 
            error: error.message 
        });
    }
};

// DELETE - Remover item (admin)
export const deleteItem = async (req, res) => {
    try {
        const itemRemovido = await Cardapio.findByIdAndDelete(req.params.id);
        
        if (!itemRemovido) {
            return res.status(404).json({ message: "Item não encontrado" });
        }

        res.json({ message: "Item removido com sucesso" });

    } catch (error) {
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

