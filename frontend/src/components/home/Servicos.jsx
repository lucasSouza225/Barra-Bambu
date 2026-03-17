import { FiPercent } from 'react-icons/fi';

import promo1 from '../../assets/promo-1.jpg';
import promo2 from '../../assets/promo-2.jpg';
import promo3 from '../../assets/promo-3.jpg';
import promo4 from '../../assets/promo-4.jpg';

const Servicos = () => {
  const promocoes = [
    { id: 1, imagem: promo1 },
    { id: 2, imagem: promo2 },
    { id: 3, imagem: promo3 },
    { id: 4, imagem: promo4 }
  ];

  return (
    <section className="py-8 bg-light-bg">
      <div className="container mx-auto px-4">
        {/* Título */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-dark-bg">
            Nossos Serviços
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mt-2"></div>
        </div>

        {/* Mobile: Scroll */}
        <div className="lg:hidden overflow-x-auto pb-4 -mx-4 px-4">
          <div className="flex gap-4">
            {promocoes.map((promo) => (
              <div
                key={promo.id}
                className="flex-shrink-0 w-48 h-48 rounded-lg overflow-hidden shadow-md"
              >
                <img
                  src={promo.imagem}
                  alt="Serviço"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-6">
          {promocoes.map((promo) => (
            <div
              key={promo.id}
              className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <img
                src={promo.imagem}
                alt="Serviço"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Servicos;