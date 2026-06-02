import { useState, useEffect } from 'react';
import { galeriaService } from '../../service/galeriaService';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2,
  FiArrowUp,
  FiArrowDown,
  FiImage,
  FiStar
} from 'react-icons/fi';
import { 
  IoClose,
  IoSave,
  IoImages
} from 'react-icons/io5';
import { 
  MdVisibility, 
  MdVisibilityOff 
} from 'react-icons/md';

const GaleriaAdmin = () => {
  const [imagens, setImagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  
  // Estados para upload
  const [imagemFile, setImagemFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    imagem: '',
    categoria: 'ambiente',
    ordem: 0,
    ativo: true,
    destaque: false
  });

  const categorias = [
    { value: 'ambiente', label: 'Ambiente', icon: '🏠' },
    { value: 'eventos', label: 'Eventos', icon: '🎉' },
    { value: 'pratos', label: 'Pratos', icon: '🍽️' },
    { value: 'outros', label: 'Outros', icon: '📸' }
  ];

  useEffect(() => {
    carregarImagens();
  }, []);

  const carregarImagens = async () => {
    try {
      setLoading(true);
      const data = await galeriaService.listar();
      // Ordenar por ordem
      const ordenados = data.sort((a, b) => a.ordem - b.ordem);
      setImagens(ordenados);
    } catch (error) {
      setError('Erro ao carregar imagens');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagemFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let imagemUrl = formData.imagem || '';
      
      if (imagemFile) {
        const uploadResult = await galeriaService.uploadImagem(imagemFile);
        imagemUrl = uploadResult.url;
      }
      
      const imagemData = {
        ...formData,
        imagem: imagemUrl
      };
      
      if (editandoId) {
        await galeriaService.atualizar(editandoId, imagemData);
      } else {
        await galeriaService.criar(imagemData);
      }
      
      await carregarImagens();
      resetForm();
      
    } catch (error) {
      setError('Erro ao salvar imagem');
      console.error(error);
    } finally {
      setUploading(false);
    }
    
  };

  const handleEdit = (imagem) => {
    setFormData({
      titulo: imagem.titulo,
      descricao: imagem.descricao || '',
      imagem: imagem.imagem,
      categoria: imagem.categoria || 'ambiente',
      ordem: imagem.ordem,
      ativo: imagem.ativo,
      destaque: imagem.destaque || false
    });
    setEditandoId(imagem._id);
    setMostrarForm(true);
    setPreviewUrl('');
    setImagemFile(null);

    setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 50);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja remover esta imagem?')) {
      try {
        await galeriaService.deletar(id);
        await carregarImagens();
      } catch (error) {
        setError('Erro ao deletar imagem');
        console.error(error);
      }
    }
  };

  const handleToggleAtivo = async (id) => {
    try {
      await galeriaService.toggleAtivo(id);
      await carregarImagens();
    } catch (error) {
      setError('Erro ao alterar status');
      console.error(error);
    }
  };

  const handleToggleDestaque = async (id) => {
    try {
      await galeriaService.toggleDestaque(id);
      await carregarImagens();
    } catch (error) {
      setError('Erro ao alterar destaque');
      console.error(error);
    }
  };

  const handleMoverOrdem = async (id, direcao) => {
    const index = imagens.findIndex(img => img._id === id);
    if (
      (direcao === 'up' && index === 0) || 
      (direcao === 'down' && index === imagens.length - 1)
    ) {
      return;
    }

    const novasImagens = [...imagens];
    const targetIndex = direcao === 'up' ? index - 1 : index + 1;
    
    // Trocar as ordens
    const tempOrdem = novasImagens[index].ordem;
    novasImagens[index].ordem = novasImagens[targetIndex].ordem;
    novasImagens[targetIndex].ordem = tempOrdem;
    
    // Trocar as posições no array
    [novasImagens[index], novasImagens[targetIndex]] = [novasImagens[targetIndex], novasImagens[index]];
    
    try {
      await galeriaService.reordenar(
        novasImagens.map((img, i) => ({ id: img._id, ordem: i }))
      );
      setImagens(novasImagens);
    } catch (error) {
      setError('Erro ao reordenar');
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      descricao: '',
      imagem: '',
      categoria: 'ambiente',
      ordem: imagens.length,
      ativo: true,
      destaque: false
    });
    setImagemFile(null);
    setPreviewUrl('');
    setEditandoId(null);
    setMostrarForm(false);
  };

  const fecharForm = () => {
    resetForm();
  };

  const getCategoriaLabel = (value) => {
    const cat = categorias.find(c => c.value === value);
    return cat ? `${cat.icon} ${cat.label}` : value;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <IoImages className="text-4xl text-primary animate-pulse mr-2" />
        <div className="text-xl">Carregando galeria...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-dark-bg flex items-center gap-2">
          <IoImages className="text-primary" />
          Gerenciar Galeria
        </h1>
        <button
          onClick={() => {
            if (mostrarForm) {
              fecharForm();
            } else {
              setMostrarForm(true);
              setEditandoId(null);
              setFormData({
                titulo: '',
                descricao: '',
                imagem: '',
                categoria: 'ambiente',
                ordem: imagens.length,
                ativo: true,
                destaque: false
              });
              setImagemFile(null);
              setPreviewUrl('');
            }
          }}
          className="bg-primary text-dark-bg px-4 py-2 rounded-lg hover:bg-secondary transition-colors flex items-center gap-2"
        >
          {mostrarForm ? <IoClose /> : <FiPlus />}
          {mostrarForm ? 'Cancelar' : 'Nova Imagem'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
          <IoClose />
          {error}
        </div>
      )}

      {/* Formulário */}
      {mostrarForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            {editandoId ? <FiEdit /> : <FiPlus />}
            {editandoId ? 'Editar Imagem' : 'Nova Imagem'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título *
              </label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="Ex: Ambiente Principal"
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows="3"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="Breve descrição da imagem"
              />
            </div>

            {/* Upload de imagem */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagem *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
              />
              {previewUrl && (
                <div className="mt-2">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
              {formData.imagem && !previewUrl && (
                <div className="mt-2">
                  <img 
                    src={formData.imagem} 
                    alt="Atual" 
                    className="w-32 h-32 object-cover rounded-lg border"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div class="w-32 h-32 bg-gray-200 rounded flex items-center justify-center"><FiImage class="text-gray-400 text-2xl" /></div>';
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">Imagem atual</p>
                </div>
              )}
            </div>

            {/* Categoria e Ordem */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
                >
                  {categorias.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ordem
                </label>
                <input
                  type="number"
                  name="ordem"
                  value={formData.ordem}
                  onChange={handleChange}
                  min="0"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="ativo"
                  checked={formData.ativo}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary rounded"
                />
                {formData.ativo ? (
                  <MdVisibility className="text-green-500" />
                ) : (
                  <MdVisibilityOff className="text-red-500" />
                )}
                <span className="text-sm text-gray-700">Ativo</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="destaque"
                  checked={formData.destaque}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary rounded"
                />
                <FiStar className={formData.destaque ? 'text-yellow-500' : 'text-gray-400'} />
                <span className="text-sm text-gray-700">Destaque</span>
              </label>
            </div>

            {/* Botões */}
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                disabled={uploading}
                className="bg-primary text-dark-bg px-4 py-2 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {uploading ? 'Enviando...' : <IoSave />}
                {uploading ? 'Enviando...' : (editandoId ? 'Atualizar' : 'Salvar')}
              </button>
              <button
                type="button"
                onClick={fecharForm}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors flex items-center gap-2"
              >
                <IoClose />
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid de imagens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {imagens.map((imagem, index) => (
          <div key={imagem._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="relative h-48 bg-gray-100">
              {imagem.imagem ? (
                <img
                  src={imagem.imagem}
                  alt={imagem.titulo}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><FiImage class="text-4xl text-gray-400" /></div>';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FiImage className="text-4xl text-gray-400" />
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-2 right-2 flex gap-2">
                {imagem.destaque && (
                  <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <FiStar /> Destaque
                  </span>
                )}
              </div>
              <div className="absolute top-2 left-2">
                <span className="bg-dark-bg/80 text-white text-xs px-2 py-1 rounded-full">
                  {getCategoriaLabel(imagem.categoria)}
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-dark-bg">{imagem.titulo}</h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleMoverOrdem(imagem._id, 'up')}
                    disabled={index === 0}
                    className={`p-1 rounded hover:bg-gray-100 ${
                      index === 0 ? 'opacity-30 cursor-not-allowed' : ''
                    }`}
                  >
                    <FiArrowUp />
                  </button>
                  <button
                    onClick={() => handleMoverOrdem(imagem._id, 'down')}
                    disabled={index === imagens.length - 1}
                    className={`p-1 rounded hover:bg-gray-100 ${
                      index === imagens.length - 1 ? 'opacity-30 cursor-not-allowed' : ''
                    }`}
                  >
                    <FiArrowDown />
                  </button>
                </div>
              </div>

              {imagem.descricao && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{imagem.descricao}</p>
              )}

              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleAtivo(imagem._id)}
                    className={`p-2 rounded-lg transition-colors ${
                      imagem.ativo
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    title={imagem.ativo ? 'Desativar' : 'Ativar'}
                  >
                    {imagem.ativo ? <MdVisibility /> : <MdVisibilityOff />}
                  </button>

                  <button
                    onClick={() => handleToggleDestaque(imagem._id)}
                    className={`p-2 rounded-lg transition-colors ${
                      imagem.destaque
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    title={imagem.destaque ? 'Remover destaque' : 'Destacar'}
                  >
                    <FiStar />
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(imagem)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(imagem._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {imagens.length === 0 && (
        <div className="text-center py-12">
          <FiImage className="text-5xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Nenhuma imagem cadastrada</p>
          <button
            onClick={() => setMostrarForm(true)}
            className="mt-4 bg-primary text-dark-bg px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
          >
            Adicionar primeira imagem
          </button>
        </div>
      )}
    </div>
  );
};

export default GaleriaAdmin;