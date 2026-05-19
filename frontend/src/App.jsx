import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import Header from "./components/Header"
import Home from "./pages/Home"
import Footer from "./components/Footer"
import LoginAdmin from "./pages/admin/LoginAdmin"
import LayoutAdmin from "./pages/admin/LayoutAdmin"
import DashboardAdmin from "./pages/admin/DashboardAdmin"
import CardapioAdmin from "./pages/admin/CardapioAdmin"
import GaleriaAdmin from "./pages/admin/GaleriaAdmin"
import CarrosselAdmin from "./pages/admin/CarrosselAdmin"
import ProtegerRotaAdmin from "./components/admin/ProtegerRotaAdmin"
import { CarrinhoProvider } from "./contexts/carrinho/CarrinhoContext" 
import CarrinhoLateral from "./components/carrinho/CarrinhoLateral" 
import CardapioPublico from './pages/CardapioPublico';
import axios from "axios"
import { useState } from "react"
import { StrictMode } from "react"
import { useEffect } from "react"

axios.defaults.baseURL = import.meta.env.VITE_AXIOS_BASE_URL
axios.defaults.withCredentials = true

// Componente que controla a exibição do carrinho
function AppContent() {
  const location = useLocation();
  const [user, setUser] = useState(null)

  useEffect(() => {
    const axiosGet = async () => {
      try {
        const { data } = await axios.get('/users/profile')
        setUser(data)
      } catch (error) {
        console.log('Usuário não logado')
        setUser(null)
      }
    }
    axiosGet()
  }, [])

  // Verificar se está na área admin
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <CarrinhoProvider>
      <Header user={user} />
      {!isAdminRoute && <CarrinhoLateral />}
      <Routes>
        {/* Rotas PÚBLICAS */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginAdmin setUser={setUser} />} />
        <Route path="/cardapio-publico" element={<CardapioPublico />} /> 
        
        {/* Rotas ADMIN (protegidas) */}
        <Route path="/admin" element={
          <ProtegerRotaAdmin user={user}>
            <LayoutAdmin user={user} setUser={setUser} />
          </ProtegerRotaAdmin>
        }>
          <Route index element={<DashboardAdmin />} />
          <Route path="cardapio" element={<CardapioAdmin />} />
          <Route path="galeria" element={<GaleriaAdmin />} />
          <Route path="carrossel" element={<CarrosselAdmin />} />
        </Route>
      </Routes>
      <Footer />
    </CarrinhoProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <StrictMode>
        <AppContent />
      </StrictMode>
    </BrowserRouter>
  )
}

export default App