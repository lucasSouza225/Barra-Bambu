import { useState, useEffect } from 'react';
import { galeriaService } from '../../service/galeriaService';
import { FiImage, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { IoImages } from 'react-icons/io5';

const Galeria = () => {
  const [imagens, setImagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaAtiva, setCategoriaAtiva] = useState('todas');
  const [modalAberto, setModalAberto] = useState(false);
  const [imagemSelecionada, setImagemSelecionada] = useState(null);
  const [indiceAtual, setIndiceAtual] = useState(0);
  
  // NOVOS ESTADOS PARA PAGINAÇÃO
  const [limite, setLimite] = useState(8); // Mostra 8 imagens inicialmente
  const [carregandoMais, setCarregandoMais] = useState(false);

  const categorias = [
    { id: 'todas', nome: 'Todas', icon: '🖼️' },
    { id: 'ambiente', nome: 'Ambiente', icon: '🏠' },
    { id: 'eventos', nome: 'Eventos', icon: '🎉' },
    { id: 'pratos', nome: 'Pratos', icon: '🍽️' },
    { id: 'outros', nome: 'Outros', icon: '📸' }
  ];

  useEffect(() => {
    carregarImagens();
  }, []);

  // Resetar limite quando mudar de categoria
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

  // Aplicar limite apenas na categoria "Todas"
  const imagensParaMostrar = categoriaAtiva === 'todas'
    ? imagensFiltradas.slice(0, limite)
    : imagensFiltradas;

  const temMaisImagens = categoriaAtiva === 'todas' && limite < imagensFiltradas.length;

  const carregarMais = () => {
    setCarregandoMais(true);
    // Simular um pequeno delay para feedback visual
    setTimeout(() => {
      setLimite(prev => prev + 8); // Carrega mais 8 imagens
      setCarregandoMais(false);
    }, 500);
  };

  const abrirModal = (imagem, index) => {
    // Para o modal, precisamos do índice real no array filtrado (sem limite)
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

  // Fechar com tecla ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') fecharModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-light-bg">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-dark-bg mb-12">
            Nossa Galeria
          </h2>
          <div className="flex justify-center items-center h-64">
            <IoImages className="text-4xl text-primary animate-pulse mr-2" />
            <div className="text-xl">Carregando galeria...</div>
          </div>
        </div>
      </section>
    );
  }

  if (imagens.length === 0) {
    return (
      <section className="py-16 bg-light-bg">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-dark-bg mb-12">
            Nossa Galeria
          </h2>
          <div className="text-center py-12">
            <FiImage className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-xl">Em breve novas fotos!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-16 bg-light-bg">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-dark-bg mb-4">
            Nossa Galeria
          </h2>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Conheça um pouco mais do nosso espaço, pratos e momentos especiais
          </p>

          {/* Filtros por categoria */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoriaAtiva(cat.id)}
                className={`px-6 py-2 rounded-full transition-all duration-300 flex items-center gap-2 ${
                  categoriaAtiva === cat.id
                    ? 'bg-primary text-dark-bg font-bold shadow-lg scale-105'
                    : 'bg-white text-gray-600 hover:bg-primary/20'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.nome}
              </button>
            ))}
          </div>
          {/* Grid de imagens */}
          {imagensFiltradas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-xl">
                Nenhuma imagem encontrada nesta categoria
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imagensParaMostrar.map((imagem) => (
                  <div
                    key={imagem._id}
                    onClick={() => abrirModal(imagem)}
                    className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                  >
                    <div className="aspect-square overflow-hidden">
                      {imagem.imagem ? (
                        <img
                          src={imagem.imagem}
                          alt={imagem.titulo}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/400x400/38241B/FFD301?text=Erro';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <FiImage className="text-4xl text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Overlay no hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <div className="text-white">
                        <h3 className="font-bold text-lg">{imagem.titulo}</h3>
                        {imagem.descricao && (
                          <p className="text-sm opacity-90">{imagem.descricao}</p>
                        )}
                        {imagem.destaque && (
                          <span className="inline-block mt-2 text-xs bg-primary text-dark-bg px-2 py-1 rounded-full">
                            ⭐ Destaque
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Badge de categoria */}
                    <div className="absolute top-2 left-2">
                      <span className="bg-dark-bg/80 text-white text-xs px-2 py-1 rounded-full">
                        {categorias.find(c => c.id === imagem.categoria)?.icon} {imagem.categoria}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botão Ver Mais */}
              {temMaisImagens && (
                <div className="text-center mt-10">
                  <button
                    onClick={carregarMais}
                    disabled={carregandoMais}
                    className="bg-primary text-dark-bg px-8 py-3 rounded-lg font-bold hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                  >
                    {carregandoMais ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-dark-bg"></div>
                        Carregando...
                      </>
                    ) : (
                      <>
                        <span>📸</span>
                        Ver Mais Fotos ({imagensFiltradas.length - limite} restantes)
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
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
            <FiX size={32} />
          </button>

          {/* Navegação */}
          {imagensFiltradas.length > 1 && (
            <>
              <button
                onClick={imagemAnterior}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-primary transition-colors bg-black/50 p-3 rounded-full"
              >
                <FiChevronLeft size={24} />
              </button>
              <button
                onClick={proximaImagem}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-primary transition-colors bg-black/50 p-3 rounded-full"
              >
                <FiChevronRight size={24} />
              </button>
            </>
          )}

          {/* Imagem */}
          <div className="max-w-6xl w-full max-h-[90vh] flex flex-col items-center">
            <img
              src={imagemSelecionada.imagem}
              alt={imagemSelecionada.titulo}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/800x600/38241B/FFD301?text=Erro+ao+carregar';
              }}
            />

            {/* Informações da imagem */}
            <div className="mt-4 text-white text-center">
              <h3 className="text-2xl font-bold">{imagemSelecionada.titulo}</h3>
              {imagemSelecionada.descricao && (
                <p className="text-gray-300 mt-2">{imagemSelecionada.descricao}</p>
              )}
              <p className="text-sm text-gray-400 mt-2">
                {indiceAtual + 1} / {imagensFiltradas.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Galeria;