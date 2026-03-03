import { useState } from 'react';
import {Navigate } from 'react-router-dom';
import axios from 'axios';

const LoginAdmin = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [redirect, setRedirect] = useState(false)


  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError('Preencha todos os campos');
      setLoading(false);
      return;
    }

    try {
      const { data: userDoc } = await axios.post("/users/login", {
        email: formData.email,
        password: formData.password,
      });

      setUser(userDoc)
      setRedirect(true)
      console.log(userDoc);

    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Usuário ou senha inválidos');
      } else if (error.request) {
        setError('Servidor não respondeu. Tente novamente.');
      } else {
        setError('Erro ao fazer login');
      }
      console.error('Erro detalhado:', error);
    } finally {
      setLoading(false);
    }
  };

  if (redirect) return <Navigate to="/admin"/>
    
  

  return (
    <div className="min-h-screen bg-linear-to-br from-dark-bg to-dark-bg/90 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-md p-8 border border-primary/20">

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-10 h-10 text-dark-bg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">
            Login Administrativo
          </h2>
          <p className="text-gray-300 text-sm mt-1">
            Acesse o painel do Barra Bambu
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
              Usuário
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Digite seu e-mail"
              disabled={loading}
            />
          </div>

          {/* Campo Senha */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Digite sua senha"
              disabled={loading}
            />
          </div>

          {/* Mensagem de erro */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Botão de login */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-primary hover:bg-secondary text-dark-bg font-bold py-3 px-4 rounded-lg transition-all duration-100 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark-bg ${loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-dark-bg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Entrando...
              </span>
            ) : (
              'Entrar'
            )}
          </button>
        </form>
        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-gray-400 hover:text-primary transition-colors">
            ← Voltar para o site
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;