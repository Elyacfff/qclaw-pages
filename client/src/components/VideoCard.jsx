import React from 'react'
import { Play, Eye, Star } from 'lucide-react'

const VideoCard = ({ video, onClick, progress, showRating = false }) => {
  const progressPercent = progress || 0

  const renderStars = (rating) => {
    if (!rating || rating <= 0) return null
    const fullStars = Math.floor(rating)
    const hasHalf = rating % 1 >= 0.5
    return (
      <div className="flex items-center gap-0.5 mt-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${
              i < fullStars
                ? 'star-filled fill-current'
                : i === fullStars && hasHalf
                ? 'star-filled'
                : 'star-empty'
            }`}
          />
        ))}
        <span className="text-xs text-gray-400 ml-1">{rating.toFixed(1)}</span>
      </div>
    )
  }

  return (
    <div
      className="group cursor-pointer animate-fadeIn"
      onClick={() => onClick && onClick(video)}
    >
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
          loading="lazy"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
            <Play className="w-6 h-6 text-white ml-0.5" fill="currentColor" />
          </div>
        </div>
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-xs text-white font-medium">
          {video.duration}
        </div>
        {/* Featured badge */}
        {video.isFeatured && (
          <div className="absolute top-2 left-2 bg-red-600 px-2 py-0.5 rounded text-xs text-white font-medium">
            热门
          </div>
        )}
        {/* Progress bar overlay */}
        {progressPercent > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600/50">
            <div
              className="h-full bg-red-500 transition-all duration-300"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
        )}
      </div>
      <h3 className="text-white font-medium text-sm line-clamp-2 group-hover:text-red-500 transition-colors">
        {video.title}
      </h3>
      {video.titleCn && (
        <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">
          {video.titleCn}
        </p>
      )}
      <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
        <Eye className="w-3 h-3" />
        <span>{video.views?.toLocaleString() || 0} 播放</span>
      </div>
      {/* Rating stars */}
      {showRating && renderStars(video.rating)}
    </div>
  )
}

export default VideoCard
