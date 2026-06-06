import React from 'react'
import { Play, Eye } from 'lucide-react'

const VideoCard = ({ video, onClick }) => {
  return (
    <div
      className="group cursor-pointer"
      onClick={() => onClick(video)}
    >
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
            <Play className="w-7 h-7 text-white ml-1" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
          {video.duration}
        </div>
        {video.isFeatured && (
          <div className="absolute top-2 left-2 bg-red-600 px-2 py-1 rounded text-xs text-white font-medium">
            热门
          </div>
        )}
      </div>
      <h3 className="text-white font-medium text-sm line-clamp-2 group-hover:text-red-500 transition-colors">
        {video.title}
      </h3>
      {video.titleCn && (
        <p className="text-gray-400 text-xs mt-1 line-clamp-1">
          {video.titleCn}
        </p>
      )}
      <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
        <Eye className="w-3 h-3" />
        <span>{video.views?.toLocaleString() || 0} 播放</span>
      </div>
    </div>
  )
}

export default VideoCard
