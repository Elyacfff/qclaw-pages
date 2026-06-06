import { useState, useEffect } from 'react'
import { Plus, Check, Trash2, Edit2, X, Calendar, Clock, Flag } from 'lucide-react'

function App() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', dueDate: '' })
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks')
      const data = await res.json()
      setTasks(data)
    } catch (err) {
      console.error('Failed to fetch tasks:', err)
      setTasks([
        { id: 1, title: '欢迎使用任务管理器', description: '添加你的第一个任务吧！', priority: 'high', completed: false, dueDate: new Date().toISOString().split('T')[0], createdAt: new Date().toISOString() }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newTask.title.trim()) return

    try {
      if (editingId) {
        const res = await fetch(`/api/tasks/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTask)
        })
        const updatedTask = await res.json()
        setTasks(tasks.map(t => t.id === editingId ? updatedTask : t))
        setEditingId(null)
      } else {
        const res = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTask)
        })
        const createdTask = await res.json()
        setTasks([createdTask, ...tasks])
      }
      setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' })
    } catch (err) {
      console.error('Failed to save task:', err)
      const mockTask = {
        id: Date.now(),
        ...newTask,
        completed: false,
        createdAt: new Date().toISOString()
      }
      setTasks([mockTask, ...tasks])
      setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' })
    }
  }

  const toggleComplete = async (task) => {
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, completed: !task.completed })
      })
      const updatedTask = await res.json()
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t))
    } catch (err) {
      console.error('Failed to update task:', err)
      setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t))
    }
  }

  const deleteTask = async (id) => {
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
      setTasks(tasks.filter(t => t.id !== id))
    } catch (err) {
      console.error('Failed to delete task:', err)
      setTasks(tasks.filter(t => t.id !== id))
    }
  }

  const startEdit = (task) => {
    setEditingId(task.id)
    setNewTask({ title: task.title, description: task.description, priority: task.priority, dueDate: task.dueDate || '' })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' })
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">📋 任务管理器</h1>
          <p className="text-slate-400">高效管理你的每一天</p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 mb-6 shadow-xl border border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="任务标题..."
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <textarea
                placeholder="任务描述（可选）..."
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                rows={2}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
            <div className="flex gap-4 flex-wrap">
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">低优先级</option>
                <option value="medium">中优先级</option>
                <option value="high">高优先级</option>
              </select>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                {editingId ? '更新任务' : '添加任务'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
                >
                  <X size={20} />
                  取消
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-lg">还没有任务，添加一个开始吧！</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`bg-slate-800 rounded-xl p-5 shadow-lg border border-slate-700 transition-all hover:shadow-xl ${task.completed ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleComplete(task)}
                    className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      task.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-slate-500 hover:border-blue-500'
                    }`}
                  >
                    {task.completed && <Check size={14} className="text-white" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-lg font-semibold text-white ${task.completed ? 'line-through' : ''}`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-slate-400 mt-1">{task.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                        <Flag size={12} />
                        {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}优先级
                      </span>
                      {task.dueDate && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300 border border-slate-600">
                          <Calendar size={12} />
                          {task.dueDate}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(task)}
                      className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default App
