// frontend/src/utils/formatters.js

/**
 * Formata um número para formato de moeda brasileira
 */
export const formatarPreco = (preco) => {
    if (preco === undefined || preco === null) return 'R$ 0,00';
    
    return preco.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
};

/**
 * Formata um número para formato brasileiro (com vírgula)
 */
export const formatarNumero = (numero) => {
    return numero.toLocaleString('pt-BR');
};

/**
 * Formata uma data para formato brasileiro
 */
export const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
};