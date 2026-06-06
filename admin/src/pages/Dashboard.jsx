import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Video,
  Eye,
  TrendingUp,
  FolderOpen,
  MessageSquare,
  Heart,
  Plus,
  ArrowRight,
  Clock,
  BarChart3
} from 'lucide-react'

function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalViews: 0,
    totalCategories: 0,
    featuredVideos: 0,
    totalComments: 0,
    totalFavorites: 0
  })
  const [recentVideos, setRecentVideos] = useState([])
  const [categoryViews, setCategoryViews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, videosRes, categoriesRes] = await Promise.all([
          fetch('/api/stats').then(r => r.json()),
          fetch('/api/videos').then(r => r.json()),
          fetch('/api/categories').then(r => r.json())
        ])

        setStats(statsRes)

        // 最近5个视频
        const sorted = [...videosRes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setRecentVideos(sorted.slice(0, 5))

        // 按分类统计播放量
        const viewsByCategory = categoriesRes.map(cat => {
          const catVideos = videosRes.filter(v => v.category === cat.name)
          const totalViews = catVideos.reduce((sum, v) => sum + (v.views || 0), 0)
          return {
            name: cat.nameCn || cat.nameUy || cat.name,
            views: totalViews
          }
        }).filter(c => c.views > 0).sort((a, b) => b.views - a.views)

        setCategoryViews(viewsByCategory)
      } catch (err) {
        // 开发环境模拟数据
        setStats({
          totalVideos: 128,
          totalViews: 45600,
          totalCategories: 6,
          featuredVideos: 12,
          totalComments: 892,
          totalFavorites: 3456
        })
        setRecentVideos([
          { id: 1, title: 'ئالتۇن تاغ', titleCn: '金山', thumbnail: '', views: 1250, createdAt: '2024-01-15' },
          { id: 2, title: 'مۇھەببەت ناخشىسى', titleCn: '爱情之歌', thumbnail: '', views: 980, createdAt: '2024-01-14' },
          { id: 3, title: 'قەدىمكى شەھەر', titleCn: '古城', thumbnail: '', views: 756, createdAt: '2024-01-13' },
          { id: 4, title: 'يېزا ھېكايىسى', titleCn: '乡村故事', thumbnail: '', views: 634, createdAt: '2024-01-12' },
          { id: 5, title: 'كېچىلىك سەپەر', titleCn: '夜行记', thumbnail: '', views: 521, createdAt: '2024-01-11' },
        ])
        setCategoryViews([
          { name: '电影', views: 18000 },
          { name: '音乐', views: 12000 },
          { name: '纪录片', views: 8000 },
          { name: '综艺', views: 5000 },
          { name: '动漫', views: 2600 },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const statCards = [
    { label: '总视频数', value: stats.totalVideos, icon: Video, gradient: 'gradient-blue', color: 'text-blue-600' },
    { label: '总播放量', value: stats.totalViews.toLocaleString(), icon: Eye, gradient: 'gradient-green', color: 'text-green-600' },
    { label: '分类数', value: stats.totalCategories, icon: FolderOpen, gradient: 'gradient-purple', color: 'text-purple-600' },
    { label: '精选视频', value: stats.featuredVideos, icon: TrendingUp, gradient: 'gradient-orange', color: 'text-orange-600' },
    { label: '总评论数', value: stats.totalComments.toLocaleString(), icon: MessageSquare, gradient: 'gradient-pink', color: 'text-pink-600' },
    { label: '总收藏数', value: stats.totalFavorites.toLocaleString(), icon: Heart, gradient: 'gradient-cyan', color: 'text-cyan-600' },
  ]

  const quickActions = [
    { label: '上传新视频', desc: '添加新的视频内容', icon: Video, path: '/videos', color: 'text-blue-600 bg-blue-50' },
    { label: '管理分类', desc: '编辑视频分类', icon: FolderOpen, path: '/categories', color: 'text-purple-600 bg-purple-50' },
    { label: '设置轮播图', desc: '配置首页轮播', icon: TrendingUp, path: '/sliders', color: 'text-orange-600 bg-orange-50' },
    { label: '查看评论', desc: '管理用户评论', icon: MessageSquare, path: '/comments', color: 'text-pink-600 bg-pink-50' },
  ]

  const maxViews = categoryViews.length > 0 ? Math.max(...categoryViews.map(c => c.views)) : 1

  const barColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-cyan-500',
    'bg-yellow-500',
    'bg-red-500',
  ]

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-gray-400 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 animate-pulse-slow" />
          加载中...
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 animate-fade-in">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">仪表盘</h1>
        <p className="text-gray-500 text-sm mt-1">欢迎回到 QaraKino 管理后台，以下是平台数据概览</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className="stat-card group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{card.label}</p>
                <p className="text-3xl font-bold mt-2 text-gray-800">{card.value}</p>
              </div>
              <div className={`${card.gradient} p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* 分类播放量柱状图 */}
        <div className="lg:col-span-2 content-card">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              分类播放量统计
            </h2>
          </div>
          <div className="p-6">
            {categoryViews.length > 0 ? (
              <div className="bar-chart">
                {categoryViews.map((cat, index) => (
                  <div key={index} className="bar-chart-item">
                    <span className="bar-chart-value">{(cat.views / 1000).toFixed(1)}k</span>
                    <div
                      className={`bar-chart-bar ${barColors[index % barColors.length]}`}
                      style={{ height: `${(cat.views / maxViews) * 100}%` }}
                    ></div>
                    <span className="bar-chart-label">{cat.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <BarChart3 className="empty-state-icon" />
                <p>暂无播放数据</p>
              </div>
            )}
          </div>
        </div>

        {/* 快速操作 */}
        <div className="content-card">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">快速操作</h2>
          </div>
          <div className="p-4 space-y-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200 group text-left"
              >
                <div className={`p-3 rounded-xl ${action.color} group-hover:scale-110 transition-transform duration-200`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-700">{action.label}</p>
                  <p className="text-xs text-gray-400">{action.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 最近添加的视频 */}
      <div className="content-card">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-500" />
            最近添加的视频
          </h2>
          <button
            onClick={() => navigate('/videos')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition"
          >
            查看全部
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {recentVideos.length > 0 ? (
            recentVideos.map((video, index) => (
              <div
                key={video.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-12 h-16 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                  {video.thumbnail ? (
                    <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{video.title}</p>
                  {video.titleCn && (
                    <p className="text-xs text-gray-400 truncate">{video.titleCn}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <Eye className="w-4 h-4" />
                  {video.views?.toLocaleString() || 0}
                </div>
                <div className="text-xs text-gray-400">
                  {video.createdAt ? new Date(video.createdAt).toLocaleDateString('zh-CN') : '-'}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <Video className="empty-state-icon" />
              <p>暂无视频</p>
              <button
                onClick={() => navigate('/videos')}
                className="mt-4 btn-primary text-sm"
              >
                <Plus className="w-4 h-4" />
                添加第一个视频
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
