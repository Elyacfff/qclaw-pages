import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Play, Heart, Share2, Eye, ChevronRight } from 'lucide-react'

function VideoPage() {
  const { id } = useParams()
  const [video, setVideo] = useState(null)
  const [relatedVideos, setRelatedVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`/api/videos/${id}`).then(r => r.json()),
      fetch('/api/videos').then(r => r.json())
    ]).then(([vid, allVids]) => {
      setVideo(vid)
      setRelatedVideos(allVids.filter(v => v.id !== parseInt(id)).slice(0, 8))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">يۈكلىنىۋاتىدۇ...</div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">ۋىدېئو تېپىلمىدى</div>
      </div>
    )
  }

  return (
    <div className="pb-8">
      <div className="aspect-video bg-black">
        <video
          src={video.videoUrl}
          controls
          className="w-full h-full"
          poster={video.thumbnail}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">{video.title}</h1>
            {video.titleCn && <p className="text-gray-400 mb-4">{video.titleCn}</p>}

            <div className="flex items-center gap-6 mb-6 text-gray-400">
              <div className="flex items-center gap-1">
                <Eye className="w-5 h-5" />
                <span>{video.views?.toLocaleString() || 0} كۆرۈش</span>
              </div>
              <span className="text-gray-600">•</span>
              <span>{video.duration}</span>
            </div>

            <div className="flex gap-4 mb-6">
              <button className="flex items-center gap-2 bg-primary hover:bg-red-700 px-6 py-2 rounded-lg transition">
                <Heart className="w-5 h-5" />
                ياقتۇرىش
              </button>
              <button className="flex items-center gap-2 bg-dark2 hover:bg-gray-800 px-6 py-2 rounded-lg transition border border-gray-700">
                <Share2 className="w-5 h-5" />
                ھەمبەھىرلەش
              </button>
            </div>

            {video.description && (
              <div className="bg-dark2 rounded-lg p-4 border border-gray-800">
                <h3 className="font-medium mb-2">تەسۋىرلەش</h3>
                <p className="text-gray-300">{video.description}</p>
                {video.descriptionCn && (
                  <p className="text-gray-500 mt-2">{video.descriptionCn}</p>
                )}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">ئوخشاش ۋىدېئولار</h3>
            <div className="space-y-4">
              {relatedVideos.map(v => (
                <Link key={v.id} to={`/video/${v.id}`} className="flex gap-3 group">
                  <div className="relative w-40 flex-shrink-0 aspect-video rounded-lg overflow-hidden">
                    <img
                      src={v.thumbnail}
                      alt={v.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-xs">
                      {v.duration}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium line-clamp-2 group-hover:text-primary transition">
                      {v.title}
                    </h4>
                    <p className="text-gray-400 text-sm mt-1">
                      {v.views?.toLocaleString() || 0} كۆرۈش
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPage
