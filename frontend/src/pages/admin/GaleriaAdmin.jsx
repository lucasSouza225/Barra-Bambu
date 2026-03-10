import { useState } from 'react';
import { IoImageOutline } from 'react-icons/io5';
import { MdDelete, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { FiPlus } from 'react-icons/fi';

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
      imagem: '',
      ativo: true
    },
    {
      id: 3,
      titulo: 'Espaço para Eventos',
      imagem: '',
      ativo: false
    },
    {
      id: 4,
      titulo: 'Happy Hour',
      imagem: '',
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
    
    const nova = {
      ...novaImagem,
      id: Date.now(),
      imagem: novaImagem.imagem // Agora pode ser vazio
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
          className="bg-primary text-dark-bg px-4 py-2 rounded-lg hover:bg-secondary transition-colors flex items-center gap-2"
        >
          {mostrarForm ? 'Cancelar' : <><FiPlus /> Nova Imagem</>}
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
                Deixe em branco para usar ícone padrão
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
          <div key={img.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="relative h-48 bg-gray-100">
              {img.imagem ? (
                <img 
                  src={img.imagem} 
                  alt={img.titulo}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><IoImageOutline class="text-4xl text-gray-400" /></div>';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <IoImageOutline className="text-6xl text-gray-400" />
                </div>
              )}
              
              {/* Badge de status */}
              <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs flex items-center gap-1 ${
                img.ativo 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-500 text-white'
              }`}>
                {img.ativo ? <MdVisibility /> : <MdVisibilityOff />}
                {img.ativo ? 'Ativo' : 'Inativo'}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-dark-bg mb-3">{img.titulo}</h3>
              
              <div className="flex justify-between items-center">
                <button
                  onClick={() => toggleAtivo(img.id)}
                  className={`text-sm px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                    img.ativo 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {img.ativo ? 'Desativar' : 'Ativar'}
                </button>
                
                <button
                  onClick={() => deletarImagem(img.id)}
                  className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  title="Remover"
                >
                  <MdDelete className="text-xl" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {imagens.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <IoImageOutline className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Nenhuma imagem cadastrada</p>
        </div>
      )}
    </div>
  );
};

export default GaleriaAdmin;