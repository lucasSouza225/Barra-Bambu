import { useState, useEffect } from 'react';
import { galeriaService } from '../../service/galeriaService';
import { 
  FiImage, 
  FiX, 
  FiChevronLeft, 
  FiChevronRight, 
  FiStar,
  FiGrid,
  FiHome,
  FiCalendar,
  FiCoffee,
  FiCamera
} from 'react-icons/fi';
import { IoImages } from 'react-icons/io5';
import { MdPhotoLibrary, MdRestaurant, MdEvent } from 'react-icons/md';
import { HiOutlinePhotograph } from 'react-icons/hi';

const Galeria = () => {
  const [imagens, setImagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaAtiva, setCategoriaAtiva] = useState('todas');
  const [modalAberto, setModalAberto] = useState(false);
  const [imagemSelecionada, setImagemSelecionada] = useState(null);
  const [indiceAtual, setIndiceAtual] = useState(0);
  
  const [limite, setLimite] = useState(8);
  const [carregandoMais, setCarregandoMais] = useState(false);

  // Categorias com React Icons
  const categorias = [
    { id: 'todas', nome: 'Todas', icon: <FiGrid className="text-base" /> },
    { id: 'ambiente', nome: 'Ambiente', icon: <FiHome className="text-base" /> },
    { id: 'eventos', nome: 'Eventos', icon: <FiCalendar className="text-base" /> },
    { id: 'pratos', nome: 'Pratos', icon: <FiCoffee className="text-base" /> },
    { id: 'outros', nome: 'Outros', icon: <FiCamera className="text-base" /> }
  ];

  useEffect(() => {
    carregarImagens();
  }, []);

  useEffect(() => {
    setLimite(8);
  }, [categoriaAtiva]);

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

  const imagensFiltradas = categoriaAtiva === 'todas'
    ? imagens
    : imagens.filter(img => img.categoria === categoriaAtiva);

  const imagensParaMostrar = imagensFiltradas.slice(0, limite);
  const temMaisImagens = limite < imagensFiltradas.length;

  const carregarMais = () => {
    setCarregandoMais(true);
    setTimeout(() => {
      setLimite(prev => prev + 8);
      setCarregandoMais(false);
    }, 500);
  };

  const abrirModal = (imagem, index) => {
    const indexReal = imagensFiltradas.findIndex(img => img._id === imagem._id);
    setImagemSelecionada(imagem);
    setIndiceAtual(indexReal);
    setModalAberto(true);
    document.body.style.overflow = 'hidden';
  };

  const fecharModal = () => {
    setModalAberto(false);
    setImagemSelecionada(null);
    document.body.style.overflow = 'unset';
  };

  const proximaImagem = () => {
    const novoIndice = (indiceAtual + 1) % imagensFiltradas.length;
    setIndiceAtual(novoIndice);
    setImagemSelecionada(imagensFiltradas[novoIndice]);
  };

  const imagemAnterior = () => {
    const novoIndice = (indiceAtual - 1 + imagensFiltradas.length) % imagensFiltradas.length;
    setIndiceAtual(novoIndice);
    setImagemSelecionada(imagensFiltradas[novoIndice]);
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') fecharModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Função para pegar ícone da categoria
  const getIconeCategoria = (categoria) => {
    const icons = {
      ambiente: <FiHome className="text-xs" />,
      eventos: <FiCalendar className="text-xs" />,
      pratos: <FiCoffee className="text-xs" />,
      outros: <FiCamera className="text-xs" />
    };
    return icons[categoria] || <MdPhotoLibrary className="text-xs" />;
  };

  if (loading) {
    return (
      <section id='galeria' className="py-12 md:py-16 bg-light-bg">
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
            <MdPhotoLibrary className="text-5xl md:text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg md:text-xl">Em breve novas fotos!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id='galeria' className="py-12 md:py-16 bg-light-bg">
        <div className="container mx-auto px-4">
          {/* Título responsivo */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark-bg flex items-center justify-center gap-2 flex-wrap">
              <FiStar className="text-yellow-500 text-xl sm:text-2xl md:text-3xl" />
              Nossa Galeria
              <FiStar className="text-yellow-500 text-xl sm:text-2xl md:text-3xl" />
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              Momentos especiais do nosso espaço
            </p>
          </div>

          {/* FILTROS POR CATEGORIA COM REACT ICONS */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-12">
            {categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoriaAtiva(cat.id)}
                className={`px-4 md:px-6 py-1.5 md:py-2 rounded-full text-xs md:text-sm transition-all duration-300 flex items-center gap-1 md:gap-2 ${
                  categoriaAtiva === cat.id
                    ? 'bg-primary text-dark-bg font-bold shadow-lg scale-105'
                    : 'bg-white text-gray-600 hover:bg-primary/20'
                }`}
              >
                <span className="text-sm md:text-base">{cat.icon}</span>
                <span className="hidden sm:inline">{cat.nome}</span>
                <span className="sm:hidden">{cat.nome.substring(0, 3)}</span>
              </button>
            ))}
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
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <MdPhotoLibrary className="text-3xl text-gray-400" />
                  </div>
                )}

                {/* Badge de categoria com React Icon */}
                <div className="absolute top-2 left-2 bg-dark-bg/70 text-white text-[10px] md:text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  {getIconeCategoria(imagem.categoria)}
                  <span>{imagem.categoria}</span>
                </div>

                {/* Overlay no hover */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                  <span className="text-white text-xs md:text-sm font-medium truncate flex items-center gap-1">
                    <FiImage className="text-white text-xs" />
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
                    <MdPhotoLibrary className="text-lg" />
                    Ver Mais Fotos
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
          <button
            onClick={fecharModal}
            className="absolute top-4 right-4 text-white hover:text-primary transition-colors z-10"
          >
            <FiX size={28} className="md:w-8 md:h-8" />
          </button>

          {imagensFiltradas.length > 1 && (
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

          <div className="max-w-6xl w-full max-h-[90vh] flex flex-col items-center">
            <img
              src={imagemSelecionada.imagem}
              alt={imagemSelecionada.titulo}
              className="max-w-full max-h-[70vh] md:max-h-[80vh] object-contain rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '';
              }}
            />

            <h3 className="text-white text-base md:text-2xl font-bold text-center mt-4 flex items-center gap-2">
              {getIconeCategoria(imagemSelecionada.categoria)}
              {imagemSelecionada.titulo}
            </h3>
            <p className="text-gray-400 text-xs md:text-sm mt-2 flex items-center gap-1">
              <MdPhotoLibrary className="text-xs" />
              {imagemSelecionada.categoria} • {indiceAtual + 1} / {imagensFiltradas.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Galeria;