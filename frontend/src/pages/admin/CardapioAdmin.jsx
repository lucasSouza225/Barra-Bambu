import { useState, useEffect } from 'react';
import { cardapioService } from '../../service/cardapioService';
import { 
  FiSearch, 
  FiX, 
  FiStar, 
  FiEdit, 
  FiTrash2, 
  FiPlus,
  FiImage 
} from 'react-icons/fi';
import { 
  IoRestaurant, 
  IoClose,
  IoSave 
} from 'react-icons/io5';
import { 
  MdVisibility, 
  MdVisibilityOff 
} from 'react-icons/md';

const CardapioAdmin = () => {
  const [itens, setItens] = useState([]);
  const [itensFiltrados, setItensFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [termoBusca, setTermoBusca] = useState('');
  
  const [imagemFile, setImagemFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    categoria: 'principais',
    subcategoria: '',
    destaque: false,
    disponivel: true,
    imagem: ''
  });

  useEffect(() => {
    carregarItens();
  }, []);

  useEffect(() => {
    filtrarItens();
  }, [termoBusca, itens]);

  const carregarItens = async () => {
    try {
      setLoading(true);
      const data = await cardapioService.listar();
      setItens(data);
      setItensFiltrados(data);
    } catch (error) {
      setError('Erro ao carregar cardápio');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filtrarItens = () => {
    if (!termoBusca.trim()) {
      setItensFiltrados(itens);
      return;
    }

    const termo = termoBusca.toLowerCase().trim();
    const filtrados = itens.filter(item => 
      item.nome.toLowerCase().includes(termo) ||
      item.descricao.toLowerCase().includes(termo) ||
      item.categoria.toLowerCase().includes(termo) ||
      (item.subcategoria && item.subcategoria.toLowerCase().includes(termo))
    );
    
    setItensFiltrados(filtrados);
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
        const uploadResult = await cardapioService.uploadImagem(imagemFile);
        imagemUrl = uploadResult.url;
      }
      
      const itemData = {
        ...formData,
        imagem: imagemUrl
      };
      
      if (editandoId) {
        await cardapioService.atualizar(editandoId, itemData);
      } else {
        await cardapioService.criar(itemData);
      }
      
      await carregarItens();
      setFormData({
        nome: '',
        descricao: '',
        preco: '',
        categoria: 'principais',
        subcategoria: '',
        destaque: false,
        disponivel: true,
        imagem: ''
      });
      setImagemFile(null);
      setPreviewUrl('');
      setEditandoId(null);
      setMostrarForm(false);
      setTermoBusca(''); 
      
    } catch (error) {
      setError('Erro ao salvar item');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      nome: item.nome,
      descricao: item.descricao,
      preco: item.preco,
      categoria: item.categoria,
      subcategoria: item.subcategoria || '',
      destaque: item.destaque || false,
      disponivel: item.disponivel !== false,
      imagem: item.imagem || ''
    });
    setEditandoId(item._id);
    setMostrarForm(true);
    setPreviewUrl('');
    setImagemFile(null);

    setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 50);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja remover este item?')) {
      try {
        await cardapioService.deletar(id);
        await carregarItens();
      } catch (error) {
        setError('Erro ao deletar item');
        console.error(error);
      }
    }
  };

  const handleToggleDisponivel = async (id) => {
    try {
      await cardapioService.toggleDisponivel(id);
      await carregarItens();
    } catch (error) {
      setError('Erro ao alterar disponibilidade');
      console.error(error);
    }
  };

  const limparBusca = () => {
    setTermoBusca('');
  };

  const fecharForm = () => {
    setMostrarForm(false);
    setEditandoId(null);
    setFormData({
      nome: '',
      descricao: '',
      preco: '',
      categoria: 'principais',
      subcategoria: '',
      destaque: false,
      disponivel: true,
      imagem: ''
    });
    setImagemFile(null);
    setPreviewUrl('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <IoRestaurant className="text-4xl text-primary animate-pulse mr-2" />
        <div className="text-xl">Carregando cardápio...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-dark-bg flex items-center gap-2">
          <IoRestaurant className="text-primary" />
          Gerenciar Cardápio
        </h1>
        <button
          onClick={() => {
            if (mostrarForm) {
              fecharForm();
            } else {
              setMostrarForm(true);
              setEditandoId(null);
              setFormData({
                nome: '',
                descricao: '',
                preco: '',
                categoria: 'principais',
                subcategoria: '',
                destaque: false,
                disponivel: true,
                imagem: ''
              });
              setImagemFile(null);
              setPreviewUrl('');
            }
          }}
          className="bg-primary text-dark-bg px-4 py-2 rounded-lg hover:bg-secondary transition-colors flex items-center gap-2"
        >
          {mostrarForm ? <IoClose /> : <FiPlus />}
          {mostrarForm ? 'Cancelar' : 'Novo Item'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
          <FiX />
          {error}
        </div>
      )}

      {/* BARRA DE PESQUISA */}
      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, descrição ou categoria..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="w-full p-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {termoBusca && (
            <button
              onClick={limparBusca}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              <FiX />
            </button>
          )}
        </div>
        
        <div className="mt-2 text-sm text-gray-500">
          {termoBusca ? (
            <p>
              {itensFiltrados.length} {itensFiltrados.length === 1 ? 'item encontrado' : 'itens encontrados'} 
              para "<span className="font-medium">{termoBusca}</span>"
            </p>
          ) : (
            <p>Total de {itens.length} {itens.length === 1 ? 'item' : 'itens'} no cardápio</p>
          )}
        </div>
      </div>

      {/* Formulário */}
      {mostrarForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            {editandoId ? <FiEdit /> : <FiPlus />}
            {editandoId ? 'Editar Item' : 'Novo Item'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do prato *
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição *
              </label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                required
                rows="3"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço (R$) *
                </label>
                <input
                  type="number"
                  name="preco"
                  value={formData.preco}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria *
                </label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                >
                  <option value="entradas">Entradas</option>
                  <option value="principais">Pratos Principais</option>
                  <option value="bebidas">Bebidas</option>
                  <option value="sobremesas">Sobremesas</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subcategoria
              </label>
              <input
                type="text"
                name="subcategoria"
                value={formData.subcategoria}
                onChange={handleChange}
                placeholder="Ex: carnes, drinks, doces..."
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagem do prato
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
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

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="destaque"
                  checked={formData.destaque}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary rounded"
                />
                <FiStar className={formData.destaque ? 'text-yellow-500' : 'text-gray-400'} />
                <span className="text-sm text-gray-700">Destacar no cardápio</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="disponivel"
                  checked={formData.disponivel}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary rounded"
                />
                {formData.disponivel ? (
                  <MdVisibility className="text-green-500" />
                ) : (
                  <MdVisibilityOff className="text-red-500" />
                )}
                <span className="text-sm text-gray-700">Disponível</span>
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={uploading}
                className="bg-primary text-dark-bg px-4 py-2 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {uploading ? (
                  'Enviando...'
                ) : (
                  <>
                    <IoSave />
                    {editandoId ? 'Atualizar' : 'Salvar'}
                  </>
                )}
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

      {/* Lista de itens */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Imagem</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Nome</th>
              <th className="p-3 text-left">Categoria</th>
              <th className="p-3 text-left">Preço</th>
              <th className="p-3 text-left">Destaque</th>
              <th className="p-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {itensFiltrados.map((item) => (
              <tr key={item._id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  {item.imagem ? (
                    <img 
                      src={item.imagem} 
                      alt={item.nome}
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="w-12 h-12 bg-gray-200 rounded flex items-center justify-center"><FiImage class="text-gray-400" /></div>';
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <FiImage className="text-gray-400" />
                    </div>
                  )}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleToggleDisponivel(item._id)}
                    className={`px-2 py-1 rounded text-sm flex items-center gap-1 ${
                      item.disponivel 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    {item.disponivel ? <MdVisibility /> : <MdVisibilityOff />}
                    {item.disponivel ? 'Disponível' : 'Indisponível'}
                  </button>
                </td>
                <td className="p-3 font-medium">{item.nome}</td>
                <td className="p-3 capitalize">{item.categoria}</td>
                <td className="p-3">R$ {item.preco.toFixed(2)}</td>
                <td className="p-3">
                  {item.destaque && <FiStar className="text-yellow-500" />}
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                      title="Editar"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
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

        {itensFiltrados.length === 0 && (
          <div className="text-center py-12">
            {termoBusca ? (
              <>
                <FiSearch className="text-5xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Nenhum item encontrado para "{termoBusca}"</p>
                <button
                  onClick={limparBusca}
                  className="text-primary hover:underline"
                >
                  Limpar busca
                </button>
              </>
            ) : (
              <>
                <FiImage className="text-5xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum item cadastrado</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardapioAdmin;