import React, { useState } from 'react';

// Importe suas imagens
import gallery1 from '../../assets/gallery-1.jpg';
import gallery2 from '../../assets/gallery-2.jpg';
import gallery3 from '../../assets/gallery-3.jpg';
import gallery4 from '../../assets/gallery-4.jpg';
import gallery5 from '../../assets/gallery-5.jpg';
import gallery6 from '../../assets/gallery-6.jpg';
// Adicione mais imagens conforme necessário

const Galeria = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  // Dados da galeria (pode vir de um arquivo separado ou API)
  const galleryImages = [
    { id: 1, path: gallery1, alt: 'Ambiente aconchegante do restaurante' },
    { id: 2, path: gallery2, alt: 'Área externa com mesas' },
    { id: 3, path: gallery3, alt: 'Bar com drinks especiais' },
    { id: 4, path: gallery4, alt: 'Espaço para eventos' },
    { id: 5, path: gallery5, alt: 'Prato especial da casa' },
    { id: 6, path: gallery6, alt: 'Happy hour com amigos' },
    // Adicione mais imagens conforme necessário
  ];

  // Abrir lightbox
  const openLightbox = (imagePath) => {
    setCurrentImage(imagePath);
    setLightboxOpen(true);
    // Prevenir scroll do body quando lightbox está aberto
    document.body.style.overflow = 'hidden';
  };

  // Fechar lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
    setCurrentImage('');
    document.body.style.overflow = 'unset';
  };

  // Fechar com tecla ESC
  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <>
      <section id="galeria" className="py-20 bg-light-bg">
        <div className="container mx-auto px-4">
          
          {/* Título da seção */}
          <div className="text-center mb-12">
            <h2 className="font-['Georgia',serif] text-3xl md:text-4xl text-dark-bg inline-block pb-3 px-6 border-b-2 border-primary">
              Galeria de fotos
            </h2>
          </div>

          {/* Grid da galeria */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {galleryImages.map((image) => (
              <div 
                key={image.id}
                onClick={() => openLightbox(image.path)}
                className="group relative overflow-hidden rounded-lg h-62.5 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <img 
                  src={image.path} 
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
                />
                
                {/* Overlay opcional no hover */}
                <div className="absolute inset-0 bg-linear-to-t from-dark-bg/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <p className="text-white text-sm p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    Clique para ampliar
                  </p>
                </div>

                {/* Ícone de lupa */}
                <div className="absolute top-4 right-4 bg-primary/90 text-dark-bg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Botão Mais fotos */}
          <div className="text-center">
            <button 
              className="bg-primary text-dark-bg font-bold px-10 py-4 rounded-md cursor-pointer transition-all duration-300 shadow-md hover:bg-secondary hover:text-white hover:-translate-y-1 hover:shadow-xl"
              onClick={() => window.location.href = '/galeria-completa'}
            >
              Mais fotos
            </button>
          </div>
        </div>
      </section>

      {/* Lightbox/Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-200 bg-black/90 pt-25 overflow-auto animate-[zoom_0.6s_ease]"
          onClick={closeLightbox}
        >
          {/* Botão fechar */}
          <span 
            className="absolute top-3.75 right-8.75 text-gray-100 text-4xl font-bold transition-colors duration-300 cursor-pointer hover:text-gray-400"
            onClick={closeLightbox}
          >
            &times;
          </span>

          {/* Imagem do lightbox */}
          <img 
            src={currentImage} 
            alt="Imagem ampliada"
            className="block mx-auto w-4/5 max-w-150 animate-[zoom_0.6s_ease]"
          />
        </div>
      )}
    </>
  );
};

export default Galeria;