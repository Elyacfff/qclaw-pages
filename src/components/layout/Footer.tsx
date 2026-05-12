
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="glass-card border-0 border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <span className="text-xl font-bold">✨</span>
              </div>
              <span className="text-xl font-bold gradient-text">超级平台</span>
            </div>
            <p className="text-gray-400 mb-4">
              50+ 模式，200+ 功能，完美适配手机和电脑
            </p>
            <p className="text-gray-500 text-sm">
              一个功能强大、设计精美的综合性平台
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-cyan-400 transition-colors">首页</a></li>
              <li><a href="/tools" className="text-gray-400 hover:text-cyan-400 transition-colors">工具中心</a></li>
              <li><a href="/games" className="text-gray-400 hover:text-cyan-400 transition-colors">游戏娱乐</a></li>
              <li><a href="/learn" className="text-gray-400 hover:text-cyan-400 transition-colors">学习助手</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">功能分类</h3>
            <ul className="space-y-2">
              <li><a href="/calculator" className="text-gray-400 hover:text-cyan-400 transition-colors">计算器专区</a></li>
              <li><a href="/creative" className="text-gray-400 hover:text-cyan-400 transition-colors">创意工坊</a></li>
              <li><a href="/charts" className="text-gray-400 hover:text-cyan-400 transition-colors">数据可视化</a></li>
              <li><a href="/settings" className="text-gray-400 hover:text-cyan-400 transition-colors">设置</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>© 2024 超级平台. 精心打造，完美呈现</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
