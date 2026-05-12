
import React, { useState } from 'react';
import { Moon, Sun, Globe, Info, Github, Heart } from 'lucide-react';

const Settings: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');

  return (
    <div className="pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">设置</h1>
          <p className="text-gray-400 text-lg">自定义你的体验</p>
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              {theme === 'dark' ? <Moon /> : <Sun />}
              主题
            </h3>
            <div className="flex gap-4">
              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 p-4 rounded-xl transition-all ${theme === 'dark' ? 'bg-cyan-500/20 border border-cyan-500/30' : 'bg-white/5'}`}
              >
                <div className="text-white font-medium">深色</div>
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`flex-1 p-4 rounded-xl transition-all ${theme === 'light' ? 'bg-cyan-500/20 border border-cyan-500/30' : 'bg-white/5'}`}
              >
                <div className="text-white font-medium">浅色</div>
              </button>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Globe />
              语言
            </h3>
            <div className="flex gap-4">
              <button
                onClick={() => setLanguage('zh')}
                className={`flex-1 p-4 rounded-xl transition-all ${language === 'zh' ? 'bg-cyan-500/20 border border-cyan-500/30' : 'bg-white/5'}`}
              >
                <div className="text-white font-medium">中文</div>
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`flex-1 p-4 rounded-xl transition-all ${language === 'en' ? 'bg-cyan-500/20 border border-cyan-500/30' : 'bg-white/5'}`}
              >
                <div className="text-white font-medium">English</div>
              </button>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Info />
              关于
            </h3>
            <div className="space-y-4 text-gray-400">
              <p>✨ 超级平台 - 50+ 模式，200+ 功能</p>
              <p>版本: 1.0.0</p>
              <div className="flex gap-4 pt-4">
                <a href="#" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2">
                  <Github className="w-5 h-5" /> GitHub
                </a>
              </div>
            </div>
          </div>

          <div className="text-center py-8 fade-in-up" style={{ animationDelay: '0.4s' }}>
            <p className="text-gray-400 flex items-center justify-center gap-2">
              用 <Heart className="w-5 h-5 text-red-400" /> 制作
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
