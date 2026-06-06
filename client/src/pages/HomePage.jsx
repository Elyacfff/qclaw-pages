import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, ChevronRight, TrendingUp, Clock, History, Sparkles } from 'lucide-react'
import VideoCard from '../components/VideoCard'
import { useAppContext } from '../App'

function HomePage() {
  const navigate = useNavigate()
  const { history } = useAppContext()
  const [videos, setVideos] = useState([])
  const [featuredVideos, setFeaturedVideos] = useState([])
  const [categories, setCategories] = useState([])
  const [sliders, setSliders] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    Promise.all([
      fetch('/api/videos').then(r => r.json()),
      fetch('/api/videos?featured=true').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/sliders').then(r => r.json())
    ]).then(([allVideos, featured, cats, slids]) => {
      setVideos(allVideos)
      setFeaturedVideos(featured)
      setCategories(cats)
      setSliders(slids)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }, [])

  // Auto-rotate carousel
  useEffect(() => {
    if (sliders.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliders.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [sliders.length])

  // Continue watching: last 4 from history
  const continueWatching = useMemo(() => {
    return history.slice(0, 4)
  }, [history])

  // Recommended: random videos
  const recommended = useMemo(() => {
    if (videos.length === 0) return []
    const shuffled = [...videos].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 12)
  }, [videos])

  // Skeleton loading
  if (loading) {
    return (
      <div className="pb-24">
        {/* Carousel skeleton */}
        <div className="h-[60vh] md:h-[70vh] skeleton" />
        <div className="max-w-7xl mx-auto px-4 mt-12 space-y-12">
          <div>
            <div className="h-8 skeleton w-40 mb-6" />
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
          <div>
            <div className="h-8 skeleton w-40 mb-6" />
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
        </div>
      </div>
    )
  }

  return (
    <div className="pb-24">
      {/* Carousel */}
      {sliders.length > 0 && (
        <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
          {sliders.map((slider, index) => (
            <div
              key={slider.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slider.image}
                alt={slider.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 animate-fadeIn">
                  {slider.title}
                </h2>
                {slider.titleCn && (
                  <p className="text-xl text-gray-300 mb-6">{slider.titleCn}</p>
                )}
                <button
                  onClick={() => slider.videoId && navigate(`/video/${slider.videoId}`)}
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-medium transition-all hover:scale-105 shadow-lg"
                >
                  <Play className="w-5 h-5" fill="currentColor" />
                  立即观看
                </button>
              </div>
            </div>
          ))}
          {/* Carousel indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {sliders.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentSlide ? 'bg-red-600 w-8' : 'bg-white/50 w-3'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 mt-12">
        {/* Continue Watching */}
        {continueWatching.length > 0 && (
          <section className="mb-12 animate-slideUp">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <History className="w-6 h-6 text-red-500" />
                继续观看
              </h2>
              <button
                onClick={() => navigate('/history')}
                className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors text-sm"
              >
                查看全部 <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {continueWatching.map(video => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onClick={(v) => navigate(`/video/${v.id}`)}
                  progress={video.progress || 30}
                />
              ))}
            </div>
          </section>
        )}

        {/* Recommended */}
        {recommended.length > 0 && (
          <section className="mb-12 animate-slideUp">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                猜你喜欢
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {recommended.slice(0, 6).map(video => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onClick={(v) => navigate(`/video/${v.id}`)}
                  showRating
                />
              ))}
            </div>
          </section>
        )}

        {/* Featured Videos */}
        {featuredVideos.length > 0 && (
          <section className="mb-12 animate-slideUp">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-red-600" />
                热门推荐
              </h2>
              <button
                onClick={() => navigate('/category/kino')}
                className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors text-sm"
              >
                查看全部 <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {featuredVideos.map(video => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onClick={(v) => navigate(`/video/${v.id}`)}
                  showRating
                />
              ))}
            </div>
          </section>
        )}

        {/* Latest Videos */}
        <section className="mb-12 animate-slideUp">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Clock className="w-6 h-6 text-red-600" />
              最新更新
            </h2>
            <button
              onClick={() => navigate('/category/kino')}
              className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors text-sm"
            >
              查看全部 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {videos.slice(0, 6).map(video => (
              <VideoCard
                key={video.id}
                video={video}
                onClick={(v) => navigate(`/video/${v.id}`)}
              />
            ))}
          </div>
        </section>

        {/* Category Sections */}
        {categories.map(category => {
          const categoryVideos = videos.filter(v => v.category === category.name)
          if (categoryVideos.length === 0) return null
          return (
            <section key={category.id} className="mb-12 animate-slideUp">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {category.nameUy}
                </h2>
                <button
                  onClick={() => navigate(`/category/${category.name}`)}
                  className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors text-sm"
                >
                  查看全部 <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {categoryVideos.slice(0, 6).map(video => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onClick={(v) => navigate(`/video/${v.id}`)}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

export default HomePage
