// frontend/src/utils/pizzaUtils.js
import { TAMANHOS_PIZZA } from '../constants/pizzaConstants';

/**
 * Verifica se um item é pizza
 */
export const isPizza = (item) => {
    return item?.categoria === 'pizzas';
};

/**
 * Verifica se a pizza tem tamanhos disponíveis
 */
export const temTamanhosDisponiveis = (item) => {
    if (!isPizza(item)) return false;
    return !!(item?.tamanhos?.brotinho?.preco || item?.tamanhos?.grande?.preco);
};

/**
 * Pega o preço baseado no tamanho selecionado
 */
export const getPrecoPorTamanho = (item, tamanhoId) => {
    if (!isPizza(item) || !item?.tamanhos) {
        return item?.preco || 0;
    }
    
    const tamanho = item.tamanhos[tamanhoId];
    return tamanho?.preco || 0;
};

/**
 * Pega o preço padrão da pizza (para exibição)
 */
export const getPrecoBasePizza = (item) => {
    if (!isPizza(item)) return item?.preco || 0;
    
    // Prioriza o preço da grande para exibição
    if (item.tamanhos?.grande?.preco) {
        return item.tamanhos.grande.preco;
    }
    if (item.tamanhos?.brotinho?.preco) {
        return item.tamanhos.brotinho.preco;
    }
    return item.preco || 0;
};

/**
 * Formata a descrição do tamanho para exibição
 */
export const formatTamanhoDescricao = (tamanhoId) => {
    const tamanhos = {
        brotinho: 'Brotinho (25cm - 4 fatias)',
        grande: 'Grande (35cm - 8 fatias)'
    };
    return tamanhos[tamanhoId] || tamanhoId;
};

/**
 * Valida se o tamanho está disponível
 */
export const isTamanhoDisponivel = (item, tamanhoId) => {
    if (!isPizza(item)) return true;
    return item?.tamanhos?.[tamanhoId]?.disponivel !== false;
};

/**
 * Retorna os tamanhos disponíveis da pizza
 */
export const getTamanhosDisponiveis = (item) => {
    if (!isPizza(item) || !item?.tamanhos) return [];
    
    const disponiveis = [];
    if (item.tamanhos.brotinho?.preco) disponiveis.push('brotinho');
    if (item.tamanhos.grande?.preco) disponiveis.push('grande');
    return disponiveis;
};