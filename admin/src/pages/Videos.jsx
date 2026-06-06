import { useEffect, useState } from 'react'
import {
  Plus,
  Edit2,
  Trash2,
  Star,
  Eye,
  Search,
  X,
  Play,
  CheckSquare,
  Square,
  Film,
  Tag
} from 'lucide-react'

function StarRating({ rating }) {
  const stars = []
  const r = Math.round(rating || 0)
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${i <= r ? 'star-filled fill-yellow-400' : 'star-empty'}`}
      />
    )
  }
  return <div className="star-rating">{stars}</div>
}

function Videos() {
  const [videos, setVideos] = useState([])
  const [categories, setCategories] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [previewVideo, setPreviewVideo] = useState(null)
  const [editingVideo, setEditingVideo] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [formData, setFormData] = useState({
    title: '',
    titleCn: '',
    description: '',
    descriptionCn: '',
    category: 'kino',
    isFeatured: false,
    duration: '00:00',
    year: '',
    director: '',
    tags: '',
    rating: 0
  })
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [videoFile, setVideoFile] = useState(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/videos').then(r => r.json()),
      fetch('/api/categories').then(r => r.json())
    ]).then(([vids, cats]) => {
      setVideos(vids)
      setCategories(cats)
    }).catch(() => {})
  }, [])

  const filteredVideos = videos.filter(v => {
    const matchSearch = !searchQuery ||
      v.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.titleCn?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchCategory = !filterCategory || v.category === filterCategory
    return matchSearch && matchCategory
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'tags' && value) {
        form.append(key, value)
      } else {
        form.append(key, value)
      }
    })
    if (thumbnailFile) form.append('thumbnail', thumbnailFile)
    if (videoFile) form.append('video', videoFile)

    try {
      let response
      if (editingVideo) {
        response = await fetch(`/api/videos/${editingVideo.id}`, {
          method: 'PUT',
          body: form
        })
      } else {
        response = await fetch('/api/videos', {
          method: 'POST',
          body: form
        })
      }
      const newVideo = await response.json()
      if (editingVideo) {
        setVideos(videos.map(v => v.id === editingVideo.id ? newVideo : v))
      } else {
        setVideos([newVideo, ...videos])
      }
      closeModal()
    } catch (err) {
      console.error('Error saving video:', err)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('确定要删除这个视频吗？此操作不可撤销。')) {
      try {
        await fetch(`/api/videos/${id}`, { method: 'DELETE' })
      } catch (err) {}
      setVideos(videos.filter(v => v.id !== id))
      setSelectedIds(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) return
    if (!confirm(`确定要删除选中的 ${selectedIds.size} 个视频吗？此操作不可撤销。`)) return

    try {
      await Promise.all(
        Array.from(selectedIds).map(id => fetch(`/api/videos/${id}`, { method: 'DELETE' }))
      )
    } catch (err) {}
    setVideos(videos.filter(v => !selectedIds.has(v.id)))
    setSelectedIds(new Set())
  }

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredVideos.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredVideos.map(v => v.id)))
    }
  }

  const openEditModal = (video) => {
    setEditingVideo(video)
    setFormData({
      title: video.title,
      titleCn: video.titleCn || '',
      description: video.description || '',
      descriptionCn: video.descriptionCn || '',
      category: video.category,
      isFeatured: video.isFeatured,
      duration: video.duration,
      year: video.year || '',
      director: video.director || '',
      tags: Array.isArray(video.tags) ? video.tags.join(', ') : video.tags || '',
      rating: video.rating || 0
    })
    setShowModal(true)
  }

  const openPreviewModal = (video) => {
    setPreviewVideo(video)
    setShowPreview(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingVideo(null)
    setFormData({
      title: '',
      titleCn: '',
      description: '',
      descriptionCn: '',
      category: 'kino',
      isFeatured: false,
      duration: '00:00',
      year: '',
      director: '',
      tags: '',
      rating: 0
    })
    setThumbnailFile(null)
    setVideoFile(null)
  }

  const getCategoryName = (catName) => {
    const cat = categories.find(c => c.name === catName)
    return cat?.nameCn || cat?.nameUy || catName
  }

  return (
    <div className="p-8 animate-fade-in">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">视频管理</h1>
          <p className="text-gray-500 text-sm mt-1">共 {videos.length} 个视频，当前显示 {filteredVideos.length} 个</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="w-5 h-5" />
          添加视频
        </button>
      </div>

      {/* 搜索和筛选栏 */}
      <div className="content-card mb-6">
        <div className="p-4 flex flex-wrap items-center gap-4">
          <div className="search-input-wrapper flex-1 min-w-[200px]">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="搜索视频标题..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="form-select w-auto min-w-[150px]"
          >
            <option value="">全部分类</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.nameCn || cat.nameUy}</option>
            ))}
          </select>
          {(searchQuery || filterCategory) && (
            <button
              onClick={() => { setSearchQuery(''); setFilterCategory('') }}
              className="btn-secondary text-sm"
            >
              <X className="w-4 h-4" />
              清除筛选
            </button>
          )}
        </div>
      </div>

      {/* 批量操作栏 */}
      {selectedIds.size > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between animate-fade-in">
          <span className="text-sm text-red-700 font-medium">
            已选择 {selectedIds.size} 个视频
          </span>
          <button onClick={handleBatchDelete} className="btn-danger text-sm">
            <Trash2 className="w-4 h-4" />
            删除选中
          </button>
        </div>
      )}

      {/* 视频表格 */}
      <div className="content-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="w-10">
                <button onClick={toggleSelectAll} className="btn-icon text-gray-400 hover:text-gray-600">
                  {selectedIds.size === filteredVideos.length && filteredVideos.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th>预览</th>
              <th>标题</th>
              <th>分类</th>
              <th>年份</th>
              <th>导演</th>
              <th>评分</th>
              <th>播放量</th>
              <th>精选</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredVideos.map(video => (
              <tr key={video.id}>
                <td>
                  <button onClick={() => toggleSelect(video.id)} className="btn-icon">
                    {selectedIds.has(video.id) ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-300" />
                    )}
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => openPreviewModal(video)}
                    className="relative group w-16 h-22 rounded-lg overflow-hidden cursor-pointer block"
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                    <div className="w-full h-full bg-gray-200 items-center justify-center hidden">
                      <Film className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-white" />
                    </div>
                  </button>
                </td>
                <td>
                  <p className="font-medium text-gray-800">{video.title}</p>
                  {video.titleCn && (
                    <p className="text-gray-400 text-xs mt-0.5">{video.titleCn}</p>
                  )}
                  {video.tags && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {(Array.isArray(video.tags) ? video.tags : video.tags.split(',').map(t => t.trim())).slice(0, 3).map((tag, i) => (
                        <span key={i} className="tag tag-blue">{tag}</span>
                      ))}
                      {(Array.isArray(video.tags) ? video.tags : video.tags.split(',')).length > 3 && (
                        <span className="tag tag-blue">+{(Array.isArray(video.tags) ? video.tags : video.tags.split(',')).length - 3}</span>
                      )}
                    </div>
                  )}
                </td>
                <td>
                  <span className="tag tag-purple">{getCategoryName(video.category)}</span>
                </td>
                <td className="text-gray-600">{video.year || '-'}</td>
                <td className="text-gray-600">{video.director || '-'}</td>
                <td>
                  <div className="flex items-center gap-1.5">
                    <StarRating rating={video.rating} />
                    {video.rating > 0 && <span className="text-xs text-gray-500">{video.rating}</span>}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Eye className="w-4 h-4 text-gray-400" />
                    {video.views?.toLocaleString() || 0}
                  </div>
                </td>
                <td>
                  {video.isFeatured && (
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  )}
                </td>
                <td>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditModal(video)}
                      className="btn-icon text-blue-600 hover:bg-blue-50"
                      title="编辑"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="btn-icon text-red-600 hover:bg-red-50"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredVideos.length === 0 && (
          <div className="empty-state">
            <Film className="empty-state-icon" />
            <p className="text-gray-500">
              {searchQuery || filterCategory ? '没有找到匹配的视频' : '暂无视频'}
            </p>
            {!searchQuery && !filterCategory && (
              <button onClick={() => setShowModal(true)} className="mt-4 btn-primary text-sm">
                <Plus className="w-4 h-4" />
                添加第一个视频
              </button>
            )}
          </div>
        )}
      </div>

      {/* 添加/编辑模态框 */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-content max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {editingVideo ? '编辑视频' : '添加视频'}
              </h2>
              <button onClick={closeModal} className="btn-icon text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* 基本信息 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">标题（维语）*</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">标题（中文）</label>
                  <input
                    type="text"
                    value={formData.titleCn}
                    onChange={(e) => setFormData({ ...formData, titleCn: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* 描述 */}
              <div>
                <label className="form-label">描述（维语）</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="form-input resize-none"
                />
              </div>
              <div>
                <label className="form-label">描述（中文）</label>
                <textarea
                  value={formData.descriptionCn}
                  onChange={(e) => setFormData({ ...formData, descriptionCn: e.target.value })}
                  rows={3}
                  className="form-input resize-none"
                />
              </div>

              {/* 分类、时长、年份 */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="form-label">分类</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-select"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.nameUy} ({cat.nameCn})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">时长</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="00:00"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">年份</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2024"
                    min="1900"
                    max="2099"
                    className="form-input"
                  />
                </div>
              </div>

              {/* 导演、标签、评分 */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="form-label">导演</label>
                  <input
                    type="text"
                    value={formData.director}
                    onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                    placeholder="导演姓名"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      标签（逗号分隔）
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="喜剧, 爱情, 动作"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">评分 (0-5)</label>
                  <input
                    type="number"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Math.min(5, Math.max(0, parseFloat(e.target.value) || 0)) })}
                    min="0"
                    max="5"
                    step="0.1"
                    className="form-input"
                  />
                </div>
              </div>

              {/* 精选 */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  设为精选视频
                </label>
              </div>

              {/* 文件上传 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">缩略图</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnailFile(e.target.files[0])}
                    className="form-input text-sm"
                  />
                  {editingVideo?.thumbnail && !thumbnailFile && (
                    <img src={editingVideo.thumbnail} alt="" className="mt-2 w-full h-24 object-cover rounded-lg" />
                  )}
                </div>
                <div>
                  <label className="form-label">视频文件</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                    className="form-input text-sm"
                  />
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={closeModal} className="flex-1 btn-secondary justify-center">
                  取消
                </button>
                <button type="submit" className="flex-1 btn-primary justify-center">
                  {editingVideo ? '保存修改' : '添加视频'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 视频预览模态框 */}
      {showPreview && previewVideo && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowPreview(false)}>
          <div className="modal-content max-w-3xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">{previewVideo.title}</h2>
              <button onClick={() => setShowPreview(false)} className="btn-icon text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {/* 缩略图预览 */}
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden mb-4">
                {previewVideo.videoUrl ? (
                  <video
                    src={previewVideo.videoUrl}
                    controls
                    className="w-full h-full"
                  />
                ) : (
                  <img
                    src={previewVideo.thumbnail}
                    alt={previewVideo.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                )}
                <div className="w-full h-full bg-gray-800 items-center justify-center hidden">
                  <Film className="w-12 h-12 text-gray-600" />
                </div>
              </div>

              {/* 视频信息 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-400">分类</p>
                  <p className="text-sm font-medium text-gray-700 mt-1">{getCategoryName(previewVideo.category)}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-400">年份</p>
                  <p className="text-sm font-medium text-gray-700 mt-1">{previewVideo.year || '-'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-400">导演</p>
                  <p className="text-sm font-medium text-gray-700 mt-1">{previewVideo.director || '-'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-400">评分</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <StarRating rating={previewVideo.rating} />
                    {previewVideo.rating > 0 && <span className="text-sm text-gray-700">{previewVideo.rating}</span>}
                  </div>
                </div>
              </div>

              {previewVideo.description && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">简介</p>
                  <p className="text-sm text-gray-600">{previewVideo.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Videos
