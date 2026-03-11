// src/service/carrosselService.js
import axios from 'axios';

const API_URL = '/carrossel';

export const carrosselService = {
    // Listar todos os banners (admin)
    listar: async () => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    // Listar banners ativos (público)
    listarAtivos: async () => {
        const response = await axios.get(`${API_URL}/ativos`);
        return response.data;
    },

    // Buscar por ID
    buscarPorId: async (id) => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    // Criar novo banner
    criar: async (banner) => {
        const response = await axios.post(API_URL, banner);
        return response.data;
    },

    // Atualizar banner
    atualizar: async (id, banner) => {
        const response = await axios.put(`${API_URL}/${id}`, banner);
        return response.data;
    },

    // Deletar banner
    deletar: async (id) => {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    },

    // Reordenar banners
    reordenar: async (banners) => {
        const response = await axios.patch(`${API_URL}/reordenar`, { banners });
        return response.data;
    },

    // Toggle ativo
    toggleAtivo: async (id) => {
        const response = await axios.patch(`${API_URL}/${id}/toggle`);
        return response.data;
    }
};