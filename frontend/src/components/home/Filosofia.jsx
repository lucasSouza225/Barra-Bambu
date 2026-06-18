import React from "react";
import philosophyImg from "../../assets/philosophy.png";

const Filosofia = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <div className="w-full lg:w-[48%] text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-text-dark mb-6 leading-tight">
              Servimos <span className="text-primary">sabores</span>,{" "}
              <br className="hidden sm:block" />
              momentos, sensações...
            </h2>
            <p className="text-base text-text-light leading-[1.8] max-w-2xl mx-auto lg:mx-0">
              Acreditamos que comer bem vai muito além de apenas saciar a fome.
              É compartilhar momentos especiais, celebrar cada detalhe e a vinda
              para transformar cada almoço em família, ao artesanal experiência
              memorável com pratos sempre no ponto. Cozinha perfeita e
              atendimento de primeira classe transformam cada detalhe e a vinda
              para transformar cada almoço em família, ao artesanal experiência
              memorável com pratos sempre no ponto.
            </p>
          </div>

          {/* Imagem */}
          <div className="w-full lg:w-[48%] flex justify-center">
            <div className="relative">
              <img
                src={philosophyImg}
                alt="Filosofia do Barra Bambu"
                className="w-100 max-w-sm md:max-w-md lg:max-w-full rounded-2xl shadow-2xl hover:scale-[1.02] transition-transform duration-500"
              />
             
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-primary/20 rounded-full -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Filosofia;
