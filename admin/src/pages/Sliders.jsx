import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, X, ChevronUp, ChevronDown, Image, Eye } from 'lucide-react'

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
        const response = await fetch(`/api/sliders/${editingSlider.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSlider)
        })
        const updated = await response.json()
        setSliders(sliders.map(s => s.id === editingSlider.id ? updated : s))
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
      } catch (err) {}
      setSliders(sliders.filter(s => s.id !== id))
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

  const moveSlider = (index, direction) => {
    const newSliders = [...sliders]
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= newSliders.length) return
    ;[newSliders[index], newSliders[targetIndex]] = [newSliders[targetIndex], newSliders[index]]
    setSliders(newSliders)
  }

  const getVideoTitle = (videoId) => {
    const video = videos.find(v => v.id === videoId)
    return video?.titleCn || video?.title || '未关联'
  }

  return (
    <div className="p-8 animate-fade-in">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">轮播图管理</h1>
          <p className="text-gray-500 text-sm mt-1">共 {sliders.length} 个轮播图，拖拽调整显示顺序</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="w-5 h-5" />
          添加轮播图
        </button>
      </div>

      {/* 轮播图列表 */}
      {sliders.length > 0 ? (
        <div className="space-y-4">
          {sliders.map((slider, index) => (
            <div key={slider.id} className="content-card group">
              <div className="flex items-center gap-6 p-4">
                {/* 排序按钮 */}
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button
                    onClick={() => moveSlider(index, -1)}
                    disabled={index === 0}
                    className="btn-icon text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="上移"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-gray-400 text-center font-medium">{index + 1}</span>
                  <button
                    onClick={() => moveSlider(index, 1)}
                    disabled={index === sliders.length - 1}
                    className="btn-icon text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="下移"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {/* 图片预览 */}
                <div className="w-48 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  {slider.image ? (
                    <img
                      src={slider.image}
                      alt={slider.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                  <div className="w-full h-full bg-gray-200 items-center justify-center hidden">
                    <Image className="w-8 h-8 text-gray-400" />
                  </div>
                </div>

                {/* 信息 */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-800">{slider.title}</h3>
                  {slider.titleCn && (
                    <p className="text-sm text-gray-500 mt-0.5">{slider.titleCn}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      关联视频：{getVideoTitle(slider.videoId)}
                    </span>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEditModal(slider)}
                    className="btn-secondary text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(slider.id)}
                    className="btn-icon text-red-600 hover:bg-red-50"
                    title="删除"
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
            <Image className="empty-state-icon" />
            <p className="text-gray-500">暂无轮播图</p>
            <button onClick={() => setShowModal(true)} className="mt-4 btn-primary text-sm">
              <Plus className="w-4 h-4" />
              添加第一个轮播图
            </button>
          </div>
        </div>
      )}

      {/* 添加/编辑模态框 */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-content max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {editingSlider ? '编辑轮播图' : '添加轮播图'}
              </h2>
              <button onClick={closeModal} className="btn-icon text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* 图片预览 */}
              {formData.image && (
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <img
                    src={formData.image}
                    alt="预览"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                </div>
              )}

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

              <div>
                <label className="form-label">图片 URL *</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">关联视频</label>
                <select
                  value={formData.videoId}
                  onChange={(e) => setFormData({ ...formData, videoId: e.target.value })}
                  className="form-select"
                >
                  <option value="">选择视频（可选）...</option>
                  {videos.map(vid => (
                    <option key={vid.id} value={vid.id}>
                      {vid.titleCn ? `${vid.titleCn} - ` : ''}{vid.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={closeModal} className="flex-1 btn-secondary justify-center">
                  取消
                </button>
                <button type="submit" className="flex-1 btn-primary justify-center">
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
