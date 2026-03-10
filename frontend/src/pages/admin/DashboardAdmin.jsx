import { useState, useEffect } from 'react';
import { cardapioService } from '../../service/cardapioService';
import { FiShoppingBag, FiImage, FiFilm } from 'react-icons/fi';
import { IoRestaurant, IoImages, IoCafe } from 'react-icons/io5';
import { MdRestaurantMenu, MdPhotoLibrary, MdViewCarousel } from 'react-icons/md';

const DashboardAdmin = () => {
  const [totalItens, setTotalItens] = useState(0);
  const [totalItensDisponiveis, setTotalItensDisponiveis] = useState(0);
  const [totalDestaques, setTotalDestaques] = useState(0);
  const [loading, setLoading] = useState(true);

  // Dados mockados para galeria e carrossel (depois você substitui por chamadas reais)
  const totalImagensGaleria = 4;
  const totalBannersAtivos = 2;

  useEffect(() => {
    carregarDadosCardapio();
  }, []);

  const carregarDadosCardapio = async () => {
    try {
      setLoading(true);
      const itens = await cardapioService.listar();
      
      setTotalItens(itens.length);
      setTotalItensDisponiveis(itens.filter(item => item.disponivel).length);
      setTotalDestaques(itens.filter(item => item.destaque).length);
      
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
        { label: 'Ativas', valor: 3, cor: 'text-green-600' },
        { label: 'Inativas', valor: 1, cor: 'text-red-600' }
      ]
    },
    {
      id: 3,
      titulo: 'Carrossel',
      descricao: 'Banners do site',
      valor: totalBannersAtivos,
      icone: <MdViewCarousel className="text-3xl text-accent" />,
      bgColor: 'bg-accent/10',
      detalhes: [
        { label: 'Ativos', valor: totalBannersAtivos, cor: 'text-green-600' },
        { label: 'Ordem', valor: '1-3', cor: 'text-gray-600' }
      ]
    }
  ];

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
          Dashboard Administrativo
        </h1>
        
        <div className="bg-white px-4 py-2 rounded-lg shadow">
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
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
            <button className="p-3 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors text-left">
              <p className="font-semibold text-dark-bg">Adicionar Item</p>
              <p className="text-xs text-gray-500">Novo prato no cardápio</p>
            </button>
            <button className="p-3 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors text-left">
              <p className="font-semibold text-dark-bg">Gerenciar Destaques</p>
              <p className="text-xs text-gray-500">Itens em destaque</p>
            </button>
            <button className="p-3 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors text-left">
              <p className="font-semibold text-dark-bg">Ver Cardápio</p>
              <p className="text-xs text-gray-500">Visualizar todos os itens</p>
            </button>
            <button className="p-3 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors text-left">
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
              <span className="text-gray-600">Banners ativos</span>
              <span className="font-bold text-dark-bg">{totalBannersAtivos}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;