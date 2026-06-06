import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { History, Trash2, Play } from 'lucide-react'
import VideoCard from '../components/VideoCard'
import { useAppContext } from '../App'

function HistoryPage() {
  const navigate = useNavigate()
  const { history, clearHistory } = useAppContext()
  const [loading, setLoading] = useState(true)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  const handleClearAll = () => {
    clearHistory()
    setShowConfirm(false)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-10 skeleton w-32 mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-image" />
              <div className="skeleton-title" />
              <div className="skeleton-subtitle" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fadeIn">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <History className="w-7 h-7 text-red-500" />
            观看记录
          </h1>
          <p className="text-gray-400 mt-2 text-sm">{history.length} 个视频</p>
        </div>
        {history.length > 0 && (
          <div>
            {showConfirm ? (
              <div className="flex items-center gap-2 animate-fadeIn">
                <span className="text-sm text-gray-400">确定清除？</span>
                <button
                  onClick={handleClearAll}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
                >
                  确定
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="bg-dark2 hover:bg-gray-800 text-gray-300 px-3 py-1.5 rounded-lg text-sm transition-colors border border-gray-700"
                >
                  取消
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
                清除全部
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {history.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-fadeIn">
          {history.map(video => (
            <div key={video.id} className="relative">
              <VideoCard
                video={video}
                onClick={(v) => navigate(`/video/${v.id}`)}
                progress={video.progress || 30}
              />
              {video.watchedAt && (
                <p className="text-xs text-gray-500 mt-1">
                  {formatTimestamp(video.watchedAt)}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
          <History className="w-20 h-20 text-gray-700 mb-6" />
          <p className="text-xl text-gray-400 mb-2">暂无观看记录</p>
          <p className="text-sm text-gray-600 mb-6">观看过的视频会显示在这里</p>
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl transition-colors font-medium flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            开始观看
          </button>
        </div>
      )}
    </div>
  )
}

export default HistoryPage
