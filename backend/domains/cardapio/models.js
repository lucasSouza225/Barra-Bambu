import { Schema, model } from "mongoose";

const cardapioSchema = new Schema({
    nome: { 
        type: String, 
        required: [true, "Nome do prato é obrigatório"] 
    },
    descricao: { 
        type: String, 
        required: [true, "Descrição é obrigatória"] 
    },
    preco: { 
        type: Number, 
        required: [true, "Preço é obrigatório"],
        min: [0, "Preço não pode ser negativo"]
    },
    categoria: { 
        type: String, 
        enum: ['entradas', 'principais', 'bebidas', 'sobremesas', 'carnes', 'peixes', 'petiscos'], 
        required: [true, "Categoria é obrigatória"]
    },
    imagem: { 
        type: String,
        default: '' 
    },
    disponivel: { 
        type: Boolean, 
        default: true 
    },
    destaque: { 
        type: Boolean, 
        default: false 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

export default model("Cardapio", cardapioSchema);