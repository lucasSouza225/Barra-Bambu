import React from 'react';
import { Link } from 'react-router-dom';

// Importe suas imagens
import menu1 from '../../assets/menu-1.jpg';
import menu2 from '../../assets/menu-2.jpg';
import menu3 from '../../assets/menu-3.jpg';
import menu4 from '../../assets/menu-4.jpg';
import menu5 from '../../assets/menu-5.jpg';
import menu6 from '../../assets/menu-6.jpg';
import menu7 from '../../assets/menu-7.jpg';
import menu8 from '../../assets/menu-8.jpg';
import menu9 from '../../assets/menu-9.jpg';
import menu10 from '../../assets/menu-10.jpg';
import menu11 from '../../assets/menu-11.jpg';
import menu12 from '../../assets/menu-12.jpg';

const Cardapio = () => {
  const menuItems = [
    { id: 1, imagem: menu1, titulo: 'Prato Especial' },
    { id: 2, imagem: menu2, titulo: 'Salmão Grelhado' },
    { id: 3, imagem: menu3, titulo: 'Carne Assada' },
    { id: 4, imagem: menu4, titulo: 'Frutos do Mar' },
    { id: 5, imagem: menu5, titulo: 'Prato Executivo' },
    { id: 6, imagem: menu6, titulo: 'Bebida Especial' },
    { id: 7, imagem: menu7, titulo: 'Entrada' },
    { id: 8, imagem: menu8, titulo: 'Bebida Refrescante' },
    
  ];

  return (
    <section id="cardapio" className="p-20 bg-white">
      <div className="container mx-auto px-4">
        
        {/* Título com linha dourada */}
        <div className="text-center mb-12">
          <h2 className="font-['Georgia',serif] text-4xl text-dark-bg inline-block pb-3 border-b-2 border-primary">
            Menu
          </h2>
        </div>

        {/* Grid de itens do menu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
          {menuItems.map((item) => (
            <div 
              key={item.id}
              className="relative overflow-hidden rounded-lg h-60 cursor-pointer group
             w-full sm:w-[95%] md:w-full mx-auto"
            >
              {/* Imagem */}
              <img 
                src={item.imagem} 
                alt={item.titulo}
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-115 group-hover:rotate-2"
              />
              
              {/* Overlay padrão (preto) */}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:bg-[#4B2E20]/70">
                <p className="text-white text-lg font-bold text-center px-4">
                  {item.titulo}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Botão Ver Cardápio */}
        <div className="text-center">
          <Link to="/cardapio">
            <button className="bg-primary text-dark-bg font-bold px-10 py-4 rounded-md cursor-pointer transition-all duration-300 shadow-md hover:bg-secondary hover:text-white hover:-translate-y-0.5 hover:shadow-xl">
              Ver Cardápio
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Cardapio;