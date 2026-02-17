import { useState, useEffect } from 'react';

// Imagens de exemplo - substitua pelas suas
import img1 from '../../assets/carrossel1.jpeg';
import img2 from '../../assets/carrossel2.jpeg';
import img3 from '../../assets/carrossel3.jpeg';
import img4 from '../../assets/carrossel4.jpeg';

const Carrossel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const slides = [
    {
      id: 1,
      image: img1,
      title: 'Ambiente Aconchegante',
      description: 'Espaço perfeito para momentos especiais'
    },
    {
      id: 2,
      image: img2,
      title: 'Gastronomia Premium',
      description: 'Sabores únicos e ingredientes selecionados'
    },
    {
      id: 3,
      image: img3,
      title: 'Chef Especialista',
      description: 'Experiência e paixão pela culinária'
    },
    {
      id: 4,
      image: img4,
      title: 'Momentos Inesquecíveis',
      description: 'Celebre conosco suas ocasiões especiais'
    }
  ];

  // Auto-play do carrossel
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  return (
    <div className="relative w-full h-150 overflow-hidden bg-dark-bg">
      {/* Slides com efeito dissolver (fade) */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out
              ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {/* Imagem de fundo com overlay escuro */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Apenas título e descrição */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in-up">
                {slide.title}
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl max-w-2xl animate-fade-in-up animation-delay-200">
                {slide.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Botões de navegação */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 group"
        aria-label="Slide anterior"
      >
        <svg 
          className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 group"
        aria-label="Próximo slide"
      >
        <svg 
          className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Apenas os dots indicadores */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-500 rounded-full
              ${index === currentIndex 
                ? 'w-10 h-3 bg-primary' 
                : 'w-3 h-3 bg-white/50 hover:bg-white/80'}`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carrossel;