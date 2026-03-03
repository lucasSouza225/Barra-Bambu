import { useState } from 'react';

const CarrosselAdmin = () => {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [banners, setBanners] = useState([
    {
      id: 1,
      titulo: 'Ambiente Aconchegante',
      descricao: 'Espaço perfeito para momentos especiais',
      imagem: 'https://via.placeholder.com/1920x600/38241B/FFD301?text=Banner+1',
      ordem: 1,
      ativo: true
    },
    {
      id: 2,
      titulo: 'Gastronomia Premium',
      descricao: 'Sabores únicos e ingredientes selecionados',
      imagem: 'https://via.placeholder.com/1920x600/719A0A/FFFFFF?text=Banner+2',
      ordem: 2,
      ativo: true
    },
    {
      id: 3,
      titulo: 'Eventos Especiais',
      descricao: 'Celebre conosco suas ocasiões',
      imagem: 'https://via.placeholder.com/1920x600/FFD301/38241B?text=Banner+3',
      ordem: 3,
      ativo: false
    }
  ]);

  const [novoBanner, setNovoBanner] = useState({
    titulo: '',
    descricao: '',
    imagem: '',
    ordem: banners.length + 1,
    ativo: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNovoBanner(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const novo = {
      ...novoBanner,
      id: Date.now(),
      imagem: novoBanner.imagem || `https://via.placeholder.com/1920x600/CCCCCC/FFFFFF?text=${novoBanner.titulo || 'Novo+Banner'}`
    };
    
    setBanners([...banners, novo]);
    setNovoBanner({
      titulo: '',
      descricao: '',
      imagem: '',
      ordem: banners.length + 2,
      ativo: true
    });
    setMostrarForm(false);
  };

  const toggleAtivo = (id) => {
    setBanners(banners.map(banner => 
      banner.id === id ? { ...banner, ativo: !banner.ativo } : banner
    ));
  };

  const deletarBanner = (id) => {
    if (window.confirm('Tem certeza que deseja remover este banner?')) {
      setBanners(banners.filter(banner => banner.id !== id));
    }
  };

  const moverOrdem = (id, direcao) => {
    const bannerIndex = banners.findIndex(b => b.id === id);
    if (
      (direcao === 'up' && bannerIndex === 0) || 
      (direcao === 'down' && bannerIndex === banners.length - 1)
    ) {
      return;
    }

    const newBanners = [...banners];
    const targetIndex = direcao === 'up' ? bannerIndex - 1 : bannerIndex + 1;
    
    // Troca as ordens
    const tempOrdem = newBanners[bannerIndex].ordem;
    newBanners[bannerIndex].ordem = newBanners[targetIndex].ordem;
    newBanners[targetIndex].ordem = tempOrdem;
    
    // Troca as posições
    [newBanners[bannerIndex], newBanners[targetIndex]] = [newBanners[targetIndex], newBanners[bannerIndex]];
    
    setBanners(newBanners);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-dark-bg">Gerenciar Carrossel</h1>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="bg-primary text-dark-bg px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
        >
          {mostrarForm ? 'Cancelar' : '+ Novo Banner'}
        </button>
      </div>

      {/* Formulário para novo banner */}
      {mostrarForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-4 text-dark-bg">Adicionar Novo Banner</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título do banner
              </label>
              <input
                type="text"
                name="titulo"
                value={novoBanner.titulo}
                onChange={handleChange}
                placeholder="Ex: Promoção de fim de semana"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                name="descricao"
                value={novoBanner.descricao}
                onChange={handleChange}
                placeholder="Breve descrição do banner"
                rows="3"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL da imagem
              </label>
              <input
                type="text"
                name="imagem"
                value={novoBanner.imagem}
                onChange={handleChange}
                placeholder="https://exemplo.com/banner.jpg"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ordem de exibição
              </label>
              <input
                type="number"
                name="ordem"
                value={novoBanner.ordem}
                onChange={handleChange}
                min="1"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="ativo"
                id="ativo"
                checked={novoBanner.ativo}
                onChange={handleChange}
                className="h-4 w-4 text-primary rounded focus:ring-primary"
              />
              <label htmlFor="ativo" className="ml-2 text-sm text-gray-700">
                Banner ativo
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

      {/* Lista de banners */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Ordem</th>
              <th className="p-3 text-left">Imagem</th>
              <th className="p-3 text-left">Título</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {banners.sort((a, b) => a.ordem - b.ordem).map((banner) => (
              <tr key={banner.id} className="border-t">
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    <span className="font-bold">{banner.ordem}</span>
                    <div className="flex flex-col ml-2">
                      <button 
                        onClick={() => moverOrdem(banner.id, 'up')}
                        className="text-gray-500 hover:text-primary text-xs"
                      >
                        ▲
                      </button>
                      <button 
                        onClick={() => moverOrdem(banner.id, 'down')}
                        className="text-gray-500 hover:text-primary text-xs"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <img 
                    src={banner.imagem} 
                    alt={banner.titulo}
                    className="w-20 h-12 object-cover rounded"
                  />
                </td>
                <td className="p-3 font-medium">{banner.titulo}</td>
                <td className="p-3">
                  <button
                    onClick={() => toggleAtivo(banner.id)}
                    className={`text-sm px-3 py-1 rounded ${
                      banner.ativo 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {banner.ativo ? 'Ativo' : 'Inativo'}
                  </button>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => deletarBanner(banner.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {banners.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum banner cadastrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarrosselAdmin;