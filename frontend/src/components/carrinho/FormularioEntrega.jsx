import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { FiPhone, FiMapPin } from 'react-icons/fi';

const FormularioEntrega = ({ aberto, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    rua: '',
    numero: '',
    bairro: '',
    complemento: '',
    telefone: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-bold text-dark-bg">Informações para Entrega</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefone para Contato
            </label>
            <div className="flex items-center gap-2">
              <FiPhone className="text-gray-400" />
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

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 mt-6"
          >
            <FiMapPin />
            Confirmar Endereço
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormularioEntrega;