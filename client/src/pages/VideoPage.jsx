import { useEffect, useState, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Play, Heart, Share2, Eye, Star, Maximize, PictureInPicture2,
  MessageCircle, Send, Calendar, Film, Tag, ChevronDown, ChevronUp
} from 'lucide-react'
import { useAppContext } from '../App'
import VideoCard from '../components/VideoCard'

function VideoPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toggleFavorite, isFavorite, addToHistory } = useAppContext()
  const videoRef = useRef(null)

  const [video, setVideo] = useState(null)
  const [relatedVideos, setRelatedVideos] = useState([])
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)
  const [showComments, setShowComments] = useState(true)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showRateMenu, setShowRateMenu] = useState(false)
  const [userRating, setUserRating] = useState(0)

  useEffect(() => {
    setLoading(true)
    setShowRateMenu(false)
    setPlaybackRate(1)

    Promise.all([
      fetch(`/api/videos/${id}`).then(r => r.json()),
      fetch('/api/videos').then(r => r.json()),
      fetch(`/api/videos/${id}/comments`).then(r => r.json()).catch(() => [])
    ]).then(([vid, allVids, coms]) => {
      setVideo(vid)
      setComments(coms)
      // Filter related videos by same category
      const related = allVids
        .filter(v => v.id !== parseInt(id) && v.category === vid.category)
        .slice(0, 8)
      // If not enough same-category videos, fill with others
      if (related.length < 4) {
        const others = allVids
          .filter(v => v.id !== parseInt(id) && v.category !== vid.category)
          .slice(0, 8 - related.length)
        setRelatedVideos([...related, ...others])
      } else {
        setRelatedVideos(related)
      }
      setLoading(false)

      // Add to history
      if (vid) {
        addToHistory(vid)
      }
    }).catch(() => setLoading(false))
  }, [id])

  const handleShare = () => {
    const url = window.location.href
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        alert('链接已复制到剪贴板')
      })
    } else {
      // Fallback
      const input = document.createElement('input')
      input.value = url
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      alert('链接已复制到剪贴板')
    }
  }

  const handleRate = (rating) => {
    setUserRating(rating)
    fetch(`/api/videos/${id}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating })
    }).catch(() => {})
  }

  const handleSubmitComment = (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    setCommentLoading(true)
    fetch(`/api/videos/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: commentText })
    })
      .then(r => r.json())
      .then(newComment => {
        setComments(prev => [newComment, ...prev])
        setCommentText('')
        setCommentLoading(false)
      })
      .catch(() => setCommentLoading(false))
  }

  const handlePlaybackRate = (rate) => {
    setPlaybackRate(rate)
    if (videoRef.current) {
      videoRef.current.playbackRate = rate
    }
    setShowRateMenu(false)
  }

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        videoRef.current.requestFullscreen()
      }
    }
  }

  const handlePiP = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
      } else if (videoRef.current) {
        await videoRef.current.requestPictureInPicture()
      }
    } catch (err) {
      console.error('PiP error:', err)
    }
  }

  const formatTime = (dateStr) => {
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
    if (days < 30) return `${days}天前`
    return date.toLocaleDateString('zh-CN')
  }

  const renderStars = (rating, interactive = false) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i}
            onClick={() => interactive && handleRate(i + 1)}
            className={`${interactive ? 'cursor-pointer hover:scale-125' : 'cursor-default'} transition-transform`}
          >
            <Star
              className={`w-5 h-5 ${
                i < (interactive ? userRating : rating)
                  ? 'star-filled fill-current'
                  : 'star-empty'
              }`}
            />
          </button>
        ))}
        <span className="text-sm text-gray-400 ml-1">
          {rating ? rating.toFixed(1) : '暂无评分'}
        </span>
      </div>
    )
  }

  // Skeleton loading
  if (loading) {
    return (
      <div className="pb-8">
        <div className="aspect-video bg-dark2 skeleton" />
        <div className="max-w-7xl mx-auto px-4 mt-6">
          <div className="h-8 skeleton w-3/4 mb-4" />
          <div className="h-5 skeleton w-1/2 mb-6" />
          <div className="flex gap-4 mb-6">
            <div className="h-10 skeleton w-28 rounded-lg" />
            <div className="h-10 skeleton w-28 rounded-lg" />
            <div className="h-10 skeleton w-28 rounded-lg" />
          </div>
          <div className="h-24 skeleton w-full rounded-lg mb-8" />
        </div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Film className="w-16 h-16 text-gray-600" />
        <p className="text-xl text-gray-400">视频未找到</p>
        <button
          onClick={() => navigate('/')}
          className="text-red-500 hover:text-red-400 transition-colors"
        >
          返回首页
        </button>
      </div>
    )
  }

  const fav = isFavorite(video.id)

  return (
    <div className="pb-8">
      {/* Video Player */}
      <div className="relative aspect-video bg-black group">
        <video
          ref={videoRef}
          src={video.videoUrl}
          controls
          className="w-full h-full"
          poster={video.thumbnail}
          playsInline
        />

        {/* Custom Controls Overlay */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Playback Rate */}
          <div className="relative">
            <button
              onClick={() => setShowRateMenu(!showRateMenu)}
              className="bg-black/70 hover:bg-black/90 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              {playbackRate}x
            </button>
            {showRateMenu && (
              <div className="absolute top-full right-0 mt-1 bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-xl animate-scaleIn">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                  <button
                    key={rate}
                    onClick={() => handlePlaybackRate(rate)}
                    className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-800 transition-colors ${
                      playbackRate === rate ? 'text-red-500 bg-gray-800' : 'text-white'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Fullscreen */}
          <button
            onClick={handleFullscreen}
            className="bg-black/70 hover:bg-black/90 text-white p-1.5 rounded-lg transition-colors"
          >
            <Maximize className="w-5 h-5" />
          </button>
          {/* PiP */}
          <button
            onClick={handlePiP}
            className="bg-black/70 hover:bg-black/90 text-white p-1.5 rounded-lg transition-colors"
          >
            <PictureInPicture2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{video.title}</h1>
            {video.titleCn && (
              <p className="text-gray-400 text-lg mb-4">{video.titleCn}</p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 mb-4 text-gray-400 text-sm">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{video.views?.toLocaleString() || 0} 次播放</span>
              </div>
              <span className="text-gray-600">|</span>
              <span>{video.duration}</span>
              {video.year && (
                <>
                  <span className="text-gray-600">|</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{video.year}</span>
                  </div>
                </>
              )}
            </div>

            {/* Metadata */}
            {(video.director || video.tags) && (
              <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
                {video.director && (
                  <div className="flex items-center gap-1 text-gray-300">
                    <Film className="w-4 h-4 text-gray-500" />
                    <span>导演: {video.director}</span>
                  </div>
                )}
                {video.tags && video.tags.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap">
                    <Tag className="w-4 h-4 text-gray-500" />
                    {video.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-dark3 text-gray-300 px-2 py-0.5 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Rating */}
            <div className="mb-4">
              {renderStars(video.rating)}
              {!userRating && (
                <p className="text-xs text-gray-500 mt-1">点击星星评分</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => toggleFavorite(video)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all font-medium ${
                  fav
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-dark2 text-gray-300 hover:bg-gray-800 border border-gray-700'
                }`}
              >
                <Heart className={`w-5 h-5 ${fav ? 'fill-current' : ''}`} />
                {fav ? '已收藏' : '收藏'}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 bg-dark2 hover:bg-gray-800 text-gray-300 px-5 py-2.5 rounded-lg transition-all border border-gray-700"
              >
                <Share2 className="w-5 h-5" />
                分享
              </button>
            </div>

            {/* Description */}
            {video.description && (
              <div className="bg-dark2 rounded-xl p-5 border border-gray-800 mb-6">
                <h3 className="font-medium text-white mb-2">简介</h3>
                <p className="text-gray-300 leading-relaxed">{video.description}</p>
                {video.descriptionCn && (
                  <p className="text-gray-500 mt-2">{video.descriptionCn}</p>
                )}
              </div>
            )}

            {/* Comments Section */}
            <div className="bg-dark2 rounded-xl border border-gray-800 overflow-hidden">
              <button
                onClick={() => setShowComments(!showComments)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-2 text-white font-medium">
                  <MessageCircle className="w-5 h-5" />
                  <span>评论 ({comments.length})</span>
                </div>
                {showComments ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {showComments && (
                <div className="animate-fadeIn">
                  {/* Comment Input */}
                  <form onSubmit={handleSubmitComment} className="p-4 border-t border-gray-800">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="发表评论..."
                          className="flex-1 bg-dark3 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors"
                        />
                        <button
                          type="submit"
                          disabled={!commentText.trim() || commentLoading}
                          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:text-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Comments List */}
                  <div className="divide-y divide-gray-800">
                    {comments.length > 0 ? (
                      comments.map((comment, i) => (
                        <div key={comment.id || i} className="p-4 flex gap-3">
                          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm text-gray-300 font-medium">
                                {comment.username || '匿名用户'}
                              </span>
                              <span className="text-xs text-gray-600">
                                {formatTime(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400">{comment.text}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-500 text-sm">
                        暂无评论，快来发表第一条评论吧
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Videos Sidebar */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold text-white mb-4">相关视频</h3>
            <div className="space-y-3">
              {relatedVideos.map(v => (
                <Link key={v.id} to={`/video/${v.id}`} className="flex gap-3 group">
                  <div className="relative w-36 flex-shrink-0 aspect-video rounded-lg overflow-hidden">
                    <img
                      src={v.thumbnail}
                      alt={v.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                      loading="lazy"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-xs">
                      {v.duration}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2 group-hover:text-red-500 transition">
                      {v.title}
                    </h4>
                    <p className="text-gray-500 text-xs mt-1">
                      {v.views?.toLocaleString() || 0} 次播放
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

// Need User icon for comments
function User({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

export default VideoPage
