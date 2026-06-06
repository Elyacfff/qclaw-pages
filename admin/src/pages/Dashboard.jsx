import { useEffect, useState } from 'react'
import { Video, Eye, TrendingUp, FolderOpen } from 'lucide-react'

function Dashboard() {
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalViews: 0,
    totalCategories: 0,
    featuredVideos: 0
  })

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(setStats)
      .catch(() => {
        setStats({
          totalVideos: 4,
          totalViews: 45600,
          totalCategories: 5,
          featuredVideos: 2
        })
      })
  }, [])

  const statCards = [
    { label: '总视频数', value: stats.totalVideos, icon: Video, color: 'bg-blue-500' },
    { label: '总播放量', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'bg-green-500' },
    { label: '分类数', value: stats.totalCategories, icon: FolderOpen, color: 'bg-purple-500' },
    { label: '精选视频', value: stats.featuredVideos, icon: TrendingUp, color: 'bg-orange-500' },
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">仪表盘</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{card.label}</p>
                <p className="text-3xl font-bold mt-2">{card.value}</p>
              </div>
              <div className={`${card.color} p-4 rounded-xl`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold mb-4">快速开始</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition cursor-pointer">
            <Video className="w-10 h-10 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600">上传新视频</p>
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition cursor-pointer">
            <FolderOpen className="w-10 h-10 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600">添加分类</p>
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition cursor-pointer">
            <TrendingUp className="w-10 h-10 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600">设置轮播图</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
