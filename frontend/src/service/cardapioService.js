// src/services/cardapioService.js
import axios from 'axios';

const API_URL = '/cardapio';

export const cardapioService = {
  // Listar todos os itens
  listar: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // Buscar um item por ID
  buscarPorId: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  // Criar novo item
  criar: async (item) => {
    const response = await axios.post(API_URL, item);
    return response.data;
  },

  // Atualizar item
  atualizar: async (id, item) => {
    const response = await axios.put(`${API_URL}/${id}`, item);
    return response.data;
  },

  // Deletar item
  deletar: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },

  // Alternar disponibilidade
  toggleDisponivel: async (id) => {
    const response = await axios.patch(`${API_URL}/${id}/disponivel`);
    return response.data;
  }
};