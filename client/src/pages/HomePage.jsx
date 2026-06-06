import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, ChevronRight, Eye } from 'lucide-react'

function HomePage() {
  const [videos, setVideos] = useState([])
  const [featuredVideos, setFeaturedVideos] = useState([])
  const [categories, setCategories] = useState([])
  const [sliders, setSliders] = useState([])
  const [loading, setLoading] = useState(true)

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
    }).catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">يۈكلىنىۋاتىدۇ...</div>
      </div>
    )
  }

  return (
    <div className="pb-8">
      {sliders.length > 0 && (
        <div className="relative overflow-hidden">
          <div className="flex transition-transform duration-500">
            {sliders.map((slider, index) => (
              <div key={slider.id} className="min-w-full relative">
                <div className="aspect-[21/9] relative">
                  <img
                    src={slider.image}
                    alt={slider.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                    <h2 className="text-2xl md:text-4xl font-bold mb-2">{slider.title}</h2>
                    <p className="text-gray-300 mb-4">{slider.titleCn}</p>
                    <Link
                      to={`/video/${slider.videoId}`}
                      className="inline-flex items-center gap-2 bg-primary hover:bg-red-700 px-6 py-3 rounded-lg font-medium transition"
                    >
                      <Play fill="currentColor" />
                      ئىزدەش
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold">ماھىر كىنولار</h2>
            <Link to="/category/kino" className="text-primary hover:text-red-400 flex items-center gap-1">
              ھەممىسى <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {videos.slice(0, 5).map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>

        {featuredVideos.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-bold">تاللانغان</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {featuredVideos.map(video => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </div>
        )}

        {categories.map(category => (
          <div key={category.id} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-bold">{category.nameUy}</h2>
              <Link to={`/category/${category.name}`} className="text-primary hover:text-red-400 flex items-center gap-1">
                ھەممىسى <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {videos.filter(v => v.category === category.name).slice(0, 5).map(video => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function VideoCard({ video }) {
  return (
    <Link to={`/video/${video.id}`} className="group">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center">
            <Play fill="currentColor" className="w-6 h-6 ml-1" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-sm">
          {video.duration}
        </div>
      </div>
      <h3 className="font-medium truncate">{video.title}</h3>
      <div className="flex items-center gap-1 text-gray-400 text-sm">
        <Eye className="w-3 h-3" />
        <span>{video.views?.toLocaleString() || 0} كۆرۈش</span>
      </div>
    </Link>
  )
}

export default HomePage
