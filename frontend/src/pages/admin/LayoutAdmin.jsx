import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { 
  FiHome, 
  FiMenu, 
  FiLogOut, 
  FiChevronLeft, 
  FiChevronRight 
} from 'react-icons/fi';
import { 
  IoRestaurant, 
  IoImages, 
  IoFilm 
} from 'react-icons/io5';
import { 
  MdDashboard, 
  MdRestaurantMenu, 
  MdPhotoLibrary, 
  MdViewCarousel 
} from 'react-icons/md';

const LayoutAdmin = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await axios.post('/users/logout').catch(() => {});
      setUser(null);
      navigate('/login');
    } catch (error) {
      setUser(null);
      navigate('/login');
    }
  };

  const menuItems = [
    { 
      path: '/admin', 
      label: 'Dashboard', 
      icon: <MdDashboard className="text-xl" />, 
      end: true 
    },
    { 
      path: '/admin/cardapio', 
      label: 'Cardápio', 
      icon: <MdRestaurantMenu className="text-xl" /> 
    },
    { 
      path: '/admin/galeria', 
      label: 'Galeria', 
      icon: <MdPhotoLibrary className="text-xl" /> 
    },
    { 
      path: '/admin/carrossel', 
      label: 'Carrossel', 
      icon: <MdViewCarousel className="text-xl" /> 
    },
  ];

  return (
    <div className="flex min-h-screen bg-linear-to-br from-gray-50 to-light-bg">
      {/* Sidebar */}
      <div 
        className={`${
          sidebarOpen ? 'w-72' : 'w-24'
        } bg-linear-to-b from-dark-bg to-dark-bg/95 text-white transition-all duration-300 relative shadow-2xl rounded-r-3xl`}
      >
        {/* Logo e botão de toggle */}
        <div className="p-6 flex justify-between items-center border-b border-primary/20">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <IoRestaurant className="text-2xl text-primary" />
              <h2 className="font-bold text-primary text-lg">
                Barra Bambu
              </h2>
            </div>
          ) : (
            <IoRestaurant className="text-2xl text-primary mx-auto" />
          )}
          
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="text-white hover:text-primary transition-colors p-1 rounded-lg hover:bg-primary/20"
            title={sidebarOpen ? 'Recolher menu' : 'Expandir menu'}
          >
            {sidebarOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
          </button>
        </div>

        {/* Menu de navegação */}
        <nav className="mt-8 space-y-2 px-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => 
                `flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-primary text-dark-bg font-bold shadow-lg shadow-primary/30' 
                    : 'text-gray-300 hover:bg-primary/10 hover:text-primary'
                } ${!sidebarOpen && 'justify-center'}`
              }
            >
              <span className={`text-xl ${!sidebarOpen && 'text-2xl'}`}>
                {item.icon}
              </span>
              {sidebarOpen && (
                <span className="ml-4 font-medium">{item.label}</span>
              )}
              
              {/* Tooltip para quando sidebar estiver fechada */}
              {!sidebarOpen && (
                <span className="absolute left-20 bg-dark-bg text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg border border-primary/20">
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Botão de sair */}
        <div className="absolute bottom-6 left-0 right-0 px-3">
          <button
            onClick={handleLogout}
            className={`flex items-center w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-300 group ${
              !sidebarOpen && 'justify-center'
            }`}
            title="Sair"
          >
            <FiLogOut className={`text-xl ${!sidebarOpen && 'text-2xl'}`} />
            {sidebarOpen && <span className="ml-4">Sair</span>}
            
            {/* Tooltip para quando sidebar estiver fechada */}
            {!sidebarOpen && (
              <span className="absolute left-20 bg-red-500 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                Sair
              </span>
            )}
          </button>
          
          {/* Informação do usuário */}
          {sidebarOpen && user && (
            <div className="mt-6 pt-4 border-t border-primary/20">
              <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header da área principal */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-dark-bg">
                Bem-vindo, {user?.name?.split(' ')[0] || 'Admin'}! 👋
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Gerencie todo o conteúdo do Barra Bambu
              </p>
            </div>
            
            {/* Data atual */}
            <div className="bg-white px-4 py-2 rounded-lg shadow-md">
              <span className="text-sm text-gray-600">
                {new Date().toLocaleDateString('pt-BR', { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric' 
                })}
              </span>
            </div>
          </div>

          {/* Conteúdo da página atual */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutAdmin;