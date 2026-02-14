import React from 'react';
import philosophyImg from '../../assets/philosophy.jpg';

const Filosofia = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-[50px] items-center">
          
          {/* Texto */}
          <div className="space-y-5">
            <h2 className="text-2xl md:text-3xl lg:text-[32px] font-bold text-text-dark mb-5">
              Servimos sabores, momentos, sensações...
            </h2>
            <p className="text-base text-text-light leading-[1.8]">
              Acreditamos que comer bem vai muito além de apenas saciar a fome. 
              É compartilhar momentos especiais, celebrar cada detalhe e a vinda 
              para transformar cada almoço em família, ao artesanal experiência 
              memorável com pratos sempre no ponto. Cozinha perfeita e atendimento 
              de primeira classe transformam cada detalhe e a vinda para transformar 
              cada almoço em família, ao artesanal experiência memorável com pratos 
              sempre no ponto.
            </p>
          </div>

          {/* Imagem */}
          <div className="philosophy-image">
            <img 
              src={philosophyImg} 
              alt="Filosofia do Barra Bambu"
              className="w-full rounded-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Filosofia;