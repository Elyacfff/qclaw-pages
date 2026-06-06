import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { Home, Search, User, Play, Menu, X, Heart } from 'lucide-react'
import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import HomePage from './pages/HomePage'
import VideoPage from './pages/VideoPage'
import CategoryPage from './pages/CategoryPage'
import SearchPage from './pages/SearchPage'
import FavoritesPage from './pages/FavoritesPage'
import HistoryPage from './pages/HistoryPage'
import ProfilePage from './pages/ProfilePage'

// ==================== Global Context ====================
const AppContext = createContext(null)

export function useAppContext() {
  return useContext(AppContext)
}

function AppProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('qarakino_favorites')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('qarakino_history')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [toast, setToast] = useState(null)

  useEffect(() => {
    localStorage.setItem('qarakino_favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('qarakino_history', JSON.stringify(history))
  }, [history])

  const showToast = useCallback((message) => {
    setToast(message)
    setTimeout(() => setToast(null), 2000)
  }, [])

  const toggleFavorite = useCallback((video) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.id === video.id)
      if (exists) {
        fetch(`/api/favorites/${video.id}`, { method: 'DELETE' }).catch(() => {})
        showToast('已取消收藏')
        return prev.filter(f => f.id !== video.id)
      } else {
        fetch(`/api/favorites/${video.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoId: video.id })
        }).catch(() => {})
        showToast('已添加收藏')
        return [...prev, { ...video, favoritedAt: new Date().toISOString() }]
      }
    })
  }, [showToast])

  const isFavorite = useCallback((videoId) => {
    return favorites.some(f => f.id === videoId)
  }, [favorites])

  const addToHistory = useCallback((video) => {
    setHistory(prev => {
      const filtered = prev.filter(h => h.id !== video.id)
      return [{ ...video, watchedAt: new Date().toISOString() }, ...filtered].slice(0, 100)
    })
    fetch(`/api/history/${video.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId: video.id })
    }).catch(() => {})
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    localStorage.removeItem('qarakino_history')
    fetch('/api/history', { method: 'DELETE' }).catch(() => {})
    showToast('观看记录已清除')
  }, [showToast])

  const clearAllData = useCallback(() => {
    setFavorites([])
    setHistory([])
    localStorage.removeItem('qarakino_favorites')
    localStorage.removeItem('qarakino_history')
    showToast('所有数据已清除')
  }, [showToast])

  const value = {
    favorites,
    history,
    toggleFavorite,
    isFavorite,
    addToHistory,
    clearHistory,
    clearAllData,
    showToast,
    toast
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

// ==================== Skeleton Loading ====================
function SkeletonRow({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-image" />
          <div className="skeleton-title" />
          <div className="skeleton-subtitle" />
        </div>
      ))}
    </div>
  )
}

// ==================== App ====================
function App() {
  return (
    <Router>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </Router>
  )
}

function AppContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useAppContext()

  // Fix: use useEffect instead of useState for fetching categories
  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(setCategories)
      .catch(() => {})
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Top Navigation */}
      <nav className="bg-dark2/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center">
                <Play className="w-5 h-5 text-white" fill="currentColor" />
              </div>
              <span className="text-xl font-bold text-white">QaraKino</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1 overflow-x-auto hide-scrollbar">
              <Link
                to="/"
                className={`px-3 py-2 rounded-lg transition-all text-sm ${
                  isActive('/')
                    ? 'text-white bg-gray-800'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                首页
              </Link>
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.name}`}
                  className={`px-3 py-2 rounded-lg transition-all text-sm whitespace-nowrap ${
                    isActive(`/category/${cat.name}`)
                      ? 'text-white bg-gray-800'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {cat.nameUy}
                </Link>
              ))}
            </div>

            {/* Right Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigate('/search')}
                className={`p-2 rounded-lg transition-all ${
                  isActive('/search')
                    ? 'text-white bg-gray-800'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/profile')}
                className={`p-2 rounded-lg transition-all ${
                  isActive('/profile')
                    ? 'text-white bg-gray-800'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <User className="w-5 h-5" />
              </button>
              <button
                className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-dark2 border-t border-gray-800 animate-slideDown">
            <div className="px-4 py-2 space-y-1 max-h-[60vh] overflow-y-auto">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-all text-sm ${
                  isActive('/')
                    ? 'text-white bg-gray-800'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                首页
              </Link>
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.name}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-all text-sm ${
                    isActive(`/category/${cat.name}`)
                      ? 'text-white bg-gray-800'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {cat.nameUy}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pb-20 md:pb-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/video/:id" element={<VideoPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-dark2/95 backdrop-blur-md border-t border-gray-800 z-50 pb-safe">
        <div className="flex justify-around py-1.5">
          <Link
            to="/"
            className={`flex flex-col items-center p-2 rounded-lg transition-colors min-w-[60px] ${
              isActive('/') ? 'text-red-500' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">首页</span>
          </Link>
          <Link
            to="/search"
            className={`flex flex-col items-center p-2 rounded-lg transition-colors min-w-[60px] ${
              isActive('/search') ? 'text-red-500' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">搜索</span>
          </Link>
          <Link
            to="/favorites"
            className={`flex flex-col items-center p-2 rounded-lg transition-colors min-w-[60px] ${
              isActive('/favorites') ? 'text-red-500' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Heart className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">收藏</span>
          </Link>
          <Link
            to="/profile"
            className={`flex flex-col items-center p-2 rounded-lg transition-colors min-w-[60px] ${
              isActive('/profile') ? 'text-red-500' : 'text-gray-400 hover:text-white'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">我的</span>
          </Link>
        </div>
      </nav>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] toast-enter">
          <div className="bg-gray-800 text-white px-6 py-3 rounded-xl shadow-lg border border-gray-700 text-sm">
            {toast}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
