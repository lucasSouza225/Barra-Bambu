import { useState } from 'react';
import { useCarrinho } from '../../contexts/carrinho/CarrinhoContext';
import { FiShoppingCart } from 'react-icons/fi';
import { IoRestaurant, IoClose } from 'react-icons/io5';
import { FaWhatsapp } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

const CarrinhoLateral = () => {
  const [aberto, setAberto] = useState(false);
  const {
    itensCarrinho,
    observacoes,
    setObservacoes,
    removerItem,
    atualizarQuantidade,
    totalCarrinho,
    enviarWhatsApp
  } = useCarrinho();

  const totalItens = itensCarrinho.reduce((acc, item) => acc + item.quantidade, 0);

  const formatarPreco = (preco) => {
    return preco.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <>
      {/* Ícone flutuante */}
      <button
        onClick={() => setAberto(true)}
        className="fixed bottom-6 right-6 bg-primary text-dark-bg p-4 rounded-full shadow-lg hover:bg-secondary transition-colors z-40"
      >
        <div className="relative">
          <FiShoppingCart className="text-2xl" />
          {totalItens > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
              {totalItens}
            </span>
          )}
        </div>
      </button>

      {/* Carrinho lateral */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
        aberto ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="bg-dark-bg text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Seu Pedido</h2>
          <button
            onClick={() => setAberto(false)}
            className="text-white hover:text-primary transition-colors"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>

        {/* Lista de itens */}
        <div className="p-4 h-[calc(100vh-200px)] overflow-y-auto">
          {itensCarrinho.length === 0 ? (
            <div className="text-center py-12">
              <FiShoppingCart className="text-6xl mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Seu carrinho está vazio</p>
            </div>
          ) : (
            <div className="space-y-4">
              {itensCarrinho.map((item) => (
                <div key={item._id} className="flex gap-3 border-b pb-3">
                  <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden shrink-0">
                    {item.imagem ? (
                      <img src={item.imagem} alt={item.nome} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <IoRestaurant className="text-2xl text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-dark-bg">{item.nome}</h3>
                    <p className="text-sm text-gray-600">{formatarPreco(item.preco)} cada</p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => atualizarQuantidade(item._id, item.quantidade - 1)}
                        className="w-6 h-6 bg-gray-200 rounded hover:bg-gray-300 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="font-bold w-6 text-center">{item.quantidade}</span>
                      <button
                        onClick={() => atualizarQuantidade(item._id, item.quantidade + 1)}
                        className="w-6 h-6 bg-gray-200 rounded hover:bg-gray-300 flex items-center justify-center"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removerItem(item._id)}
                        className="ml-auto text-red-500 hover:text-red-700"
                      >
                        <MdDelete className="text-xl" />
                      </button>
                    </div>

                    {item.observacao && (
                      <p className="text-xs text-gray-500 mt-1">Obs: {item.observacao}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Observações gerais */}
        {itensCarrinho.length > 0 && (
          <div className="p-4 border-t">
            <label className="block text-gray-700 mb-2">Observações gerais</label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Alguma observação?"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
              rows="2"
            />
          </div>
        )}

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-gray-50 p-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-lg">Total:</span>
            <span className="text-2xl font-bold text-primary">
              {formatarPreco(totalCarrinho)}
            </span>
          </div>

          <button
            onClick={() => {
              enviarWhatsApp();
              setAberto(false);
            }}
            disabled={itensCarrinho.length === 0}
            className={`w-full bg-green-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${
              itensCarrinho.length === 0
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-green-700'
            }`}
          >
            <FaWhatsapp className="text-lg" />
            Finalizar Pedido via WhatsApp
          </button>
        </div>
      </div>
    </>
  );
};

export default CarrinhoLateral;