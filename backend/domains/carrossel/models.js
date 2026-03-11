import { Schema, model } from "mongoose";

const carrosselSchema = new Schema({
    titulo: { 
        type: String, 
        required: [true, "Título do banner é obrigatório"] 
    },
    descricao: { 
        type: String,
        default: ''
    },
    imagem: { 
        type: String,
        required: [true, "Imagem do banner é obrigatória"]
    },
    ordem: { 
        type: Number, 
        default: 0 
    },
    link: {
        type: String,
        default: ''
    },
    ativo: { 
        type: Boolean, 
        default: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

export default model("Carrossel", carrosselSchema);