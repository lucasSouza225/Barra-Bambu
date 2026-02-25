import { BrowserRouter, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Home from "./pages/Home"
import Footer from "./components/Footer"
import LoginAdmin from "./pages/admin/LoginAdmin"

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginAdmin />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
