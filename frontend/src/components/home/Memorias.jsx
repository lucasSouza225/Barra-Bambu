import React from 'react';

const Memorias = () => {
  return (
    <section className="py-20 bg-white text-center">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl lg:text-[32px] font-bold text-text-dark mb-5">
          Momentos que ficam na memória
        </h2>
        <p className="text-sm md:text-base text-text-light leading-relaxed md:leading-[1.8] max-w-200 mx-auto">
          Cada visita ao Barra Bambu é única. Seja um almoço em família, um happy hour com amigos 
          ou uma comemoração especial, estamos aqui para tornar cada momento inesquecível. 
          Nossa equipe dedicada e ambiente acolhedor criam a atmosfera perfeita para você 
          criar memórias que durarão para sempre.
        </p>
      </div>
    </section>
  );
};

export default Memorias;