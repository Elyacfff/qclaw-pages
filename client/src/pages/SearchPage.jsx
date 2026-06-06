import { useEffect, useState, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search as SearchIcon, SlidersHorizontal, X } from 'lucide-react'
import VideoCard from '../components/VideoCard'

function SearchPage() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [videos, setVideos] = useState([])
  const [allVideos, setAllVideos] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [hasSearched, setHasSearched] = useState(false)
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const debounceTimer = useRef(null)

  // Load all videos and categories
  useEffect(() => {
    Promise.all([
      fetch('/api/videos').then(r => r.json()),
      fetch('/api/categories').then(r => r.json())
    ]).then(([vids, cats]) => {
      setAllVideos(vids)
      setCategories(cats)
    }).catch(() => {})
  }, [])

  // Debounce search
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [query])

  // Search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      setHasSearched(true)
      setLoading(true)
      fetch(`/api/videos?search=${encodeURIComponent(debouncedQuery)}`)
        .then(r => r.json())
        .then(data => {
          setVideos(data)
          setLoading(false)
        })
        .catch(() => {
          const filtered = allVideos.filter(v =>
            v.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            (v.titleCn && v.titleCn.toLowerCase().includes(debouncedQuery.toLowerCase()))
          )
          setVideos(filtered)
          setLoading(false)
        })
    } else {
      setVideos([])
      setHasSearched(false)
    }
  }, [debouncedQuery, allVideos])

  // Filter and sort
  const filteredVideos = useMemo(() => {
    let result = [...videos]

    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter(v => v.category === activeCategory)
    }

    // Sort
    switch (sortBy) {
      case 'views':
        result.sort((a, b) => (b.views || 0) - (a.views || 0))
        break
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        break
      default:
        break
    }

    return result
  }, [videos, activeCategory, sortBy])

  // Auto focus
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="搜索视频、电影、电视剧..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 bg-dark2 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors text-sm"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setDebouncedQuery(''); setHasSearched(false) }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Tabs */}
      {hasSearched && (
        <div className="mb-6 animate-fadeIn">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                activeCategory === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-dark2 text-gray-300 hover:bg-gray-800'
              }`}
            >
              全部
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                  activeCategory === cat.name
                    ? 'bg-red-600 text-white'
                    : 'bg-dark2 text-gray-300 hover:bg-gray-800'
                }`}
              >
                {cat.nameUy}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sort Options */}
      {hasSearched && (
        <div className="flex items-center justify-between mb-6 animate-fadeIn">
          <span className="text-sm text-gray-400">
            {loading ? '搜索中...' : `${filteredVideos.length} 个结果`}
          </span>
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
            </select>
          </div>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="animate-fadeIn">
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
      ) : hasSearched ? (
        filteredVideos.length > 0 ? (
          <div className="animate-fadeIn">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredVideos.map(video => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onClick={(v) => navigate(`/video/${v.id}`)}
                  showRating
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 animate-fadeIn">
            <SearchIcon className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-xl text-gray-400 mb-2">未找到相关视频</p>
            <p className="text-sm text-gray-600">试试其他关键词或缩短搜索内容</p>
          </div>
        )
      ) : (
        <div className="text-center py-20 animate-fadeIn">
          <SearchIcon className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <p className="text-xl text-gray-400">输入关键词搜索视频</p>
          <p className="text-sm text-gray-600 mt-2">支持中文、维吾尔语搜索</p>
        </div>
      )}
    </div>
  )
}

export default SearchPage
