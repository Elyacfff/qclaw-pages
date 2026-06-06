import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, FolderKanban, Video, X } from 'lucide-react'

function Categories() {
  const [categories, setCategories] = useState([])
  const [videos, setVideos] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    nameUy: '',
    nameCn: ''
  })

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/videos').then(r => r.json())
    ]).then(([cats, vids]) => {
      setCategories(cats)
      setVideos(vids)
    }).catch(() => {})
  }, [])

  const getVideoCount = (catName) => {
    return videos.filter(v => v.category === catName).length
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCategory) {
        const response = await fetch(`/api/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        const updated = await response.json()
        setCategories(categories.map(c => c.id === editingCategory.id ? updated : c))
      } else {
        const response = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        const newCategory = await response.json()
        setCategories([...categories, newCategory])
      }
      closeModal()
    } catch (err) {
      console.error('Error saving category:', err)
    }
  }

  const handleDelete = async (id) => {
    const cat = categories.find(c => c.id === id)
    const count = getVideoCount(cat?.name)
    if (count > 0) {
      if (!confirm(`该分类下有 ${count} 个视频，确定要删除吗？`)) return
    } else {
      if (!confirm('确定要删除这个分类吗？')) return
    }

    try {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    } catch (err) {}
    setCategories(categories.filter(c => c.id !== id))
  }

  const openEditModal = (category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      nameUy: category.nameUy,
      nameCn: category.nameCn
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingCategory(null)
    setFormData({
      name: '',
      nameUy: '',
      nameCn: ''
    })
  }

  const cardColors = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-green-500 to-green-600',
    'from-orange-500 to-orange-600',
    'from-pink-500 to-pink-600',
    'from-cyan-500 to-cyan-600',
    'from-yellow-500 to-yellow-600',
    'from-red-500 to-red-600',
  ]

  return (
    <div className="p-8 animate-fade-in">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">分类管理</h1>
          <p className="text-gray-500 text-sm mt-1">共 {categories.length} 个分类</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="w-5 h-5" />
          添加分类
        </button>
      </div>

      {/* 分类卡片网格 */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const videoCount = getVideoCount(category.name)
            return (
              <div key={category.id} className="stat-card group relative overflow-hidden">
                {/* 顶部渐变条 */}
                <div className={`h-1.5 bg-gradient-to-r ${cardColors[index % cardColors.length]}`}></div>

                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cardColors[index % cardColors.length]} flex items-center justify-center shadow-lg`}>
                      <FolderKanban className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(category)}
                        className="btn-icon text-blue-600 hover:bg-blue-50"
                        title="编辑"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="btn-icon text-red-600 hover:bg-red-50"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 mb-1">{category.nameUy}</h3>
                  <p className="text-sm text-gray-500 mb-4">{category.nameCn}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Video className="w-4 h-4" />
                      <span className="text-sm">{videoCount} 个视频</span>
                    </div>
                    <span className="tag tag-blue font-mono text-xs">{category.name}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="content-card">
          <div className="empty-state">
            <FolderKanban className="empty-state-icon" />
            <p className="text-gray-500">暂无分类</p>
            <button onClick={() => setShowModal(true)} className="mt-4 btn-primary text-sm">
              <Plus className="w-4 h-4" />
              添加第一个分类
            </button>
          </div>
        </div>
      )}

      {/* 添加/编辑模态框 */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-content max-w-md">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {editingCategory ? '编辑分类' : '添加分类'}
              </h2>
              <button onClick={closeModal} className="btn-icon text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="form-label">标识（英文）*</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例如：kino"
                  disabled={!!editingCategory}
                  className={`form-input ${editingCategory ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
                {editingCategory && (
                  <p className="text-xs text-gray-400 mt-1">标识创建后不可修改</p>
                )}
              </div>
              <div>
                <label className="form-label">维语名称 *</label>
                <input
                  type="text"
                  required
                  value={formData.nameUy}
                  onChange={(e) => setFormData({ ...formData, nameUy: e.target.value })}
                  placeholder="例如：كىنو"
                  className="form-input"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="form-label">中文名称 *</label>
                <input
                  type="text"
                  required
                  value={formData.nameCn}
                  onChange={(e) => setFormData({ ...formData, nameCn: e.target.value })}
                  placeholder="例如：电影"
                  className="form-input"
                />
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={closeModal} className="flex-1 btn-secondary justify-center">
                  取消
                </button>
                <button type="submit" className="flex-1 btn-primary justify-center">
                  {editingCategory ? '保存修改' : '添加分类'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Categories
