import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Star, Eye } from 'lucide-react'

function Videos() {
  const [videos, setVideos] = useState([])
  const [categories, setCategories] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingVideo, setEditingVideo] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    titleCn: '',
    description: '',
    descriptionCn: '',
    category: 'kino',
    isFeatured: false,
    duration: '00:00'
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = new FormData()
    Object.entries(formData).forEach(([key, value]) => form.append(key, value))
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
    if (confirm('确定要删除这个视频吗？')) {
      try {
        await fetch(`/api/videos/${id}`, { method: 'DELETE' })
        setVideos(videos.filter(v => v.id !== id))
      } catch (err) {
        setVideos(videos.filter(v => v.id !== id))
      }
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
      duration: video.duration
    })
    setShowModal(true)
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
      duration: '00:00'
    })
    setThumbnailFile(null)
    setVideoFile(null)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">视频管理</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          添加视频
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">预览</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">标题</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">分类</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">播放量</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">精选</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {videos.map(video => (
              <tr key={video.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-20 h-28 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium">{video.title}</p>
                  {video.titleCn && (
                    <p className="text-gray-500 text-sm">{video.titleCn}</p>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {categories.find(c => c.name === video.category)?.nameUy || video.category}
                </td>
                <td className="px-6 py-4 flex items-center gap-1 text-gray-600">
                  <Eye className="w-4 h-4" />
                  {video.views?.toLocaleString() || 0}
                </td>
                <td className="px-6 py-4">
                  {video.isFeatured && (
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(video)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingVideo ? '编辑视频' : '添加视频'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标题（维语）</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标题（中文）</label>
                <input
                  type="text"
                  value={formData.titleCn}
                  onChange={(e) => setFormData({ ...formData, titleCn: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述（维语）</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述（中文）</label>
                <textarea
                  value={formData.descriptionCn}
                  onChange={(e) => setFormData({ ...formData, descriptionCn: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.nameUy}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">时长</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="00:00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">设为精选</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">缩略图</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files[0])}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">视频文件</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files[0])}
                  className="w-full"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingVideo ? '保存修改' : '添加视频'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Videos
