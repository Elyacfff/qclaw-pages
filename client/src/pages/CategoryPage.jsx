import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Play, Eye } from 'lucide-react'

function CategoryPage() {
  const { category } = useParams()
  const [videos, setVideos] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">يۈكلىنىۋاتىدۇ...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        {currentCategory?.nameUy || category}
      </h1>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {categories.map(cat => (
          <Link
            key={cat.id}
            to={`/category/${cat.name}`}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
              cat.name === category
                ? 'bg-primary text-white'
                : 'bg-dark2 text-gray-300 hover:bg-gray-800'
            }`}
          >
            {cat.nameUy}
          </Link>
        ))}
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-xl">بۇ تۈرگە مەنبە تېپىلمىدى</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {videos.map(video => (
            <Link key={video.id} to={`/video/${video.id}`} className="group">
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
          ))}
        </div>
      )}
    </div>
  )
}

export default CategoryPage
