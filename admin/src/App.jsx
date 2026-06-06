import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Video, FolderKanban, SlidersHorizontal, LogOut } from 'lucide-react'
import Dashboard from './pages/Dashboard'
import Videos from './pages/Videos'
import Categories from './pages/Categories'
import Sliders from './pages/Sliders'

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

function AppContent() {
  const location = useLocation()

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: '仪表盘' },
    { path: '/videos', icon: Video, label: '视频管理' },
    { path: '/categories', icon: FolderKanban, label: '分类管理' },
    { path: '/sliders', icon: SlidersHorizontal, label: '轮播图' },
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold">QaraKino Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                location.pathname === item.path
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-slate-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-300 hover:bg-slate-800 rounded-lg transition">
            <LogOut className="w-5 h-5" />
            退出
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/sliders" element={<Sliders />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
