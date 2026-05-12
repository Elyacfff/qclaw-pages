
import React, { useState } from 'react';
import { Palette, Droplets, Type, ArrowLeftRight } from 'lucide-react';

// 颜色选择器
const ColorPicker: React.FC = () => {
  const [color, setColor] = useState('#00d2ff');

  return (
    <div className="text-center">
      <h3 className="text-xl font-bold text-white mb-6">颜色选择器</h3>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="w-40 h-40 rounded-2xl cursor-pointer mb-6"
      />
      <div className="glass-card p-6 rounded-xl">
        <div className="text-2xl font-bold text-cyan-400 mb-2">{color}</div>
        <div className="text-gray-400">RGB: {parseInt(color.slice(1,3),16)}, {parseInt(color.slice(3,5),16)}, {parseInt(color.slice(5,7),16)}</div>
      </div>
    </div>
  );
};

// 渐变生成器
const GradientGenerator: React.FC = () => {
  const [color1, setColor1] = useState('#00d2ff');
  const [color2, setColor2] = useState('#3a7bd5');

  return (
    <div className="text-center">
      <h3 className="text-xl font-bold text-white mb-6">渐变生成器</h3>
      <div 
        className="h-40 rounded-2xl mb-6"
        style={{ background: `linear-gradient(135deg, ${color1}, ${color2})` }}
      />
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <input
            type="color"
            value={color1}
            onChange={(e) => setColor1(e.target.value)}
            className="w-full h-16 rounded-xl cursor-pointer"
          />
          <div className="text-gray-400 mt-2">{color1}</div>
        </div>
        <div>
          <input
            type="color"
            value={color2}
            onChange={(e) => setColor2(e.target.value)}
            className="w-full h-16 rounded-xl cursor-pointer"
          />
          <div className="text-gray-400 mt-2">{color2}</div>
        </div>
      </div>
      <div className="glass-card p-4 rounded-xl font-mono text-sm text-green-400 break-all">
        background: linear-gradient(135deg, {color1}, {color2});
      </div>
    </div>
  );
};

// 主创意工坊页面
const Creative: React.FC = () => {
  const tools = [
    { id: 'color', name: '颜色选择器', icon: Palette, component: ColorPicker, color: 'from-pink-500 to-rose-600' },
    { id: 'gradient', name: '渐变生成器', icon: Droplets, component: GradientGenerator, color: 'from-cyan-500 to-blue-600' },
    { id: 'font', name: '字体预览', icon: Type, component: () => <div className="text-center text-gray-400">开发中...</div>, color: 'from-purple-500 to-pink-600' },
    { id: 'more', name: '更多...', icon: Palette, component: () => <div className="text-center text-gray-400">更多工具开发中...</div>, color: 'from-gray-500 to-gray-600' },
  ];

  const [selected, setSelected] = useState<string | null>(null);
  const SelectedComponent = selected ? tools.find(t => t.id === selected)?.component : null;

  if (selected && SelectedComponent) {
    return (
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => setSelected(null)}
            className="flex items-center text-cyan-400 hover:text-cyan-300 mb-6 transition-colors"
          >
            <ArrowLeftRight className="w-5 h-5 mr-2 rotate-180" />
            返回列表
          </button>
          <div className="glass-card rounded-2xl p-8">
            <SelectedComponent />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">创意工坊</h1>
          <p className="text-gray-400 text-lg">5+ 设计工具，灵感迸发</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => setSelected(tool.id)}
                className="glass-card rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 fade-in-up group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-white font-medium">{tool.name}</h3>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Creative;
