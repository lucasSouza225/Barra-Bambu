import { useState, useEffect } from 'react';
import { cardapioService } from '../../service/cardapioService';
import { Link } from 'react-router-dom';
import { FiStar, FiArrowRight } from 'react-icons/fi';
import { IoRestaurant } from 'react-icons/io5';

const CardapioDestaques = () => {
  const [destaques, setDestaques] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDestaques();
  }, []);

  const carregarDestaques = async () => {
    try {
      setLoading(true);
      const data = await cardapioService.listarDestaques();
      setDestaques(data);
    } catch (error) {
      console.error('Erro ao carregar destaques:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="cardapio" className="py-12 md:py-16 bg-light-bg">
        <div className="container mx-auto px-2">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-dark-bg mb-8 md:mb-12">
            Destaques do Cardápio
          </h2>
          <div className="flex justify-center">
            <IoRestaurant className="text-3xl md:text-4xl text-primary animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  if (destaques.length === 0) {
    return null;
  }

  return (
    <section id="cardapio" className="py-12 md:py-16 bg-light-bg">
      <div className="container mx-auto px-4">
        {/* Título responsivo */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark-bg flex items-center justify-center gap-2 flex-wrap">
            <FiStar className="text-yellow-500 text-xl sm:text-2xl md:text-3xl" />
            Destaques do Cardápio
            <FiStar className="text-yellow-500 text-xl sm:text-2xl md:text-3xl" />
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-2xl mx-auto">
            Os pratos mais amados pelos nossos clientes
          </p>
        </div>

        {/* Grid responsivo */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
          {destaques.slice(0, 6).map((item) => ( // Limite de 6 itens 
            <Link
              key={item._id}
              to="/cardapio-publico"
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Container da imagem com tamanho responsivo */}
              <div className="aspect-square overflow-hidden bg-gray-100">
                {item.imagem ? (
                  <img
                    src={item.imagem}
                    alt={item.nome}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><IoRestaurant class="text-3xl text-gray-400" /></div>';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <IoRestaurant className="text-3xl text-gray-400" />
                  </div>
                )}
              </div>

              {/* Overlay com nome do prato (aparece no hover) */}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2 sm:p-3">
                <h3 className="text-white text-xs sm:text-sm md:text-base font-bold line-clamp-2">
                  {item.nome}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Botão para ver cardápio completo */}
        <div className="text-center mt-8 md:mt-12">
          <Link
            to="/cardapio-publico"
            className="inline-flex items-center gap-2 bg-primary text-dark-bg px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base hover:bg-secondary transition-colors group"
          >
            Ver Cardápio Completo
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CardapioDestaques;