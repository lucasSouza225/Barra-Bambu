import React from 'react';
import promo1 from '../../assets/promo-1.jpg';
import promo2 from '../../assets/promo-2.jpg';
import promo3 from '../../assets/promo-3.jpg';
import promo4 from '../../assets/promo-4.jpg';

const Promo = () => {
  const promocoes = [
    {
      id: 1,
      imagem: promo1,
      titulo: 'Promoções de Chope',
      alt: 'Promoção 1'
    },
    {
      id: 2,
      imagem: promo2,
      titulo: 'Drinks Deliciosos',
      alt: 'Promoção 2'
    },
    {
      id: 3,
      imagem: promo3,
      titulo: 'Delivery',
      alt: 'Promoção 3'
    },
    {
      id: 4,
      imagem: promo4,
      titulo: 'Eventos',
      alt: 'Promoção 4'
    }
  ];

  return (
    <section className="p-15 bg-light-bg "
>
      <div className="container mx-auto px-4 ">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {promocoes.map((promo) => (
            <div 
              key={promo.id}
              className="relative overflow-hidden rounded-lg w-[95%] h-85 cursor-pointer group mx-auto lg:mx-0"
            >
              {/* Imagem */}
              <img 
                src={promo.imagem} 
                alt={promo.alt}
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                <p className="text-white text-xl font-bold text-center px-4">
                  {promo.titulo}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Promo;