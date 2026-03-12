import { useState, useEffect } from 'react';
import { carrosselService } from '../../service/carrosselService';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2,
  FiArrowUp,
  FiArrowDown,
  FiImage
} from 'react-icons/fi';
import { 
  IoClose,
  IoSave,
  IoRestaurant
} from 'react-icons/io5';
import { 
  MdVisibility, 
  MdVisibilityOff 
} from 'react-icons/md';

const CarrosselAdmin = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  
  // NOVOS STATES PARA UPLOAD
  const [imagemFile, setImagemFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    imagem: '',
    link: '',
    ordem: 0,
    ativo: true
  });

  useEffect(() => {
    carregarBanners();
  }, []);

  const carregarBanners = async () => {
    try {
      setLoading(true);
      const data = await carrosselService.listar();
      const ordenados = data.sort((a, b) => a.ordem - b.ordem);
      setBanners(ordenados);
    } catch (error) {
      setError('Erro ao carregar banners');
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

  // NOVA FUNÇÃO PARA UPLOAD
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

  // MODIFICAR handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let imagemUrl = formData.imagem || '';
      
      if (imagemFile) {
        const uploadResult = await carrosselService.uploadImagem(imagemFile);
        imagemUrl = uploadResult.url;
      }
      
      const bannerData = {
        ...formData,
        imagem: imagemUrl
      };
      
      if (editandoId) {
        await carrosselService.atualizar(editandoId, bannerData);
      } else {
        await carrosselService.criar(bannerData);
      }
      
      await carregarBanners();
      setFormData({
        titulo: '',
        descricao: '',
        imagem: '',
        link: '',
        ordem: 0,
        ativo: true
      });
      setImagemFile(null);
      setPreviewUrl('');
      setEditandoId(null);
      setMostrarForm(false);
      
    } catch (error) {
      setError('Erro ao salvar banner');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (banner) => {
    setFormData({
      titulo: banner.titulo,
      descricao: banner.descricao || '',
      imagem: banner.imagem,
      link: banner.link || '',
      ordem: banner.ordem,
      ativo: banner.ativo
    });
    setEditandoId(banner._id);
    setMostrarForm(true);
    setPreviewUrl('');
    setImagemFile(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja remover este banner?')) {
      try {
        await carrosselService.deletar(id);
        await carregarBanners();
      } catch (error) {
        setError('Erro ao deletar banner');
        console.error(error);
      }
    }
  };

  const handleToggleAtivo = async (id) => {
    try {
      await carrosselService.toggleAtivo(id);
      await carregarBanners();
    } catch (error) {
      setError('Erro ao alterar status');
      console.error(error);
    }
  };

  const handleMoverOrdem = async (id, direcao) => {
    const index = banners.findIndex(b => b._id === id);
    if (
      (direcao === 'up' && index === 0) || 
      (direcao === 'down' && index === banners.length - 1)
    ) {
      return;
    }

    const newBanners = [...banners];
    const targetIndex = direcao === 'up' ? index - 1 : index + 1;
    
    const tempOrdem = newBanners[index].ordem;
    newBanners[index].ordem = newBanners[targetIndex].ordem;
    newBanners[targetIndex].ordem = tempOrdem;
    
    [newBanners[index], newBanners[targetIndex]] = [newBanners[targetIndex], newBanners[index]];
    
    try {
      await carrosselService.reordenar(
        newBanners.map((b, i) => ({ id: b._id, ordem: i }))
      );
      setBanners(newBanners);
    } catch (error) {
      setError('Erro ao reordenar');
      console.error(error);
    }
  };

  const fecharForm = () => {
    setMostrarForm(false);
    setEditandoId(null);
    setFormData({
      titulo: '',
      descricao: '',
      imagem: '',
      link: '',
      ordem: 0,
      ativo: true
    });
    setImagemFile(null);
    setPreviewUrl('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <IoRestaurant className="text-4xl text-primary animate-pulse mr-2" />
        <div className="text-xl">Carregando banners...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-dark-bg flex items-center gap-2">
          <FiImage className="text-primary" />
          Gerenciar Carrossel
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
                link: '',
                ordem: banners.length,
                ativo: true
              });
              setImagemFile(null);
              setPreviewUrl('');
            }
          }}
          className="bg-primary text-dark-bg px-4 py-2 rounded-lg hover:bg-secondary transition-colors flex items-center gap-2"
        >
          {mostrarForm ? <IoClose /> : <FiPlus />}
          {mostrarForm ? 'Cancelar' : 'Novo Banner'}
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
            {editandoId ? 'Editar Banner' : 'Novo Banner'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título do Banner *
              </label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="Ex: Promoção Especial"
              />
            </div>

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
                placeholder="Breve descrição do banner"
              />
            </div>

            {/* CAMPO DE UPLOAD DE IMAGEM */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagem do Banner *
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link (opcional)
              </label>
              <input
                type="text"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="https://exemplo.com/pagina"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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

              <div className="flex items-center">
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
                  <span className="text-sm text-gray-700">Banner ativo</span>
                </label>
              </div>
            </div>

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

      {/* Lista de banners */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Ordem</th>
              <th className="p-3 text-left">Imagem</th>
              <th className="p-3 text-left">Título</th>
              <th className="p-3 text-left">Descrição</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner, index) => (
              <tr key={banner._id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold w-8">{banner.ordem}</span>
                    <div className="flex flex-col">
                      <button
                        onClick={() => handleMoverOrdem(banner._id, 'up')}
                        disabled={index === 0}
                        className={`text-gray-500 hover:text-primary transition-colors ${
                          index === 0 ? 'opacity-30 cursor-not-allowed' : ''
                        }`}
                      >
                        <FiArrowUp />
                      </button>
                      <button
                        onClick={() => handleMoverOrdem(banner._id, 'down')}
                        disabled={index === banners.length - 1}
                        className={`text-gray-500 hover:text-primary transition-colors ${
                          index === banners.length - 1 ? 'opacity-30 cursor-not-allowed' : ''
                        }`}
                      >
                        <FiArrowDown />
                      </button>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <div className="w-20 h-12 bg-gray-100 rounded overflow-hidden">
                    {banner.imagem ? (
                      <img
                        src={banner.imagem}
                        alt={banner.titulo}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><FiImage class="text-gray-400" /></div>';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiImage className="text-gray-400" />
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-3 font-medium">{banner.titulo}</td>
                <td className="p-3 text-sm text-gray-600 max-w-xs truncate">
                  {banner.descricao || '-'}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleToggleAtivo(banner._id)}
                    className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 ${
                      banner.ativo
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {banner.ativo ? <MdVisibility /> : <MdVisibilityOff />}
                    {banner.ativo ? 'Ativo' : 'Inativo'}
                  </button>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(banner)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                      title="Editar"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                      title="Excluir"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {banners.length === 0 && (
          <div className="text-center py-12">
            <FiImage className="text-5xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum banner cadastrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarrosselAdmin;