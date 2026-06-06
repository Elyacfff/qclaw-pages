import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Search } from 'lucide-react'
import VideoCard from '../components/VideoCard'
import { useAppContext } from '../App'

function FavoritesPage() {
  const navigate = useNavigate()
  const { favorites } = useAppContext()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate brief loading for animation
    const timer = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

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
      <div className="mb-8 animate-fadeIn">
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
          <Heart className="w-7 h-7 text-red-500" />
          我的收藏
        </h1>
        <p className="text-gray-400 mt-2 text-sm">{favorites.length} 个视频</p>
      </div>

      {/* Content */}
      {favorites.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-fadeIn">
          {favorites.map(video => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={(v) => navigate(`/video/${v.id}`)}
              showRating
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
          <Heart className="w-20 h-20 text-gray-700 mb-6" />
          <p className="text-xl text-gray-400 mb-2">还没有收藏的视频</p>
          <p className="text-sm text-gray-600 mb-6">浏览视频时点击收藏按钮添加</p>
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl transition-colors font-medium"
          >
            去发现视频
          </button>
        </div>
      )}
    </div>
  )
}

export default FavoritesPage
