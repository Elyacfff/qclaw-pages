import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'

function Sliders() {
  const [sliders, setSliders] = useState([])
  const [videos, setVideos] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingSlider, setEditingSlider] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    titleCn: '',
    image: '',
    videoId: ''
  })

  useEffect(() => {
    Promise.all([
      fetch('/api/sliders').then(r => r.json()),
      fetch('/api/videos').then(r => r.json())
    ]).then(([slids, vids]) => {
      setSliders(slids)
      setVideos(vids)
    }).catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const newSlider = {
        ...formData,
        videoId: parseInt(formData.videoId)
      }
      if (editingSlider) {
        setSliders(sliders.map(s => s.id === editingSlider.id ? { ...s, ...newSlider } : s))
      } else {
        const response = await fetch('/api/sliders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSlider)
        })
        const created = await response.json()
        setSliders([...sliders, created])
      }
      closeModal()
    } catch (err) {
      console.error('Error saving slider:', err)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('确定要删除这个轮播图吗？')) {
      try {
        await fetch(`/api/sliders/${id}`, { method: 'DELETE' })
        setSliders(sliders.filter(s => s.id !== id))
      } catch (err) {
        setSliders(sliders.filter(s => s.id !== id))
      }
    }
  }

  const openEditModal = (slider) => {
    setEditingSlider(slider)
    setFormData({
      title: slider.title,
      titleCn: slider.titleCn || '',
      image: slider.image,
      videoId: slider.videoId?.toString() || ''
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingSlider(null)
    setFormData({
      title: '',
      titleCn: '',
      image: '',
      videoId: ''
    })
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">轮播图管理</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          添加轮播图
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sliders.map(slider => (
          <div key={slider.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={slider.image}
                alt={slider.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => openEditModal(slider)}
                  className="p-2 bg-white/90 rounded-lg text-blue-600 hover:bg-white"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(slider.id)}
                  className="p-2 bg-white/90 rounded-lg text-red-600 hover:bg-white"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium">{slider.title}</h3>
              {slider.titleCn && (
                <p className="text-gray-500 text-sm">{slider.titleCn}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingSlider ? '编辑轮播图' : '添加轮播图'}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">图片 URL</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">关联视频</label>
                <select
                  value={formData.videoId}
                  onChange={(e) => setFormData({ ...formData, videoId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">选择视频...</option>
                  {videos.map(vid => (
                    <option key={vid.id} value={vid.id}>{vid.title}</option>
                  ))}
                </select>
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
                  {editingSlider ? '保存修改' : '添加轮播图'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sliders
