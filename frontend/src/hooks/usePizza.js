// frontend/src/hooks/usePizza.js
import { useState, useCallback, useMemo, useEffect } from 'react';
import { TAMANHOS_PIZZA } from '../constants/pizzaConstants';
import { 
    getPrecoPorTamanho, 
    isPizza, 
    temTamanhosDisponiveis,
    getTamanhosDisponiveis
} from '../utils/pizzaUtils';

export const usePizza = (itemSelecionado, modalAberto) => {
    // Estado do tamanho selecionado
    const [tamanhoSelecionado, setTamanhoSelecionado] = useState(TAMANHOS_PIZZA.GRANDE.id);
    
    // Memoiza valores derivados
    const isItemPizza = useMemo(() => isPizza(itemSelecionado), [itemSelecionado]);
    const temTamanhos = useMemo(() => temTamanhosDisponiveis(itemSelecionado), [itemSelecionado]);
    const tamanhosDisponiveis = useMemo(() => getTamanhosDisponiveis(itemSelecionado), [itemSelecionado]);
    
    // Preço baseado no tamanho selecionado
    const precoAtual = useMemo(() => {
        return getPrecoPorTamanho(itemSelecionado, tamanhoSelecionado);
    }, [itemSelecionado, tamanhoSelecionado]);
    
    // Resetar tamanho quando o modal fecha ou o item muda
    useEffect(() => {
        if (!modalAberto || !itemSelecionado) {
            // Define o primeiro tamanho disponível como padrão
            const primeiroTamanho = tamanhosDisponiveis[0] || TAMANHOS_PIZZA.GRANDE.id;
            setTamanhoSelecionado(primeiroTamanho);
        }
    }, [modalAberto, itemSelecionado, tamanhosDisponiveis]);
    
    // Handler para mudar o tamanho
    const handleTamanhoChange = useCallback((novoTamanho) => {
        if (tamanhosDisponiveis.includes(novoTamanho)) {
            setTamanhoSelecionado(novoTamanho);
        }
    }, [tamanhosDisponiveis]);
    
    // Reset manual do tamanho
    const resetTamanho = useCallback(() => {
        const primeiroTamanho = tamanhosDisponiveis[0] || TAMANHOS_PIZZA.GRANDE.id;
        setTamanhoSelecionado(primeiroTamanho);
    }, [tamanhosDisponiveis]);
    
    return {
        tamanhoSelecionado,
        precoAtual,
        isItemPizza,
        temTamanhos,
        tamanhosDisponiveis,
        handleTamanhoChange,
        resetTamanho
    };
};