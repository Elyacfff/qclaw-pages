import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Video,
  FolderKanban,
  SlidersHorizontal,
  MessageSquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Bell
} from 'lucide-react'
import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import Videos from './pages/Videos'
import Categories from './pages/Categories'
import Sliders from './pages/Sliders'
import Comments from './pages/Comments'

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

function AuthGuard({ children }) {
  const token = localStorage.getItem('qarakino_token')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}

function AppContent() {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // 如果是登录页，不显示侧边栏
  if (location.pathname === '/login') {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: '仪表盘' },
    { path: '/videos', icon: Video, label: '视频管理' },
    { path: '/categories', icon: FolderKanban, label: '分类管理' },
    { path: '/sliders', icon: SlidersHorizontal, label: '轮播图管理' },
    { path: '/comments', icon: MessageSquare, label: '评论管理' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('qarakino_token')
    localStorage.removeItem('qarakino_user')
    navigate('/login')
  }

  const adminUser = JSON.parse(localStorage.getItem('qarakino_user') || '{"username":"管理员"}')

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100 flex">
        {/* 侧边栏 */}
        <aside
          className={`bg-slate-900 text-white flex flex-col fixed top-0 left-0 h-full z-40 transition-all duration-300 ${
            sidebarCollapsed ? 'w-[72px]' : 'w-64'
          }`}
        >
          {/* Logo */}
          <div className="p-5 border-b border-slate-700/50 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg gradient-blue flex items-center justify-center flex-shrink-0">
              <Video className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="animate-fade-in">
                <h1 className="text-base font-bold text-white">QaraKino</h1>
                <p className="text-[10px] text-slate-400">管理后台</p>
              </div>
            )}
          </div>

          {/* 导航菜单 */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {menuItems.map(item => {
              const isActive = item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Link>
              )
            })}
          </nav>

          {/* 底部：折叠按钮 + 退出 */}
          <div className="p-3 border-t border-slate-700/50 space-y-1">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="sidebar-link sidebar-link-inactive w-full"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-5 h-5 flex-shrink-0" />
              ) : (
                <>
                  <ChevronLeft className="w-5 h-5 flex-shrink-0" />
                  <span>收起菜单</span>
                </>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="sidebar-link w-full text-red-400 hover:bg-red-900/20 hover:text-red-300"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>退出登录</span>}
            </button>
          </div>
        </aside>

        {/* 主内容区 */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            sidebarCollapsed ? 'ml-[72px]' : 'ml-64'
          }`}
        >
          {/* 顶部导航栏 */}
          <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-800">
                {menuItems.find(item =>
                  item.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.path)
                )?.label || 'QaraKino'}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              {/* 通知按钮 */}
              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* 管理员信息 */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="w-8 h-8 rounded-full gradient-blue flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-700">{adminUser.username || '管理员'}</p>
                  <p className="text-xs text-gray-400">超级管理员</p>
                </div>
              </div>

              {/* 退出按钮 */}
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="退出登录"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* 页面内容 */}
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/sliders" element={<Sliders />} />
              <Route path="/comments" element={<Comments />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}

export default App
