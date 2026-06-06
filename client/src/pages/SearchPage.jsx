import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search as SearchIcon, Play, Eye } from 'lucide-react'

function SearchPage() {
  const [query, setQuery] = useState('')
  const [videos, setVideos] = useState([])
  const [allVideos, setAllVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/videos')
      .then(r => r.json())
      .then(setAllVideos)
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (query.trim()) {
      setLoading(true)
      fetch(`/api/videos?search=${encodeURIComponent(query)}`)
        .then(r => r.json())
        .then(data => {
          setVideos(data)
          setLoading(false)
        })
        .catch(() => {
          const filtered = allVideos.filter(v =>
            v.title.toLowerCase().includes(query.toLowerCase()) ||
            (v.titleCn && v.titleCn.toLowerCase().includes(query.toLowerCase()))
          )
          setVideos(filtered)
          setLoading(false)
        })
    } else {
      setVideos([])
    }
  }, [query, allVideos])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input
            type="text"
            placeholder="ئىزدەش..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-dark2 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary"
            autoFocus
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="text-xl">ئىزدەۋاتىدۇ...</div>
        </div>
      ) : query.trim() ? (
        videos.length > 0 ? (
          <div>
            <h2 className="text-xl font-bold mb-6">
              {videos.length} نەتىجە تېپىلدى
            </h2>
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
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p className="text-xl">نەتىجە تېپىلمىدى</p>
          </div>
        )
      ) : (
        <div className="text-center py-16 text-gray-400">
          <p className="text-xl">ئىزدەش سۆزىنى كىرگۈزۈڭ</p>
        </div>
      )}
    </div>
  )
}

export default SearchPage
