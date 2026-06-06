import { useEffect, useState } from 'react'
import {
  Search,
  Trash2,
  MessageSquare,
  X,
  Video,
  User,
  Clock,
  Loader2
} from 'lucide-react'

function Comments() {
  const [allComments, setAllComments] = useState([])
  const [videos, setVideos] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const vids = await fetch('/api/videos').then(r => r.json())
        setVideos(vids)

        // 获取每个视频的评论
        const commentsPromises = vids.map(v =>
          fetch(`/api/videos/${v.id}/comments`)
            .then(r => r.json())
            .then(comments => {
              return (Array.isArray(comments) ? comments : []).map(c => ({
                ...c,
                videoId: v.id,
                videoTitle: v.titleCn || v.title,
                videoTitleUy: v.title
              }))
            })
            .catch(() => [])
        )

        const commentArrays = await Promise.all(commentsPromises)
        const flatComments = commentArrays.flat().sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0)
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0)
          return dateB - dateA
        })

        setAllComments(flatComments)
      } catch (err) {
        console.error('Error fetching comments:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  const filteredComments = allComments.filter(c => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      c.text?.toLowerCase().includes(q) ||
      c.author?.toLowerCase().includes(q) ||
      c.videoTitle?.toLowerCase().includes(q) ||
      c.videoTitleUy?.toLowerCase().includes(q)
    )
  })

  const handleDelete = async (comment) => {
    if (!confirm('确定要删除这条评论吗？')) return

    try {
      await fetch(`/api/videos/${comment.videoId}/comments/${comment.id}`, {
        method: 'DELETE'
      })
    } catch (err) {}

    setAllComments(allComments.filter(c => c.id !== comment.id))
  }

  const formatTime = (dateStr) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now - date

    if (diff < 60000) return '刚刚'
    if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} 天前`

    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-gray-400 flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          加载评论中...
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 animate-fade-in">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">评论管理</h1>
          <p className="text-gray-500 text-sm mt-1">
            共 {allComments.length} 条评论，当前显示 {filteredComments.length} 条
          </p>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="content-card mb-6">
        <div className="p-4">
          <div className="search-input-wrapper max-w-lg">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="搜索评论内容、作者或视频标题..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 评论列表 */}
      {filteredComments.length > 0 ? (
        <div className="space-y-3">
          {filteredComments.map((comment, index) => (
            <div
              key={comment.id}
              className="content-card group hover:border-blue-200 transition-colors duration-200"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* 用户头像 */}
                  <div className="w-10 h-10 rounded-full gradient-purple flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>

                  {/* 评论内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-sm font-semibold text-gray-800">
                        {comment.author || '匿名用户'}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(comment.createdAt)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                      {comment.text}
                    </p>

                    <div className="flex items-center gap-2">
                      <span className="tag tag-blue flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        {comment.videoTitle}
                      </span>
                    </div>
                  </div>

                  {/* 删除按钮 */}
                  <button
                    onClick={() => handleDelete(comment)}
                    className="btn-icon text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    title="删除评论"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="content-card">
          <div className="empty-state">
            <MessageSquare className="empty-state-icon" />
            <p className="text-gray-500">
              {searchQuery ? '没有找到匹配的评论' : '暂无评论'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 btn-secondary text-sm"
              >
                <X className="w-4 h-4" />
                清除搜索
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Comments
