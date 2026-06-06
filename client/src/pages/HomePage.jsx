import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, ChevronRight, TrendingUp, Clock, Heart } from 'lucide-react'
import VideoCard from '../components/VideoCard'

function HomePage() {
  const navigate = useNavigate()
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

  useEffect(() => {
    if (sliders.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliders.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [sliders.length])

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-24">
      {/* 轮播图 */}
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
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">
                  {slider.title}
                </h2>
                {slider.titleCn && (
                  <p className="text-xl text-gray-300 mb-6">{slider.titleCn}</p>
                )}
                <button
                  onClick={() => slider.videoId && navigate(`/video/${slider.videoId}`)}
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-medium transition-all hover:scale-105"
                >
                  <Play className="w-5 h-5" fill="currentColor" />
                  立即观看
                </button>
              </div>
            </div>
          ))}
          {/* 轮播指示器 */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {sliders.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? 'bg-red-600 w-8' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 mt-12">
        {/* 精选视频 */}
        {featuredVideos.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-red-600" />
                热门推荐
              </h2>
              <button
                onClick={() => navigate('/category/kino')}
                className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
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
                />
              ))}
            </div>
          </section>
        )}

        {/* 最新视频 */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Clock className="w-6 h-6 text-red-600" />
              最新更新
            </h2>
            <button
              onClick={() => navigate('/category/kino')}
              className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
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

        {/* 分类视频 */}
        {categories.map(category => {
          const categoryVideos = videos.filter(v => v.category === category.name)
          if (categoryVideos.length === 0) return null
          return (
            <section key={category.id} className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {category.nameUy}
                </h2>
                <button
                  onClick={() => navigate(`/category/${category.name}`)}
                  className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
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
