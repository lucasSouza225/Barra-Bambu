import { useState, useEffect } from 'react';
import { cardapioService } from '../service/cardapioService';
import { useCarrinho } from '../contexts/carrinho/CarrinhoContext';
import { FiStar, FiCheck } from 'react-icons/fi';
import { 
  IoRestaurant, IoWine, IoIceCream, IoClose 
} from 'react-icons/io5';
import { 
  MdRestaurantMenu, MdAdd 
} from 'react-icons/md';
import { FaUtensils } from 'react-icons/fa';

const CardapioPublico = () => {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos');
  const [modalAberto, setModalAberto] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [observacao, setObservacao] = useState('');
  
  // NOVO: Estado para mensagem de confirmação
  const [mensagemConfirmacao, setMensagemConfirmacao] = useState(null);

  const { adicionarItem } = useCarrinho();

  // Categorias para os botões
  const categorias = [
    { id: 'todos', nome: 'Todos', icon: <MdRestaurantMenu /> },
    { id: 'entradas', nome: 'Entradas', icon: <FaUtensils /> },
    { id: 'principais', nome: 'Pratos Principais', icon: <IoRestaurant /> },
    { id: 'bebidas', nome: 'Bebidas', icon: <IoWine /> },
    { id: 'sobremesas', nome: 'Sobremesas', icon: <IoIceCream /> },
  ];

  // Configuração das seções
  const categoriasConfig = {
    entradas: { 
      nome: 'Entradas', 
      icon: <FaUtensils className="text-xl text-primary" />,
      borderColor: 'border-primary'
    },
    principais: { 
      nome: 'Pratos Principais', 
      icon: <IoRestaurant className="text-xl text-primary" />,
      borderColor: 'border-primary'
    },
    bebidas: { 
      nome: 'Bebidas', 
      icon: <IoWine className="text-xl text-yellow-500" />,
      borderColor: 'border-yellow-500'
    },
    sobremesas: { 
      nome: 'Sobremesas', 
      icon: <IoIceCream className="text-xl text-pink-500" />,
      borderColor: 'border-pink-500'
    }
  };

  // NOVO: Função para mostrar mensagem de confirmação
  const mostrarConfirmacao = (nomeItem, quantidadeItem) => {
    setMensagemConfirmacao({ nome: nomeItem, quantidade: quantidadeItem });
    setTimeout(() => {
      setMensagemConfirmacao(null);
    }, 3000); // Mensagem some após 3 segundos
  };

  useEffect(() => {
    carregarCardapio();
  }, []);

  const carregarCardapio = async () => {
    try {
      setLoading(true);
      const data = await cardapioService.listar();
      const disponiveis = data.filter(item => item.disponivel !== false);
      setItens(disponiveis);
    } catch (error) {
      console.error('Erro ao carregar cardápio:', error);
    } finally {
      setLoading(false);
    }
  };

  // Agrupar itens por categoria
  const itensPorCategoria = {};
  if (categoriaAtiva === 'todos') {
    itens.forEach(item => {
      const cat = item.categoria;
      if (!itensPorCategoria[cat]) {
        itensPorCategoria[cat] = [];
      }
      itensPorCategoria[cat].push(item);
    });
  }

  // Itens filtrados
  const itensFiltrados = categoriaAtiva !== 'todos'
    ? itens.filter(item => item.categoria === categoriaAtiva)
    : [];

  const abrirModal = (item) => {
    setItemSelecionado(item);
    setQuantidade(1);
    setObservacao('');
    setModalAberto(true);
  };

  const handleAdicionarAoCarrinho = () => {
    adicionarItem({
      ...itemSelecionado,
      observacao: observacao
    }, quantidade);
    setModalAberto(false);
    
    // NOVO: Mostrar mensagem de confirmação
    mostrarConfirmacao(itemSelecionado.nome, quantidade);
  };

  const formatarPreco = (preco) => {
    return preco.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light-bg py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xl">Carregando cardápio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-bg py-8 md:py-16 relative">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-dark-bg mb-4">
          Nosso Cardápio
        </h1>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Sabores únicos preparados com muito carinho para você
        </p>

        {/* BOTÕES DE FILTRO */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoriaAtiva(cat.id)}
              className={`px-5 py-2 rounded-full transition-all duration-300 flex items-center gap-2 text-sm md:text-base ${
                categoriaAtiva === cat.id
                  ? 'bg-primary text-dark-bg font-bold shadow-md scale-105'
                  : 'bg-white text-gray-600 hover:bg-primary/20'
              }`}
            >
              <span className="text-base md:text-lg">{cat.icon}</span>
              <span className="hidden sm:inline">{cat.nome}</span>
              <span className="sm:hidden">{cat.nome.substring(0, 3)}</span>
            </button>
          ))}
        </div>

        {/* MODO: TODAS AS CATEGORIAS */}
        {categoriaAtiva === 'todos' && (
          <div className="space-y-12 md:space-y-16">
            {Object.entries(itensPorCategoria).map(([categoria, itensDaCat]) => {
              const config = categoriasConfig[categoria] || {
                nome: categoria.charAt(0).toUpperCase() + categoria.slice(1),
                icon: <MdRestaurantMenu className="text-xl text-primary" />,
                borderColor: 'border-primary'
              };
              
              return (
                <div key={categoria}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center gap-2">
                      {config.icon}
                      <h2 className="text-lg md:text-xl font-bold text-dark-bg">
                        {config.nome}
                      </h2>
                    </div>
                    <div className={`flex-1 h-px bg-linear-to-r ${config.borderColor} from-${config.borderColor.split('-')[1]} to-transparent`}></div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {itensDaCat.map((item) => (
                      <div
                        key={item._id}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div className="h-44 md:h-48 overflow-hidden relative">
                          {item.imagem ? (
                            <img
                              src={item.imagem}
                              alt={item.nome}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                              <IoRestaurant className="text-5xl md:text-6xl text-primary/50" />
                            </div>
                          )}
                          
                          {item.destaque && (
                            <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                              <FiStar className="text-xs" />
                              Destaque
                            </div>
                          )}
                        </div>

                        <div className="p-4">
                          <h3 className="text-base md:text-lg font-bold text-dark-bg mb-2">
                            {item.nome}
                          </h3>
                          
                          <p className="text-gray-600 text-xs md:text-sm mb-4 line-clamp-2">
                            {item.descricao}
                          </p>

                          <div className="flex justify-between items-center">
                            <span className="text-lg md:text-xl font-bold text-primary">
                              {formatarPreco(item.preco)}
                            </span>
                            <button
                              onClick={() => abrirModal(item)}
                              className="bg-primary text-dark-bg px-3 py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-secondary transition-colors flex items-center gap-1 text-sm md:text-base"
                            >
                              <MdAdd className="text-base md:text-lg" />
                              Adicionar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* MODO: CATEGORIA ESPECÍFICA */}
        {categoriaAtiva !== 'todos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {itensFiltrados.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="h-44 md:h-48 overflow-hidden relative">
                  {item.imagem ? (
                    <img
                      src={item.imagem}
                      alt={item.nome}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <IoRestaurant className="text-5xl md:text-6xl text-primary/50" />
                    </div>
                  )}
                  
                  {item.destaque && (
                    <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                      <FiStar className="text-xs" />
                      Destaque
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-base md:text-lg font-bold text-dark-bg mb-2">
                    {item.nome}
                  </h3>
                  
                  <p className="text-gray-600 text-xs md:text-sm mb-4 line-clamp-2">
                    {item.descricao}
                  </p>

                  <div className="flex justify-between items-center">
                    <span className="text-lg md:text-xl font-bold text-primary">
                      {formatarPreco(item.preco)}
                    </span>
                    <button
                      onClick={() => abrirModal(item)}
                      className="bg-primary text-dark-bg px-3 py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-secondary transition-colors flex items-center gap-1 text-sm md:text-base"
                    >
                      <MdAdd className="text-base md:text-lg" />
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mensagem quando não tem itens */}
        {categoriaAtiva !== 'todos' && itensFiltrados.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Nenhum item encontrado nesta categoria
            </p>
          </div>
        )}
      </div>

      {/* MODAL DE QUANTIDADE */}
      {modalAberto && itemSelecionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-dark-bg mb-4">
              {itemSelecionado.nome}
            </h3>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Quantidade</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                  className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 text-xl"
                >
                  -
                </button>
                <span className="text-2xl font-bold w-16 text-center">
                  {quantidade}
                </span>
                <button
                  onClick={() => setQuantidade(quantidade + 1)}
                  className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 text-xl"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Observações (opcional)
              </label>
              <textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Ex: sem cebola, ponto da carne, etc..."
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
                rows="3"
              />
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Total:</span>
              <span className="text-2xl font-bold text-primary">
                {formatarPreco(itemSelecionado.preco * quantidade)}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAdicionarAoCarrinho}
                className="flex-1 bg-primary text-dark-bg py-3 rounded-lg hover:bg-secondary transition-colors font-bold"
              >
                Adicionar ao Carrinho
              </button>
              <button
                onClick={() => setModalAberto(false)}
                className="px-4 py-3 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
              >
                <IoClose className="text-2xl" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOVO: MENSAGEM DE CONFIRMAÇÃO (TOAST) */}
      {mensagemConfirmacao && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-up">
          <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
            <FiCheck className="text-xl" />
            <span>
              Adicionado ao carrinho!
            </span>
          </div>
        </div>
      )}
     
    </div>
  );
};

export default CardapioPublico;