import { useState, useEffect, useCallback } from "react";
import { carrosselService } from "../../service/carrosselService";
import { FiImage } from "react-icons/fi";

const Carrossel = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarBanners();
  }, []);

  const carregarBanners = async () => {
    try {
      const data = await carrosselService.listarAtivos();

      const slidesFormatados = data.map((banner) => ({
        id: banner._id,
        image: banner.imagem,
        title: banner.titulo,
        description: banner.descricao || "Conheça o Barra Bambu",
      }));

      setSlides(slidesFormatados);
      setCurrentIndex(0);
    } catch (error) {
      console.error("Erro ao carregar banners:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = useCallback(() => {
    if (isTransitioning || slides.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, slides.length]);

  const prevSlide = () => {
    if (isTransitioning || slides.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length,
    );
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentIndex || slides.length === 0)
      return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  useEffect(() => {
    if (slides.length === 0) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(timer);
  }, [nextSlide, slides.length]);

  if (loading) {
    return (
      <div className="relative w-full h-150 overflow-hidden bg-dark-bg flex items-center justify-center">
        <div className="text-white text-xl">Carregando banners...</div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="relative w-full h-150 overflow-hidden bg-dark-bg flex items-center justify-center">
        <div className="text-center text-white">
          <FiImage className="text-6xl mx-auto mb-4 opacity-50" />
          <p className="text-xl">Em breve novidades!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-150 overflow-hidden bg-dark-bg">
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-2000 ease-in-out
              ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black/40"></div>
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in-up">
                {slide.title}
              </h2>
              <p className="text-base md:text-lg lg:text-xl max-w-2xl text-white/60 animate-fade-in-up animation-delay-200">
                {slide.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-500 rounded-full
                ${
                  index === currentIndex
                    ? "w-10 h-3 bg-primary"
                    : "w-3 h-3 bg-white/50 hover:bg-white/80"
                }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carrossel;
