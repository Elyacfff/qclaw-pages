
import React from 'react';
import { BarChart3, LineChart, PieChart, ArrowLeftRight } from 'lucide-react';

// 简单图表展示组件
const ChartDemo: React.FC<{ type: string; color: string }> = ({ type, color }) => {
  const data = [
    { label: '一月', value: 65 },
    { label: '二月', value: 45 },
    { label: '三月', value: 80 },
    { label: '四月', value: 55 },
    { label: '五月', value: 70 },
  ];

  const max = Math.max(...data.map(d => d.value));

  return (
    <div className="text-center">
      <h3 className="text-xl font-bold text-white mb-6">{type}</h3>
      
      {type.includes('柱状') && (
        <div className="flex items-end justify-center gap-4 h-64">
          {data.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div 
                className="w-12 rounded-t-lg transition-all"
                style={{ 
                  height: `${(d.value / max) * 200}px`,
                  background: `linear-gradient(to top, ${color}, ${color}aa)`
                }}
              />
              <span className="text-gray-400 text-sm">{d.label}</span>
            </div>
          ))}
        </div>
      )}

      {type.includes('折线') && (
        <div className="h-64 relative">
          <svg className="w-full h-full" viewBox="0 0 300 200">
            <polyline
              points={data.map((d, i) => `${i * 60 + 30},${200 - (d.value / max) * 180}`).join(' ')}
              fill="none"
              stroke={color}
              strokeWidth="3"
            />
            {data.map((d, i) => (
              <circle
                key={i}
                cx={i * 60 + 30}
                cy={200 - (d.value / max) * 180}
                r="6"
                fill={color}
              />
            ))}
          </svg>
          <div className="flex justify-around mt-2">
            {data.map((d, i) => (
              <span key={i} className="text-gray-400 text-sm">{d.label}</span>
            ))}
          </div>
        </div>
      )}

      {type.includes('饼图') && (
        <div className="flex justify-center">
          <svg width="200" height="200" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#00d2ff" strokeWidth="30" strokeDasharray="126 376" />
            <circle cx="100" cy="100" r="80" fill="none" stroke="#3a7bd5" strokeWidth="30" strokeDasharray="188 314" strokeDashoffset="-126" />
            <circle cx="100" cy="100" r="80" fill="none" stroke="#a855f7" strokeWidth="30" strokeDasharray="100 402" strokeDashoffset="-314" />
          </svg>
        </div>
      )}

      <div className="mt-6 grid grid-cols-3 gap-4">
        {data.slice(0, 3).map((d, i) => (
          <div key={i} className="glass-card p-4 rounded-xl">
            <div className="text-2xl font-bold gradient-text">{d.value}</div>
            <div className="text-gray-400 text-sm">{d.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 主图表页面
const Charts: React.FC = () => {
  const charts = [
    { id: 'bar', name: '柱状图', icon: BarChart3, component: () => <ChartDemo type="柱状图" color="#00d2ff" />, color: 'from-cyan-500 to-blue-600' },
    { id: 'line', name: '折线图', icon: LineChart, component: () => <ChartDemo type="折线图" color="#a855f7" />, color: 'from-purple-500 to-pink-600' },
    { id: 'pie', name: '饼图', icon: PieChart, component: () => <ChartDemo type="饼图" color="#10b981" />, color: 'from-green-500 to-teal-600' },
    { id: 'more', name: '更多...', icon: BarChart3, component: () => <div className="text-center text-gray-400">更多图表开发中...</div>, color: 'from-gray-500 to-gray-600' },
  ];

  const [selected, setSelected] = React.useState<string | null>(null);
  const SelectedComponent = selected ? charts.find(c => c.id === selected)?.component : null;

  if (selected && SelectedComponent) {
    return (
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
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
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">数据可视化</h1>
          <p className="text-gray-400 text-lg">5+ 图表类型，数据展示</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {charts.map((chart, index) => {
            const Icon = chart.icon;
            return (
              <button
                key={chart.id}
                onClick={() => setSelected(chart.id)}
                className="glass-card rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 fade-in-up group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${chart.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-white font-medium">{chart.name}</h3>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Charts;
