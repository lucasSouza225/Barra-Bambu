import { useState, useEffect } from 'react';
import { cardapioService } from '../../service/cardapioService';
import { Link } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';
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
      <section className="py-16 bg-light-bg">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-dark-bg mb-12">
            Destaques do Cardápio
          </h2>
          <div className="flex justify-center">
            <IoRestaurant className="text-4xl text-primary animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  if (destaques.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-light-bg">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-dark-bg mb-4 flex items-center justify-center gap-2">
          <FiStar className="text-yellow-500" />
          Destaques do Cardápio
          <FiStar className="text-yellow-500" />
        </h2>

        {/* Grid de imagens - só foto e título */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {destaques.map((item) => (
            <Link
              key={item._id}
              to="/cardapio-publico"
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              {/* Apenas a imagem */}
              <div className="aspect-square overflow-hidden">
                {item.imagem ? (
                  <img
                    src={item.imagem}
                    alt={item.nome}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x400/38241B/FFD301?text=Erro';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <IoRestaurant className="text-4xl text-gray-400" />
                  </div>
                )}
              </div>

              {/* Apenas o título (overlay no hover) */}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <h3 className="text-white text-lg font-bold">
                  {item.nome}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CardapioDestaques;