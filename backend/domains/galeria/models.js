import { Schema, model } from "mongoose";

const galeriaSchema = new Schema({
    titulo: { 
        type: String, 
        required: [true, "Título da imagem é obrigatório"] 
    },
    descricao: { 
        type: String,
        default: ''
    },
    imagem: { 
        type: String,
        required: [true, "Imagem é obrigatória"]
    },
    categoria: {
        type: String,
        enum: ['ambiente', 'eventos', 'pratos', 'outros'],
        default: 'ambiente'
    },
    ordem: { 
        type: Number, 
        default: 0 
    },
    ativo: { 
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

export default model("Galeria", galeriaSchema);