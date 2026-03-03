import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const LayoutAdmin = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/cardapio', label: 'Cardápio', icon: '🍽️' },
    { path: '/admin/galeria', label: 'Galeria', icon: '📸' },
    { path: '/admin/carrossel', label: 'Carrossel', icon: '🎠' },
  ];

  return (
    <div className="flex min-h-screen bg-light-bg">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-dark-bg text-white transition-all duration-300 relative`}>
        <div className="p-4 flex justify-between items-center">
          <h2 className={`font-bold ${!sidebarOpen && 'hidden'}`}>Barra Bambu</h2>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white">
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="mt-8">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 transition-all ${isActive
                  ? 'bg-primary/10 text-primary border-l-4 border-primary font-bold' // Borda lateral
                  : 'hover:bg-primary/20 border-l-4 border-transparent'
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className="ml-3">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4">
          <button
            onClick={handleLogout}
            className="flex items-center text-red-400 hover:text-red-300"
          >
            <span>🚪</span>
            {sidebarOpen && <span className="ml-2">Sair</span>}
          </button>
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