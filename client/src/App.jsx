import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { Home, Search, User, Play, Menu, X, Film, Heart } from 'lucide-react'
import { useState, useEffect } from 'react'
import HomePage from './pages/HomePage'
import VideoPage from './pages/VideoPage'
import CategoryPage from './pages/CategoryPage'
import SearchPage from './pages/SearchPage'

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

function AppContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-dark">
      <nav className="bg-dark2 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Play className="w-8 h-8 text-primary" fill="currentColor" />
              <span className="text-2xl font-bold text-white">QaraKino</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-300 hover:text-white transition">باش بەت</Link>
              <Link to="/category/kino" className="text-gray-300 hover:text-white transition">كىنو</Link>
              <Link to="/category/serial" className="text-gray-300 hover:text-white transition">سېرىال</Link>
              <Link to="/category/music" className="text-gray-300 hover:text-white transition">مۇزىكا</Link>
            </div>

            <div className="flex items-center space-x-4">
              <button onClick={() => navigate('/search')} className="p-2 text-gray-300 hover:text-white">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-300 hover:text-white">
                <User className="w-5 h-5" />
              </button>
              <button className="md:hidden p-2 text-gray-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-dark2 border-t border-gray-800">
            <div className="px-4 py-3 space-y-3">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block text-gray-300 hover:text-white">باش بەت</Link>
              <Link to="/category/kino" onClick={() => setMobileMenuOpen(false)} className="block text-gray-300 hover:text-white">كىنو</Link>
              <Link to="/category/serial" onClick={() => setMobileMenuOpen(false)} className="block text-gray-300 hover:text-white">سېرىال</Link>
              <Link to="/category/music" onClick={() => setMobileMenuOpen(false)} className="block text-gray-300 hover:text-white">مۇزىكا</Link>
            </div>
          </div>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/video/:id" element={<VideoPage />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-dark2 border-t border-gray-800">
        <div className="flex justify-around py-2">
          <Link to="/" className="flex flex-col items-center p-2 text-gray-400 hover:text-white">
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">باش</span>
          </Link>
          <Link to="/search" className="flex flex-col items-center p-2 text-gray-400 hover:text-white">
            <Search className="w-6 h-6" />
            <span className="text-xs mt-1">ئىزدەش</span>
          </Link>
          <Link to="#" className="flex flex-col items-center p-2 text-gray-400 hover:text-white">
            <Heart className="w-6 h-6" />
            <span className="text-xs mt-1">ياخشى</span>
          </Link>
          <Link to="#" className="flex flex-col items-center p-2 text-gray-400 hover:text-white">
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">منىم</span>
          </Link>
        </div>
      </nav>

      <div className="h-16 md:h-0" />
    </div>
  )
}

export default App
