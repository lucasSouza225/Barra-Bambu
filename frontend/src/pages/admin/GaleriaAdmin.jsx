import { useState } from 'react';

const GaleriaAdmin = () => {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [imagens, setImagens] = useState([
    {
      id: 1,
      titulo: 'Ambiente Aconchegante',
      imagem: 'https://images.pexels.com/photos/9315/menu-restaurant-france-eating-9315.jpg',
      ativo: true
    },
    {
      id: 2,
      titulo: 'Área Externa',
      imagem: 'https://via.placeholder.com/300x200/719A0A/FFFFFF?text=Area+Externa',
      ativo: true
    },
    {
      id: 3,
      titulo: 'Espaço para Eventos',
      imagem: 'https://via.placeholder.com/300x200/FFD301/38241B?text=Eventos',
      ativo: false
    },
    {
      id: 4,
      titulo: 'Happy Hour',
      imagem: 'https://via.placeholder.com/300x200/2ECC71/FFFFFF?text=Happy+Hour',
      ativo: true
    }
  ]);

  const [novaImagem, setNovaImagem] = useState({
    titulo: '',
    imagem: '',
    ativo: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNovaImagem(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Cria nova imagem com ID temporário
    const nova = {
      ...novaImagem,
      id: Date.now(), // ID único temporário
      imagem: novaImagem.imagem || 'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=Nova+Imagem'
    };
    
    setImagens([...imagens, nova]);
    setNovaImagem({ titulo: '', imagem: '', ativo: true });
    setMostrarForm(false);
  };

  const toggleAtivo = (id) => {
    setImagens(imagens.map(img => 
      img.id === id ? { ...img, ativo: !img.ativo } : img
    ));
  };

  const deletarImagem = (id) => {
    if (window.confirm('Tem certeza que deseja remover esta imagem?')) {
      setImagens(imagens.filter(img => img.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-dark-bg">Gerenciar Galeria</h1>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="bg-primary text-dark-bg px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
        >
          {mostrarForm ? 'Cancelar' : '+ Nova Imagem'}
        </button>
      </div>

      {/* Formulário para nova imagem */}
      {mostrarForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-4 text-dark-bg">Adicionar Nova Imagem</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título da imagem
              </label>
              <input
                type="text"
                name="titulo"
                value={novaImagem.titulo}
                onChange={handleChange}
                placeholder="Ex: Ambiente principal"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL da imagem
              </label>
              <input
                type="text"
                name="imagem"
                value={novaImagem.imagem}
                onChange={handleChange}
                placeholder="https://exemplo.com/imagem.jpg"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-500 mt-1">
                Deixe em branco para usar imagem placeholder
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="ativo"
                id="ativo"
                checked={novaImagem.ativo}
                onChange={handleChange}
                className="h-4 w-4 text-primary rounded focus:ring-primary"
              />
              <label htmlFor="ativo" className="ml-2 text-sm text-gray-700">
                Imagem ativa (aparece no site)
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-primary text-dark-bg px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setMostrarForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid de imagens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {imagens.map((img) => (
          <div key={img.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative">
              <img 
                src={img.imagem} 
                alt={img.titulo}
                className="w-full h-48 object-cover"
              />
              {!img.ativo && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  Inativo
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-dark-bg mb-2">{img.titulo}</h3>
              
              <div className="flex justify-between items-center">
                <button
                  onClick={() => toggleAtivo(img.id)}
                  className={`text-sm px-3 py-1 rounded ${
                    img.ativo 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {img.ativo ? 'Ativo' : 'Inativo'}
                </button>
                
                <button
                  onClick={() => deletarImagem(img.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  🗑️ Remover
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {imagens.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">Nenhuma imagem cadastrada</p>
        </div>
      )}
    </div>
  );
};

export default GaleriaAdmin;