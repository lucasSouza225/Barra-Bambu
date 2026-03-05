import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

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
    { path: '/admin', label: 'Dashboard', icon: '📊', end: true },
    { path: '/admin/cardapio', label: 'Cardápio', icon: '🍽️' },
    { path: '/admin/galeria', label: 'Galeria', icon: '📸' },
    { path: '/admin/carrossel', label: 'Carrossel', icon: '🎠' },
  ];

  return (
    <div className="flex min-h-screen bg-light-bg">
      {/* Sidebar */}
      <div 
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-dark-bg text-white transition-all duration-300 relative shadow-xl`}
      >
        {/* Logo e botão de toggle */}
        <div className="p-4 flex justify-between items-center border-b border-primary/20">
          <h2 className={`font-bold text-primary ${!sidebarOpen && 'hidden'}`}>
            Barra Bambu
          </h2>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="text-white hover:text-primary transition-colors"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Menu de navegação */}
        <nav className="mt-8 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => 
                `flex items-center px-4 py-3 transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary text-dark-bg font-bold border-l-4 border-white' 
                    : 'hover:bg-primary/20 hover:text-primary'
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className="ml-3">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Botão de sair - SEMPRE VISÍVEL */}
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <button
            onClick={handleLogout}
            className={`flex items-center w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300 ${
              !sidebarOpen && 'justify-center'
            }`}
          >
            <span className="text-xl">🚪</span>
            {sidebarOpen && <span className="ml-3">Sair</span>}
          </button>
          
          {/* Informação do usuário (opcional) */}
          {sidebarOpen && user && (
            <div className="mt-4 pt-4 border-t border-primary/20 text-xs text-gray-400">
              <p className="truncate">{user.name}</p>
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 p-8 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default LayoutAdmin;