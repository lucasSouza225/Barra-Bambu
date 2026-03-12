// src/service/galeriaService.js
import axios from 'axios';

const API_URL = '/galeria';
const UPLOAD_URL = '/upload';

export const galeriaService = {
    // LISTAR TODAS (admin)
    listar: async () => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    // LISTAR APENAS ATIVAS (público)
    listarAtivas: async () => {
        const response = await axios.get(`${API_URL}/ativas`);
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
        return response.data;
    },

    // CRIAR NOVA IMAGEM
    criar: async (imagem) => {
        const response = await axios.post(API_URL, imagem);
        return response.data;
    },

    // ATUALIZAR IMAGEM
    atualizar: async (id, imagem) => {
        const response = await axios.put(`${API_URL}/${id}`, imagem);
        return response.data;
    },

    // DELETAR IMAGEM
    deletar: async (id) => {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    },

    // REORDENAR IMAGENS
    reordenar: async (imagens) => {
        const response = await axios.patch(`${API_URL}/reordenar`, { imagens });
        return response.data;
    },

    // ALTERNAR ATIVO
    toggleAtivo: async (id) => {
        const response = await axios.patch(`${API_URL}/${id}/toggle`);
        return response.data;
    },

    // ALTERNAR DESTAQUE
    toggleDestaque: async (id) => {
        const response = await axios.patch(`${API_URL}/${id}/destaque`);
        return response.data;
    }
};