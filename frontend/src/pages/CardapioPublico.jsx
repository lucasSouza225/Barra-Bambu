import { useState, useEffect } from 'react';
import { cardapioService } from '../service/cardapioService';
import { useCarrinho } from '../contexts/carrinho/CarrinhoContext';
import { 
  FiCoffee, FiHome, FiStar 
} from 'react-icons/fi';
import { 
  IoRestaurant, IoFastFood, IoFish, IoWine, IoIceCream, IoClose 
} from 'react-icons/io5';
import { 
  MdRestaurant, MdRestaurantMenu, MdLocalPizza, MdAdd 
} from 'react-icons/md';
import { FaUtensils, FaCookieBite } from 'react-icons/fa';

const CardapioPublico = () => {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos');
  const [modalAberto, setModalAberto] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [observacao, setObservacao] = useState('');

  const { adicionarItem } = useCarrinho();

  const categorias = [
    { id: 'todos', nome: 'Todos', icon: <MdRestaurantMenu /> },
    { id: 'entradas', nome: 'Entradas', icon: <FaUtensils /> },
    { id: 'principais', nome: 'Pratos Principais', icon: <IoRestaurant /> },
    { id: 'bebidas', nome: 'Bebidas', icon: <IoWine /> },
    { id: 'sobremesas', nome: 'Sobremesas', icon: <IoIceCream /> },
  ];

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

  const itensFiltrados = categoriaAtiva === 'todos'
    ? itens
    : itens.filter(item => item.categoria === categoriaAtiva);

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
    <div className="min-h-screen bg-light-bg p-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-dark-bg mb-12">
          Nosso Cardápio Completo
        </h1>

        {/* Categorias */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoriaAtiva(cat.id)}
              className={`px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-2 ${
                categoriaAtiva === cat.id
                  ? 'bg-primary text-dark-bg font-bold shadow-lg scale-105'
                  : 'bg-white text-gray-600 hover:bg-primary/20'
              }`}
            >
              <span className="text-lg">{cat.icon}</span>
              {cat.nome}
            </button>
          ))}
        </div>

        {/* Grid de itens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {itensFiltrados.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="h-48 overflow-hidden">
                {item.imagem ? (
                  <img
                    src={item.imagem}
                    alt={item.nome}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <IoRestaurant className="text-6xl text-primary/50" />
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-dark-bg">
                    {item.nome}
                  </h3>
                  {item.destaque && (
                    <span className="bg-primary text-dark-bg text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <FiStar className="text-xs" />
                      Destaque
                    </span>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {item.descricao}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">
                    {formatarPreco(item.preco)}
                  </span>
                  <button
                    onClick={() => abrirModal(item)}
                    className="bg-primary text-dark-bg px-4 py-2 rounded-lg hover:bg-secondary transition-colors flex items-center gap-2"
                  >
                    <MdAdd className="text-lg" />
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {itensFiltrados.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl">
              Nenhum item encontrado nesta categoria
            </p>
          </div>
        )}
      </div>

      {/* Modal de quantidade */}
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
    </div>
  );
};

export default CardapioPublico;