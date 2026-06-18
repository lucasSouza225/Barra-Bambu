import React, { useState } from 'react';
import { FiCheckCircle, FiX } from 'react-icons/fi';
import reservationImg from '../../assets/reservation.jpg';

const Reserva = () => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    people: '',
    contact: ''
  });

  const [errors, setErrors] = useState({});
  const [mensagemToast, setMensagemToast] = useState(null);

  const whatsappNumber = '5511936340295';

  const mostrarToast = (tipo, titulo, mensagem) => {
    setMensagemToast({ tipo, titulo, mensagem });
    setTimeout(() => {
      setMensagemToast(null);
    }, 5000);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const [year, month, day] = formData.date.split('-');
    const formattedDate = `${day}/${month}/${year}`;

    const message =
      `Olá! Gostaria de fazer uma reserva:\n\n` +
      `👤 Nome: ${formData.name}\n` +
      `📅 Data: ${formattedDate}\n` +
      `⏰ Hora: ${formData.time}\n` +
      `👥 Número de pessoas: ${formData.people}\n` +
      `📱 Contato: ${formData.contact}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    const newWindow = window.open(whatsappUrl, '_blank');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      mostrarToast(
        'error',
        '⚠️ Popup bloqueado',
        'Seu navegador bloqueou a abertura do WhatsApp. Por favor, permita popups para este site e tente novamente.'
      );
      return;
    }

    setFormData({ name: '', date: '', time: '', people: '', contact: '' });

    mostrarToast(
      'success',
      '✅ Reserva enviada!',
      'Sua solicitação foi enviada para nosso WhatsApp. Em breve entraremos em contato para confirmar.'
    );
  };

  const today = new Date().toISOString().split('T')[0];

  const coresToast = {
    success: {
      bg: 'bg-gradient-to-r from-green-500 to-green-600',
      icon: <FiCheckCircle className="text-white text-xl" />
    },
    error: {
      bg: 'bg-gradient-to-r from-red-500 to-red-600',
      icon: <FiX className="text-white text-xl" />
    }
  };

  const toastCor = mensagemToast
    ? coresToast[mensagemToast.tipo] ?? coresToast.success
    : coresToast.success;

  return (
    <section id="reserva" className="p-5 bg-light-bg relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-center">

          {/* Imagem */}
          <div className="reservation-image order-first lg:order-first">
            <img
              src={reservationImg}
              alt="Faça sua reserva"
              className="w-110 rounded-lg shadow-2xl"
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
                <label htmlFor="name" className="block mb-2 font-bold text-text-dark">
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

              {/* Data, Hora, Pessoas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">

                {/* Data */}
                <div className="form-group">
                  <label htmlFor="date" className="block mb-2 font-bold text-text-dark">
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
                  <label htmlFor="time" className="block mb-2 font-bold text-text-dark">
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
                  <label htmlFor="people" className="block mb-2 font-bold text-text-dark">
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
                <label htmlFor="contact" className="block mb-2 font-bold text-text-dark">
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

              <button
                type="submit"
                className="w-full bg-primary text-text-dark font-bold py-4 px-6 rounded-md cursor-pointer transition-all duration-300 mt-5 hover:bg-dark-bg hover:text-white hover:-translate-y-1 hover:shadow-2xl"
              >
                Finalizar
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Toast de confirmação */}
      {mensagemToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in-right">
          <div className={`${toastCor.bg} text-white rounded-xl shadow-2xl max-w-sm overflow-hidden ring-1 ring-white/20`}>
            <div className="flex items-start p-4">
              <div className="shrink-0 bg-white/20 rounded-full p-1">
                {toastCor.icon}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-bold">{mensagemToast.titulo}</p>
                <p className="text-xs mt-1 opacity-95 leading-relaxed">{mensagemToast.mensagem}</p>
              </div>
              <button
                onClick={() => setMensagemToast(null)}
                aria-label="Fechar notificação"
                className="ml-4 shrink-0 text-white/80 hover:text-white transition-colors bg-white/10 rounded-full p-1 hover:bg-white/20"
              >
                <FiX className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Reserva;