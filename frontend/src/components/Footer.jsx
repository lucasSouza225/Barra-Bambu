import React from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaInstagram, FaFacebook, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contato" className="bg-dark-bg text-white pt-10 pb-2.5 w-full overflow-x-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Grid do Footer - Ajustado para melhor responsividade */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12 mb-8">
          
          {/* Coluna 1 - Horários */}
          <div className="text-center md:text-left">
            <h3 className="text-primary text-base mb-3 border-b border-primary pb-1 inline-block font-medium">
              HORÁRIO DE ATENDIMENTO
            </h3>
            <div className="space-y-2 mt-4">
              <p className="text-sm text-text-light leading-relaxed">Segunda a Quinta: 11:00 às 23:00</p>
              <p className="text-sm text-text-light leading-relaxed">Sexta e Sábado: 11:00 às 00:00</p>
              <p className="text-sm text-text-light leading-relaxed">Domingo: 11:00 às 22:00</p>
            </div>
          </div>

          {/* Coluna 2 - Redes Sociais */}
          <div className="text-center md:text-left">
            <h3 className="text-primary text-base mb-3 border-b border-primary pb-1 inline-block font-medium">
              REDES SOCIAIS
            </h3>
            <div className="space-y-3 mt-4">
              <p className="text-sm text-text-light leading-relaxed flex items-center justify-center md:justify-start gap-2">
                <FaWhatsapp className="text-primary flex-shrink-0" />
                <a 
                  href="https://wa.me/551136340295" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-primary transition-colors break-all"
                >
                  (11) 3634-0295
                </a>
              </p>
              <p className="text-sm text-text-light leading-relaxed flex items-center justify-center md:justify-start gap-2">
                <FaInstagram className="text-primary flex-shrink-0" />
                <a 
                  href="https://instagram.com/barrabambuoficial" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-primary transition-colors break-all"
                >
                  @barrabambuoficial
                </a>
              </p>
              <p className="text-sm text-text-light leading-relaxed flex items-center justify-center md:justify-start gap-2">
                <FaFacebook className="text-primary flex-shrink-0" />
                <a 
                  href="https://facebook.com/barrabambu" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-primary transition-colors break-all"
                >
                  facebook.com/barrabambu
                </a>
              </p>
            </div>
          </div>

          {/* Coluna 3 - Localização */}
          <div className="text-center md:text-left">
            <h3 className="text-primary text-base mb-3 border-b border-primary pb-1 inline-block font-medium">
              LOCALIZAÇÃO
            </h3>
            <div className="mt-4 space-y-3">
              {/* Mapa - Centralizado em mobile */}
              <div className="flex justify-center md:justify-start">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d117957.20424447498!2d-48.64236962131136!3d-22.498080551877713!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x94c74f62f498dea7%3A0xbd03731ed15aa3f6!2sAv.%20Pedro%20Ometto%2C%2088%20-%20Centro%2C%20Barra%20Bonita%20-%20SP%2C%2017340-000!3m2!1d-22.4981015!2d-48.559968!5e0!3m2!1spt-BR!2sbr!4v1762109039380!5m2!1spt-BR!2sbr" 
                  width="100%" 
                  height="120" 
                  style={{ border: 0, maxWidth: '250px' }} 
                  allowFullScreen 
                  loading="lazy" 
                  title="Localização do Barra Bambu"
                  className="rounded-lg mx-auto md:mx-0"
                />
              </div>
              
              {/* Endereço */}
              <p className="text-sm text-text-light leading-relaxed flex items-start justify-center md:justify-start gap-2">
                <FaMapMarkerAlt className="text-primary mt-1 flex-shrink-0" />
                <a 
                  href="https://maps.google.com/?q=Av.+Pedro+Ometto,+88+-+Centro,+Barra+Bonita+-+SP" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-primary transition-colors text-left break-words"
                >
                  Av. Pedro Ometto, 88 - Centro, Barra Bonita - SP
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-5 border-t border-primary/30 text-sm text-gray-400">
          <p>&copy; {currentYear} Barra Bambu Restaurante. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;