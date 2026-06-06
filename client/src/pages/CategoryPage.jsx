import { useEffect, useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import VideoCard from '../components/VideoCard'

function CategoryPage() {
  const { category } = useParams()
  const [videos, setVideos] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('default')
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    setSortBy('default')
    Promise.all([
      fetch(`/api/videos?category=${category}`).then(r => r.json()),
      fetch('/api/categories').then(r => r.json())
    ]).then(([vids, cats]) => {
      setVideos(vids)
      setCategories(cats)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [category])

  const currentCategory = categories.find(c => c.name === category)

  const sortedVideos = useMemo(() => {
    let result = [...videos]
    switch (sortBy) {
      case 'views':
        result.sort((a, b) => (b.views || 0) - (a.views || 0))
        break
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        break
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      default:
        break
    }
    return result
  }, [videos, sortBy])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-10 skeleton w-48 mb-6" />
        <div className="flex gap-3 mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-9 skeleton w-20 rounded-full" />
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
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
      {/* Category Header */}
      <div className="mb-6 animate-fadeIn">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          {currentCategory?.nameUy || category}
        </h1>
        {currentCategory?.nameCn && (
          <p className="text-gray-400 mt-1">{currentCategory.nameCn}</p>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex gap-3 mb-6 overflow-x-auto hide-scrollbar pb-2 animate-fadeIn">
        {categories.map(cat => (
          <Link
            key={cat.id}
            to={`/category/${cat.name}`}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm ${
              cat.name === category
                ? 'bg-red-600 text-white'
                : 'bg-dark2 text-gray-300 hover:bg-gray-800'
            }`}
          >
            {cat.nameUy}
          </Link>
        ))}
      </div>

      {/* Sort Options */}
      <div className="flex items-center justify-between mb-6 animate-fadeIn">
        <span className="text-sm text-gray-400">{sortedVideos.length} 个视频</span>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-dark2 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-red-600"
          >
            <option value="default">默认排序</option>
            <option value="views">最多播放</option>
            <option value="newest">最新发布</option>
            <option value="rating">最高评分</option>
          </select>
        </div>
      </div>

      {/* Video Grid */}
      {sortedVideos.length === 0 ? (
        <div className="text-center py-20 animate-fadeIn">
          <p className="text-xl text-gray-400">该分类暂无视频</p>
          <button
            onClick={() => navigate('/')}
            className="text-red-500 hover:text-red-400 mt-4 transition-colors text-sm"
          >
            返回首页
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-fadeIn">
          {sortedVideos.map(video => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={(v) => navigate(`/video/${v.id}`)}
              showRating
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CategoryPage
