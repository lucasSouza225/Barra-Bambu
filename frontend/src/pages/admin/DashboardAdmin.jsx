import { useState, useEffect } from 'react';
import { cardapioService } from '../../service/cardapioService';
import { galeriaService } from '../../service/galeriaService';
import { carrosselService } from '../../service/carrosselService';
import { FiShoppingBag, FiFilm } from 'react-icons/fi';
import { IoImages, IoCafe } from 'react-icons/io5';
import { MdRestaurantMenu, MdViewCarousel } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const DashboardAdmin = () => {
  const navigate = useNavigate();
  
  // Estados para Cardápio
  const [totalItens, setTotalItens] = useState(0);
  const [totalItensDisponiveis, setTotalItensDisponiveis] = useState(0);
  const [totalDestaques, setTotalDestaques] = useState(0);
  
  // Estados para Galeria
  const [totalImagensGaleria, setTotalImagensGaleria] = useState(0);
  const [imagensAtivas, setImagensAtivas] = useState(0);
  const [imagensInativas, setImagensInativas] = useState(0);
  
  // Estados para Carrossel
  const [totalBanners, setTotalBanners] = useState(0);
  const [bannersAtivos, setBannersAtivos] = useState(0);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarTodosDados();
  }, []);

  const carregarTodosDados = async () => {
    try {
      setLoading(true);
      
      // Carregar dados do cardápio
      const itens = await cardapioService.listar();
      setTotalItens(itens.length);
      setTotalItensDisponiveis(itens.filter(item => item.disponivel).length);
      setTotalDestaques(itens.filter(item => item.destaque).length);
      
      // Carregar dados da galeria
      try {
        const galeria = await galeriaService.listar();
        setTotalImagensGaleria(galeria.length);
        setImagensAtivas(galeria.filter(img => img.ativo).length);
        setImagensInativas(galeria.filter(img => !img.ativo).length);
      } catch (error) {
        console.error('Erro ao carregar galeria:', error);
        // Fallback para dados mockados se a API não existir ainda
        setTotalImagensGaleria(4);
        setImagensAtivas(3);
        setImagensInativas(1);
      }
      
      // Carregar dados do carrossel
      try {
        const banners = await carrosselService.listar();
        setTotalBanners(banners.length);
        setBannersAtivos(banners.filter(b => b.ativo).length);
      } catch (error) {
        console.error('Erro ao carregar carrossel:', error);
        // Fallback para dados mockados se a API não existir ainda
        setTotalBanners(3);
        setBannersAtivos(2);
      }
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      id: 1,
      titulo: 'Cardápio',
      descricao: 'Itens cadastrados',
      valor: totalItens,
      icone: <MdRestaurantMenu className="text-3xl text-primary" />,
      bgColor: 'bg-primary/10',
      detalhes: [
        { label: 'Disponíveis', valor: totalItensDisponiveis, cor: 'text-green-600' },
        { label: 'Destaques', valor: totalDestaques, cor: 'text-yellow-600' }
      ]
    },
    {
      id: 2,
      titulo: 'Galeria',
      descricao: 'Imagens cadastradas',
      valor: totalImagensGaleria,
      icone: <IoImages className="text-3xl text-secondary" />,
      bgColor: 'bg-secondary/10',
      detalhes: [
        { label: 'Ativas', valor: imagensAtivas, cor: 'text-green-600' },
        { label: 'Inativas', valor: imagensInativas, cor: 'text-red-600' }
      ]
    },
    {
      id: 3,
      titulo: 'Carrossel',
      descricao: 'Banners do site',
      valor: totalBanners,
      icone: <MdViewCarousel className="text-3xl text-accent" />,
      bgColor: 'bg-accent/10',
      detalhes: [
        { label: 'Ativos', valor: bannersAtivos, cor: 'text-green-600' },
        { label: 'Inativos', valor: totalBanners - bannersAtivos, cor: 'text-red-600' }
      ]
    }
  ];

  // Funções para navegação rápida
  const irParaCardapio = () => navigate('/admin/cardapio');
  const irParaGaleria = () => navigate('/admin/galeria');
  const irParaCarrossel = () => navigate('/admin/carrossel');
  const irParaNovoItem = () => navigate('/admin/cardapio', { state: { novoItem: true } });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-dark-bg flex items-center gap-2">
          <IoCafe className="text-primary" />
          Painel Administrativo
        </h1>
        
        <button 
          onClick={carregarTodosDados}
          className="bg-primary/10 text-dark-bg px-4 py-2 rounded-lg hover:bg-primary/30 transition-colors flex items-center gap-2"
          title="Atualizar dados"
        >
          🔄 Atualizar
        </button>
      </div>

      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => {
              if (card.id === 1) irParaCardapio();
              if (card.id === 2) irParaGaleria();
              if (card.id === 3) irParaCarrossel();
            }}
          >
            {/* Header do card */}
            <div className={`p-4 ${card.bgColor} flex items-center justify-between`}>
              <div>
                <h3 className="text-lg font-bold text-dark-bg">{card.titulo}</h3>
                <p className="text-sm text-gray-600">{card.descricao}</p>
              </div>
              <div className="p-3 bg-white rounded-full shadow-md">
                {card.icone}
              </div>
            </div>

            {/* Conteúdo do card */}
            <div className="p-4">
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-4xl font-bold text-dark-bg">{card.valor}</span>
                <span className="text-sm text-gray-500">total</span>
              </div>

              {/* Detalhes */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                {card.detalhes.map((detalhe, index) => (
                  <div key={index}>
                    <p className="text-sm text-gray-500">{detalhe.label}</p>
                    <p className={`text-xl font-bold ${detalhe.cor}`}>{detalhe.valor}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cards de ações rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card de ações do cardápio */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-dark-bg mb-4 flex items-center gap-2">
            <FiShoppingBag className="text-primary" />
            Ações Rápidas - Cardápio
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={irParaNovoItem}
              className="p-3 bg-primary/10 rounded-lg hover:bg-primary/30 transition-colors text-left"
            >
              <p className="font-semibold text-dark-bg">Adicionar Item</p>
              <p className="text-xs text-gray-500">Novo prato no cardápio</p>
            </button>
            <button 
              onClick={irParaCardapio}
              className="p-3 bg-primary/10 rounded-lg hover:bg-primary/30 transition-colors text-left"
            >
              <p className="font-semibold text-dark-bg">Gerenciar Destaques</p>
              <p className="text-xs text-gray-500">Itens em destaque</p>
            </button>
            <button 
              onClick={irParaCardapio}
              className="p-3 bg-primary/10 rounded-lg hover:bg-primary/30 transition-colors text-left"
            >
              <p className="font-semibold text-dark-bg">Ver Cardápio</p>
              <p className="text-xs text-gray-500">Visualizar todos os itens</p>
            </button>
            <button 
              onClick={irParaCardapio}
              className="p-3 bg-primary/10 rounded-lg hover:bg-primary/30 transition-colors text-left"
            >
              <p className="font-semibold text-dark-bg">Categorias</p>
              <p className="text-xs text-gray-500">Gerenciar categorias</p>
            </button>
          </div>
        </div>

        {/* Card de estatísticas rápidas */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-dark-bg mb-4 flex items-center gap-2">
            <FiFilm className="text-secondary" />
            Resumo do Sistema
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Total de itens no cardápio</span>
              <span className="font-bold text-dark-bg">{totalItens}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Itens disponíveis</span>
              <span className="font-bold text-green-600">{totalItensDisponiveis}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Itens em destaque</span>
              <span className="font-bold text-yellow-600">{totalDestaques}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Imagens na galeria</span>
              <span className="font-bold text-dark-bg">{totalImagensGaleria}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Banners no carrossel</span>
              <span className="font-bold text-dark-bg">{totalBanners}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Banners ativos</span>
              <span className="font-bold text-green-600">{bannersAtivos}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;