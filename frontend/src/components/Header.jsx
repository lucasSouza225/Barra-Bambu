import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import logo from '../assets/logo.png'

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Função para rolar suavemente até a seção
  const scrollToSection = (sectionId) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Função para lidar com o clique nos links
  const handleNavClick = (e, href) => {
    e.preventDefault();
    
    // Fechar menu mobile se estiver aberto
    setMenuOpen(false);
    
    // Verificar se é âncora ou link externo
    if (href.startsWith('#')) {
      const sectionId = href;
      
      // Se já estiver na página inicial, só rola
      if (location.pathname === '/') {
        scrollToSection(sectionId);
      } else {
        // Se não estiver na Home, navega para Home e depois rola
        navigate('/');
        // Pequeno delay para garantir que a página carregou
        setTimeout(() => {
          scrollToSection(sectionId);
        }, 100);
      }
    } else {
      // Se for link externo, navega normalmente
      navigate(href);
    }
  };

  const navItems = [
    { href: '#sobre', label: 'Sobre' },
    { href: '#cardapio', label: 'Cardápio' },
    { href: '#galeria', label: 'Galeria' },
    { href: '#reserva', label: 'Reserva' },
    { href: '#contato', label: 'Contato' }
  ];

  return (
    <header className="bg-[#38241B] text-white py-3 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="logo">
          <img 
            src={logo} 
            alt="Logo" 
            className="w-32 md:w-48 cursor-pointer hover:opacity-80 transition-opacity" 
          />
        </Link>

        <button 
          className="md:hidden flex flex-col justify-center items-center w-10 h-10"
          onClick={toggleMenu}
          aria-label="Abrir Menu"
        >
          <span className={`bg-white h-0.5 w-6 mb-1 transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`bg-white h-0.5 w-6 mb-1 transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`bg-white h-0.5 w-6 transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>

        <nav className="hidden md:block">
          <ul className="flex space-x-6 lg:space-x-8">
            {navItems.map((item) => (
              <li key={item.label}>
                <a 
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-[#969696] hover:text-[#FFD301] transition-colors duration-300 relative after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-[#FFD301] after:w-0 hover:after:w-full after:transition-all after:duration-300 px-2 py-1 cursor-pointer"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={`md:hidden ${menuOpen ? 'block' : 'hidden'} bg-[#38241B] py-4`}>
        <ul className="flex flex-col items-center space-y-4">
          {navItems.map((item) => (
            <li key={item.label}>
              <a 
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-[#969696] hover:text-[#FFD301] transition-colors duration-300 py-2 text-lg cursor-pointer"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Header;