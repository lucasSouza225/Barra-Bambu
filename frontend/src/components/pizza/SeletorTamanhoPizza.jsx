// frontend/src/components/pizza/SeletorTamanhoPizza.jsx
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { TAMANHOS_LIST } from '../../constants/pizzaConstants';
import { formatarPreco } from '../../utils/formatters';
import { isTamanhoDisponivel } from '../../utils/pizzaUtils';

const SeletorTamanhoPizza = memo(({ item, tamanhoSelecionado, onTamanhoChange }) => {
    // Se não tem tamanhos, não renderiza
    if (!item?.tamanhos) return null;
    
    return (
        <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">
                Tamanho da Pizza
            </label>
            <div className="grid grid-cols-2 gap-3">
                {TAMANHOS_LIST.map((tamanho) => {
                    const preco = item.tamanhos[tamanho.id]?.preco;
                    const disponivel = isTamanhoDisponivel(item, tamanho.id);
                    
                    // Se não tem preço definido, não mostra o botão
                    if (!preco || preco <= 0) return null;
                    
                    return (
                        <button
                            key={tamanho.id}
                            type="button"
                            onClick={() => onTamanhoChange(tamanho.id)}
                            className={`
                                p-3 rounded-lg border-2 transition-all
                                ${tamanhoSelecionado === tamanho.id
                                    ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                                    : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                                }
                                disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                            disabled={!disponivel}
                        >
                            <div className="font-bold text-dark-bg">
                                {tamanho.icon} {tamanho.nome}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                                {tamanho.descricao}
                            </div>
                            <div className="text-primary font-bold mt-2">
                                {formatarPreco(preco)}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
});

SeletorTamanhoPizza.displayName = 'SeletorTamanhoPizza';

SeletorTamanhoPizza.propTypes = {
    item: PropTypes.shape({
        tamanhos: PropTypes.shape({
            brotinho: PropTypes.shape({ preco: PropTypes.number, disponivel: PropTypes.bool }),
            grande: PropTypes.shape({ preco: PropTypes.number, disponivel: PropTypes.bool })
        })
    }).isRequired,
    tamanhoSelecionado: PropTypes.string,
    onTamanhoChange: PropTypes.func.isRequired
};

export default SeletorTamanhoPizza;