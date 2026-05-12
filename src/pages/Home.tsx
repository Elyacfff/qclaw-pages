
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Wrench, 
  Gamepad2, 
  Calculator, 
  Palette, 
  GraduationCap, 
  BarChart3,
  ChevronRight,
  Zap,
  Sparkles,
  Layers
} from 'lucide-react';

const Home: React.FC = () => {
  const modes = [
    {
      id: 'tools',
      title: '工具中心',
      description: '30+ 实用工具，日常效率神器',
      icon: Wrench,
      color: 'from-cyan-500 to-blue-600',
      path: '/tools',
      count: '30+'
    },
    {
      id: 'games',
      title: '游戏娱乐',
      description: '10+ 精选小游戏，休闲放松',
      icon: Gamepad2,
      color: 'from-purple-500 to-pink-600',
      path: '/games',
      count: '10+'
    },
    {
      id: 'calculator',
      title: '计算器专区',
      description: '10+ 专业计算器，精确计算',
      icon: Calculator,
      color: 'from-green-500 to-teal-600',
      path: '/calculator',
      count: '10+'
    },
    {
      id: 'creative',
      title: '创意工坊',
      description: '5+ 设计工具，灵感迸发',
      icon: Palette,
      color: 'from-orange-500 to-red-600',
      path: '/creative',
      count: '5+'
    },
    {
      id: 'learn',
      title: '学习助手',
      description: '5+ 学习工具，高效学习',
      icon: GraduationCap,
      color: 'from-yellow-500 to-orange-600',
      path: '/learn',
      count: '5+'
    },
    {
      id: 'charts',
      title: '数据可视化',
      description: '5+ 图表类型，数据展示',
      icon: BarChart3,
      color: 'from-indigo-500 to-purple-600',
      path: '/charts',
      count: '5+'
    }
  ];

  const features = [
    {
      icon: Zap,
      title: '完美流畅',
      description: '所有功能流畅运行，无卡顿'
    },
    {
      icon: Sparkles,
      title: '精美设计',
      description: '赛博朋克风格，视觉盛宴'
    },
    {
      icon: Layers,
      title: '响应式布局',
      description: '手机电脑完美适配'
    }
  ];

  return (
    <div className="relative min-h-screen pt-24 pb-12">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center fade-in-up">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 mb-6">
            <span className="text-cyan-400 text-sm font-medium">✨ 50+ 模式 · 200+ 功能</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">欢迎来到</span>
            <br />
            <span className="text-white">超级平台</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            一个功能强大、设计精美的综合性平台。
            完美适配手机和电脑，让你的数字生活更加精彩。
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/tools" className="glow-button px-8 py-4 rounded-xl text-white font-semibold flex items-center space-x-2">
              <span>开始使用</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link to="/games" className="glass-card px-8 py-4 rounded-xl text-white font-semibold flex items-center space-x-2 hover:bg-white/10 transition-all">
              <Gamepad2 className="w-5 h-5" />
              <span>玩点游戏</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="glass-card rounded-2xl p-8 text-center transition-all duration-500 fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${modes[index % modes.length].color} flex items-center justify-center`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Modes Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-12 fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">选择模式</h2>
          <p className="text-gray-400">探索各种有趣的功能模块</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modes.map((mode, index) => {
            const Icon = mode.icon;
            return (
              <Link 
                key={mode.id}
                to={mode.path}
                className="glass-card rounded-2xl p-8 transition-all duration-500 fade-in-up group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${mode.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-br ${mode.color} text-white`}>
                    {mode.count}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{mode.title}</h3>
                <p className="text-gray-400 mb-6">{mode.description}</p>
                <div className="flex items-center text-cyan-400 group-hover:translate-x-2 transition-transform">
                  <span className="font-medium">探索更多</span>
                  <ChevronRight className="w-5 h-5 ml-2" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="glass-card rounded-3xl p-12 text-center fade-in-up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">50+</div>
              <div className="text-gray-400">模式数量</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">200+</div>
              <div className="text-gray-400">功能数量</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">100%</div>
              <div className="text-gray-400">响应式</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">✨</div>
              <div className="text-gray-400">完美体验</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
