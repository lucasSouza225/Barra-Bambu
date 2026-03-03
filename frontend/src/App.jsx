import { BrowserRouter, Routes, Route } from "react-router-dom"
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
import axios from "axios"
import { useState } from "react"
import { StrictMode } from "react"

axios.defaults.baseURL = import.meta.env.VITE_AXIOS_BASE_URL

console.log(import.meta.env)

function App() {
  const [user, setUser] = useState(null)

  return (
    <BrowserRouter>
      <StrictMode>
        <Header user={user}/>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginAdmin setUser={setUser} />} />
          
          {/* Rotas protegidas do admin */}
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
      </StrictMode>
    </BrowserRouter>
  )
}

export default App