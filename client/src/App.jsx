import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { Home, Search, User, Play, Menu, X, Film, Heart, Settings } from 'lucide-react'
import { useState } from 'react'
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
  const [categories, setCategories] = useState([])
  const navigate = useNavigate()

  // 加载分类
  useState(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(setCategories)
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-dark">
      {/* 顶部导航 */}
      <nav className="bg-dark2/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                <Play className="w-6 h-6 text-white" fill="currentColor" />
              </div>
              <span className="text-2xl font-bold text-white">QaraKino</span>
            </Link>

            {/* 桌面端菜单 */}
            <div className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
              >
                首页
              </Link>
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.name}`}
                  className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                >
                  {cat.nameUy}
                </Link>
              ))}
            </div>

            {/* 右侧按钮 */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/search')}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
              >
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
                <User className="w-5 h-5" />
              </button>
              <button
                className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* 移动端菜单 */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-dark2 border-t border-gray-800">
            <div className="px-4 py-3 space-y-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
              >
                首页
              </Link>
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.name}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                >
                  {cat.nameUy}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* 主内容 */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/video/:id" element={<VideoPage />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>

      {/* 移动端底部导航 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-dark2 border-t border-gray-800 z-50">
        <div className="flex justify-around py-2">
          <Link
            to="/"
            className="flex flex-col items-center p-2 text-gray-400 hover:text-white transition-colors"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">首页</span>
          </Link>
          <Link
            to="/search"
            className="flex flex-col items-center p-2 text-gray-400 hover:text-white transition-colors"
          >
            <Search className="w-6 h-6" />
            <span className="text-xs mt-1">搜索</span>
          </Link>
          <Link
            to="#"
            className="flex flex-col items-center p-2 text-gray-400 hover:text-white transition-colors"
          >
            <Heart className="w-6 h-6" />
            <span className="text-xs mt-1">收藏</span>
          </Link>
          <Link
            to="#"
            className="flex flex-col items-center p-2 text-gray-400 hover:text-white transition-colors"
          >
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">我的</span>
          </Link>
        </div>
      </nav>

      {/* 移动端底部安全区域 */}
      <div className="md:hidden h-16" />
    </div>
  )
}

export default App
