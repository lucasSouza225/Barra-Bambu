import { useState, useEffect } from 'react';
import { galeriaService } from '../../service/galeriaService';
import { FiImage, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { IoImages } from 'react-icons/io5';

const Galeria = () => {
  const [imagens, setImagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [imagemSelecionada, setImagemSelecionada] = useState(null);
  const [indiceAtual, setIndiceAtual] = useState(0);
  
  // Estados para paginação
  const [limite, setLimite] = useState(8);
  const [carregandoMais, setCarregandoMais] = useState(false);

  useEffect(() => {
    carregarImagens();
  }, []);

  const carregarImagens = async () => {
    try {
      setLoading(true);
      const data = await galeriaService.listarAtivas();
      setImagens(data);
    } catch (error) {
      console.error('Erro ao carregar galeria:', error);
    } finally {
      setLoading(false);
    }
  };

  const imagensParaMostrar = imagens.slice(0, limite);
  const temMaisImagens = limite < imagens.length;

  const carregarMais = () => {
    setCarregandoMais(true);
    setTimeout(() => {
      setLimite(prev => prev + 8);
      setCarregandoMais(false);
    }, 500);
  };

  const abrirModal = (imagem, index) => {
    setImagemSelecionada(imagem);
    setIndiceAtual(index);
    setModalAberto(true);
    document.body.style.overflow = 'hidden';
  };

  const fecharModal = () => {
    setModalAberto(false);
    setImagemSelecionada(null);
    document.body.style.overflow = 'unset';
  };

  const proximaImagem = () => {
    const novoIndice = (indiceAtual + 1) % imagens.length;
    setIndiceAtual(novoIndice);
    setImagemSelecionada(imagens[novoIndice]);
  };

  const imagemAnterior = () => {
    const novoIndice = (indiceAtual - 1 + imagens.length) % imagens.length;
    setIndiceAtual(novoIndice);
    setImagemSelecionada(imagens[novoIndice]);
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') fecharModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-light-bg">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-dark-bg mb-8 md:mb-12">
            Nossa Galeria
          </h2>
          <div className="flex justify-center items-center h-64">
            <IoImages className="text-3xl md:text-4xl text-primary animate-pulse mr-2" />
            <div className="text-lg md:text-xl">Carregando galeria...</div>
          </div>
        </div>
      </section>
    );
  }

  if (imagens.length === 0) {
    return (
      <section className="py-12 md:py-16 bg-light-bg">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-dark-bg mb-8 md:mb-12">
            Nossa Galeria
          </h2>
          <div className="text-center py-12">
            <FiImage className="text-5xl md:text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg md:text-xl">Em breve novas fotos!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-12 md:py-16 bg-light-bg">
        <div className="container mx-auto px-4">
          {/* Título responsivo */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-bg mb-2">
              Nossa Galeria
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              Momentos especiais do nosso espaço
            </p>
          </div>

          {/* Grid responsivo de imagens */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-4">
            {imagensParaMostrar.map((imagem, index) => (
              <div
                key={imagem._id}
                onClick={() => abrirModal(imagem, index)}
                className="group relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl cursor-pointer transition-all duration-300 hover:scale-105"
              >
                {imagem.imagem ? (
                  <img
                    src={imagem.imagem}
                    alt={imagem.titulo}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gray-200 flex items-center justify-center"><FiImage class="text-3xl text-gray-400" /></div>';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <FiImage className="text-3xl text-gray-400" />
                  </div>
                )}

                {/* Overlay simples no hover (só pra mostrar que é clicável) */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                  <span className="text-white text-xs md:text-sm font-medium truncate">
                    {imagem.titulo}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Botão Ver Mais */}
          {temMaisImagens && (
            <div className="text-center mt-8 md:mt-12">
              <button
                onClick={carregarMais}
                disabled={carregandoMais}
                className="bg-primary text-dark-bg px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-bold text-sm md:text-base hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
              >
                {carregandoMais ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-dark-bg"></div>
                    Carregando...
                  </>
                ) : (
                  <>
                    <span>📸</span>
                    Ver Mais Fotos ({imagens.length - limite} restantes)
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Modal de visualização */}
      {modalAberto && imagemSelecionada && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          {/* Botão fechar */}
          <button
            onClick={fecharModal}
            className="absolute top-4 right-4 text-white hover:text-primary transition-colors z-10"
          >
            <FiX size={28} className="md:w-8 md:h-8" />
          </button>

          {/* Navegação */}
          {imagens.length > 1 && (
            <>
              <button
                onClick={imagemAnterior}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 text-white hover:text-primary transition-colors bg-black/50 p-2 md:p-3 rounded-full"
              >
                <FiChevronLeft size={20} className="md:w-6 md:h-6" />
              </button>
              <button
                onClick={proximaImagem}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 text-white hover:text-primary transition-colors bg-black/50 p-2 md:p-3 rounded-full"
              >
                <FiChevronRight size={20} className="md:w-6 md:h-6" />
              </button>
            </>
          )}

          {/* Imagem */}
          <div className="max-w-6xl w-full max-h-[90vh] flex flex-col items-center">
            <img
              src={imagemSelecionada.imagem}
              alt={imagemSelecionada.titulo}
              className="max-w-full max-h-[70vh] md:max-h-[80vh] object-contain rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/800x600/38241B/FFD301?text=Erro+ao+carregar';
              }}
            />

            {/* Título da imagem no modal */}
            <h3 className="text-white text-base md:text-2xl font-bold text-center mt-4">
              {imagemSelecionada.titulo}
            </h3>
            <p className="text-gray-400 text-xs md:text-sm mt-2">
              {indiceAtual + 1} / {imagens.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Galeria;