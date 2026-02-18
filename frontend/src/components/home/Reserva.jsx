import React, { useState } from 'react';
import reservationImg from '../../assets/reservation.jpg';

const Reserva = () => {
  // Estado para os campos do formulário
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    people: '',
    contact: ''
  });

  // Estado para mensagens de erro/sucesso
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Número do WhatsApp (substitua pelo número real)
  const whatsappNumber = '5511936340295'; // Exemplo: 55 (Brasil) 11 (DDD) 936340295

  // Handle change dos inputs
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    // Limpa o erro do campo quando o usuário começa a digitar
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  // Validação do formulário
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.date) newErrors.date = 'Data é obrigatória';
    if (!formData.time) newErrors.time = 'Hora é obrigatória';
    if (!formData.people) newErrors.people = 'Número de pessoas é obrigatório';
    if (formData.people < 1) newErrors.people = 'Mínimo 1 pessoa';
    if (!formData.contact.trim()) newErrors.contact = 'Contato é obrigatório';
    
    return newErrors;
  };

  // Handle submit do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validação
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Formata a mensagem para WhatsApp
    const message = `Olá! Gostaria de fazer uma reserva:\n\n` +
                    `👤 Nome: ${formData.name}\n` +
                    `📅 Data: ${new Date(formData.date).toLocaleDateString('pt-BR')}\n` +
                    `⏰ Hora: ${formData.time}\n` +
                    `👥 Número de pessoas: ${formData.people}\n` +
                    `📱 Contato: ${formData.contact}`;

    // Codifica a mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Abre o WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    // Limpa o formulário
    setFormData({
      name: '',
      date: '',
      time: '',
      people: '',
      contact: ''
    });
    
    setIsSubmitting(false);
    
    // Mensagem de sucesso
    alert('Redirecionando para WhatsApp...');
  };

  // Data mínima (hoje)
  const today = new Date().toISOString().split('T')[0];

  return (
    <section id="reserva" className="p-20 bg-light-bg">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-12.5 items-center">
          
          {/* Imagem */}
          <div className="reservation-image order-first lg:order-first">
            <img 
              src={reservationImg} 
              alt="Faça sua reserva"
              className="w-full rounded-lg shadow-2xl"
            />
          </div>

          {/* Formulário */}
          <div className="reservation-form">
            <h2 className="text-2xl md:text-3xl lg:text-[28px] font-bold text-text-dark mb-8">
              Faça sua reserva
            </h2>

            <form onSubmit={handleSubmit} noValidate>
              
              {/* Nome */}
              <div className="form-group mb-5">
                <label 
                  htmlFor="name" 
                  className="block mb-2 font-bold text-text-dark"
                >
                  Nome:
                </label>
                <input 
                  type="text" 
                  id="name" 
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-3 border-2 border-text-dark rounded-tr-[50px] rounded-br-[50px] rounded-bl-[50px] text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_5px_rgba(212,175,55,0.3)] ${
                    errors.name ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Linha com Data, Hora e Pessoas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                
                {/* Data */}
                <div className="form-group">
                  <label 
                    htmlFor="date" 
                    className="block mb-2 font-bold text-text-dark"
                  >
                    Dia:
                  </label>
                  <input 
                    type="date" 
                    id="date" 
                    value={formData.date}
                    onChange={handleChange}
                    min={today}
                    className={`w-full p-3 border-2 border-text-dark rounded-tr-[50px] rounded-br-[50px] rounded-bl-[50px] text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_5px_rgba(212,175,55,0.3)] ${
                      errors.date ? 'border-red-500' : ''
                    }`}
                    required
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                  )}
                </div>

                {/* Hora */}
                <div className="form-group">
                  <label 
                    htmlFor="time" 
                    className="block mb-2 font-bold text-text-dark"
                  >
                    Hora:
                  </label>
                  <input 
                    type="time" 
                    id="time" 
                    value={formData.time}
                    onChange={handleChange}
                    className={`w-full p-3 border-2 border-text-dark rounded-tr-[50px] rounded-br-[50px] rounded-bl-[50px] text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_5px_rgba(212,175,55,0.3)] ${
                      errors.time ? 'border-red-500' : ''
                    }`}
                    required
                  />
                  {errors.time && (
                    <p className="text-red-500 text-sm mt-1">{errors.time}</p>
                  )}
                </div>

                {/* Nº de pessoas */}
                <div className="form-group">
                  <label 
                    htmlFor="people" 
                    className="block mb-2 font-bold text-text-dark"
                  >
                    Nº de pessoas:
                  </label>
                  <input 
                    type="number" 
                    id="people" 
                    value={formData.people}
                    onChange={handleChange}
                    min="1"
                    className={`w-full p-3 border-2 border-text-dark rounded-tr-[50px] rounded-br-[50px] rounded-bl-[50px] text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_5px_rgba(212,175,55,0.3)] ${
                      errors.people ? 'border-red-500' : ''
                    }`}
                    required
                  />
                  {errors.people && (
                    <p className="text-red-500 text-sm mt-1">{errors.people}</p>
                  )}
                </div>
              </div>

              {/* Contato */}
              <div className="form-group mb-5">
                <label 
                  htmlFor="contact" 
                  className="block mb-2 font-bold text-text-dark"
                >
                  Contato:
                </label>
                <input 
                  type="tel" 
                  id="contact" 
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                  className={`w-full p-3 border-2 border-text-dark rounded-tr-[50px] rounded-br-[50px] rounded-bl-[50px] text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_5px_rgba(212,175,55,0.3)] ${
                    errors.contact ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.contact && (
                  <p className="text-red-500 text-sm mt-1">{errors.contact}</p>
                )}
              </div>

              {/* Botão Submit */}
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full bg-primary text-text-dark font-bold py-4 px-6 rounded-md cursor-pointer transition-all duration-300 mt-5 hover:bg-dark-bg hover:text-white hover:-translate-y-1 hover:shadow-2xl ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Enviando...' : 'Finalizar'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reserva;