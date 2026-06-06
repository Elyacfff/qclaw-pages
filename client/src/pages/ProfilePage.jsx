import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Heart, History, Trash2, Info, ChevronRight, Play } from 'lucide-react'
import { useAppContext } from '../App'

function ProfilePage() {
  const navigate = useNavigate()
  const { favorites, history, clearAllData } = useAppContext()
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const handleClearAll = () => {
    clearAllData()
    setShowClearConfirm(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-10 animate-fadeIn">
        <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mb-4 shadow-lg">
          <User className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">我的</h1>
        <p className="text-gray-400 text-sm mt-1">QaraKino 用户</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8 animate-slideUp">
        <button
          onClick={() => navigate('/favorites')}
          className="bg-dark2 border border-gray-800 rounded-xl p-5 hover:bg-gray-800 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-white">{favorites.length}</p>
              <p className="text-gray-400 text-sm mt-1">收藏视频</p>
            </div>
            <Heart className="w-8 h-8 text-red-500 group-hover:scale-110 transition-transform" />
          </div>
        </button>
        <button
          onClick={() => navigate('/history')}
          className="bg-dark2 border border-gray-800 rounded-xl p-5 hover:bg-gray-800 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-white">{history.length}</p>
              <p className="text-gray-400 text-sm mt-1">观看记录</p>
            </div>
            <History className="w-8 h-8 text-red-500 group-hover:scale-110 transition-transform" />
          </div>
        </button>
      </div>

      {/* Quick Links */}
      <div className="bg-dark2 border border-gray-800 rounded-xl overflow-hidden mb-8 animate-slideUp">
        <button
          onClick={() => navigate('/favorites')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-gray-400" />
            <span className="text-white">我的收藏</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
        <div className="border-t border-gray-800" />
        <button
          onClick={() => navigate('/history')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <History className="w-5 h-5 text-gray-400" />
            <span className="text-white">观看记录</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
        <div className="border-t border-gray-800" />
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Play className="w-5 h-5 text-gray-400" />
            <span className="text-white">返回首页</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* App Info */}
      <div className="bg-dark2 border border-gray-800 rounded-xl overflow-hidden mb-8 animate-slideUp">
        <div className="flex items-center gap-3 p-4 border-b border-gray-800">
          <Info className="w-5 h-5 text-gray-400" />
          <span className="text-white font-medium">关于</span>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">应用名称</span>
            <span className="text-white">QaraKino - قاراكىنو</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">版本</span>
            <span className="text-white">1.0.0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">描述</span>
            <span className="text-white text-right">维吾尔语视频平台</span>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-dark2 border border-gray-800 rounded-xl overflow-hidden animate-slideUp">
        <div className="flex items-center gap-3 p-4 border-b border-gray-800">
          <Trash2 className="w-5 h-5 text-gray-400" />
          <span className="text-white font-medium">设置</span>
        </div>
        {showClearConfirm ? (
          <div className="p-4 animate-fadeIn">
            <p className="text-gray-300 text-sm mb-3">确定要清除所有数据吗？此操作不可撤销。</p>
            <div className="flex gap-3">
              <button
                onClick={handleClearAll}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                确定清除
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="bg-dark3 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="w-full p-4 text-left hover:bg-gray-800/50 transition-colors"
          >
            <p className="text-gray-300 text-sm">清除所有数据</p>
            <p className="text-gray-600 text-xs mt-1">清除收藏和观看记录</p>
          </button>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
