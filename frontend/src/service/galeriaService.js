// src/service/galeriaService.js
import axios from 'axios';

const API_URL = '/galeria';

export const galeriaService = {
    listar: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error('Erro ao listar galeria:', error);
            return [];
        }
    }
};