import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Products from './pages/Products'
import FruitsJuiceShops from './pages/FruitsJuiceShops'
import Dashboard from './pages/Dashboard'
import FarmersMap from './pages/FarmersMap'
import WasteListing from './pages/WasteListing'
import VoiceChatbot from './components/VoiceChatbot'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/fruits-juice" element={<FruitsJuiceShops />} />
          <Route path="/waste-listing" element={<WasteListing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/map" element={<FarmersMap />} />
        </Routes>
      </div>

      {/* Floating Bilingual Voice Chatbot at Bottom-Left */}
      <VoiceChatbot />
    </div>
  )
}
