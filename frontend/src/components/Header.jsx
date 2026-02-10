import { useState } from 'react';
import logo from '../assets/logo.png'

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Array para evitar repetição de código
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
        {/* Logo */}
        <div className="logo">
          <img 
            src={logo} 
            alt="Logo" 
            className="w-32 md:w-48" // Corrigido: w-35 não existe no Tailwind
          />
        </div>

        {/* Hamburger Menu Button (Mobile) */}
        <button 
          className="md:hidden flex flex-col justify-center items-center w-10 h-10"
          onClick={toggleMenu}
          aria-label="Abrir Menu"
        >
          <span className={`bg-white h-0.5 w-6 mb-1 transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`bg-white h-0.5 w-6 mb-1 transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`bg-white h-0.5 w-6 transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>

        {/* Navigation Menu - Desktop */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6 lg:space-x-8">
            {navItems.map((item) => (
              <li key={item.label}>
                <a 
                  href={item.href}
                  className="text-[#969696] hover:text-[#FFD301] transition-colors duration-300 relative after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-[#FFD301] after:w-0 hover:after:w-full after:transition-all after:duration-300 px-2 py-1"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${menuOpen ? 'block' : 'hidden'} bg-[#38241B] py-4`}>
        <ul className="flex flex-col items-center space-y-4">
          {navItems.map((item) => (
            <li key={item.label}>
              <a 
                href={item.href}
                className="text-[#969696] hover:text-[#FFD301] transition-colors duration-300 py-2 text-lg"
                onClick={() => setMenuOpen(false)}
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