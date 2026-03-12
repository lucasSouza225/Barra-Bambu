// src/service/carrosselService.js
import axios from 'axios';

const API_URL = '/carrossel';
const UPLOAD_URL = '/upload';

export const carrosselService = {
    // LISTAR TODOS (admin)
    listar: async () => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    // LISTAR APENAS ATIVOS (público - para o site)
    listarAtivos: async () => {
        const response = await axios.get(`${API_URL}/ativos`);
        return response.data;
    },

    // BUSCAR POR ID
    buscarPorId: async (id) => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    // UPLOAD DE IMAGEM
    uploadImagem: async (file) => {
        const formData = new FormData();
        formData.append('imagem', file);
        
        const response = await axios.post(UPLOAD_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data; // Retorna { url: '...' }
    },

    // CRIAR NOVO BANNER
    criar: async (banner) => {
        const response = await axios.post(API_URL, banner);
        return response.data;
    },

    // ATUALIZAR BANNER
    atualizar: async (id, banner) => {
        const response = await axios.put(`${API_URL}/${id}`, banner);
        return response.data;
    },

    // DELETAR BANNER
    deletar: async (id) => {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    },

    // REORDENAR BANNERS
    reordenar: async (banners) => {
        const response = await axios.patch(`${API_URL}/reordenar`, { banners });
        return response.data;
    },

    // ALTERNAR ATIVO/INATIVO
    toggleAtivo: async (id) => {
        const response = await axios.patch(`${API_URL}/${id}/toggle`);
        return response.data;
    }
};