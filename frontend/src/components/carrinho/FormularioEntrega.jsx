import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { FiMapPin, FiCreditCard, FiDollarSign, FiSmartphone } from 'react-icons/fi';

const FormularioEntrega = ({ aberto, onClose, onSubmit, totalPedido }) => {
  const [formData, setFormData] = useState({
    nome: '', 
    rua: '',
    numero: '',
    bairro: '',
    complemento: '',
    telefone: '',
    formaPagamento: 'dinheiro',
    troco: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const totalFormatado = totalPedido?.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
          <h3 className="text-xl font-bold text-dark-bg">Informações para Entrega</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* NOME DO CLIENTE - NOVO! */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seu nome *
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                id="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="Digite seu nome completo"
              />
            </div>
          </div>

          {/* Endereço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rua
            </label>
            <input
              type="text"
              id="rua"
              value={formData.rua}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="Rua"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número
              </label>
              <input
                type="text"
                id="numero"
                value={formData.numero}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="Nº"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bairro
              </label>
              <input
                type="text"
                id="bairro"
                value={formData.bairro}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="Bairro"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Complemento (Opcional)
            </label>
            <input
              type="text"
              id="complemento"
              value={formData.complemento}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="Apto, Bloco..."
            />
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefone para Contato
            </label>
            <div className="flex items-center gap-2">
              <input
                type="tel"
                id="telefone"
                value={formData.telefone}
                onChange={handleChange}
                required
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="11987654321"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Apenas números, com DDD
            </p>
          </div>

          {/* Forma de Pagamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Forma de Pagamento
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, formaPagamento: 'dinheiro', troco: '' }))}
                className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                  formData.formaPagamento === 'dinheiro'
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 hover:border-primary/50'
                }`}
              >
                <FiDollarSign className="text-xl" />
                <span className="text-xs">Dinheiro</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, formaPagamento: 'cartao', troco: '' }))}
                className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                  formData.formaPagamento === 'cartao'
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 hover:border-primary/50'
                }`}
              >
                <FiCreditCard className="text-xl" />
                <span className="text-xs">Cartão</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, formaPagamento: 'pix', troco: '' }))}
                className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                  formData.formaPagamento === 'pix'
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 hover:border-primary/50'
                }`}
              >
                <FiSmartphone className="text-xl" />
                <span className="text-xs">Pix</span>
              </button>
            </div>
          </div>

          {/* Campo de troco */}
          {formData.formaPagamento === 'dinheiro' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precisa de troco para quanto?
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">R$</span>
                <input
                  type="number"
                  id="troco"
                  value={formData.troco}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="0,00"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Total do pedido: <strong>{totalFormatado}</strong>
              </p>
            </div>
          )}

          {/* Resumo do pedido */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total do pedido:</span>
              <span className="text-lg font-bold text-primary">{totalFormatado}</span>
            </div>
            {formData.formaPagamento === 'dinheiro' && formData.troco && (
              <div className="flex justify-between items-center mt-2 pt-2 border-t">
                <span className="text-sm text-gray-600">Troco para:</span>
                <span className="text-md font-semibold text-green-600">
                  {parseFloat(formData.troco).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 mt-6"
          >
            <FiMapPin />
            Finalizar Pedido
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormularioEntrega;