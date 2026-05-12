
import React, { useState } from 'react';
import { 
  QrCode, 
  Hash, 
  Shuffle, 
  Type, 
  FileJson, 
  Lock, 
  Calculator, 
  Palette,
  Globe,
  Clock,
  Key,
  Binary,
  ArrowLeftRight,
  Text,
  AlignJustify,
  Trash2
} from 'lucide-react';

// 工具组件
const QRGenerator: React.FC = () => {
  const [text, setText] = useState('https://example.com');
  
  return (
    <div className="text-center">
      <h3 className="text-xl font-bold text-white mb-4">二维码生成器</h3>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="输入文本或网址"
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 mb-6"
      />
      <div className="w-48 h-48 mx-auto bg-white rounded-xl flex items-center justify-center text-gray-600 text-sm">
        <div className="text-center">
          <QrCode className="w-16 h-16 mx-auto mb-2 text-cyan-500" />
          <p>二维码预览</p>
          <p className="text-xs text-gray-400 mt-1">{text.substring(0, 20)}...</p>
        </div>
      </div>
    </div>
  );
};

const RandomGenerator: React.FC = () => {
  const [randomNum, setRandomNum] = useState(Math.floor(Math.random() * 1000));
  
  return (
    <div className="text-center">
      <h3 className="text-xl font-bold text-white mb-4">随机数生成器</h3>
      <div className="text-6xl font-bold gradient-text mb-6">{randomNum}</div>
      <button
        onClick={() => setRandomNum(Math.floor(Math.random() * 1000))}
        className="glow-button px-8 py-3 rounded-xl text-white font-semibold"
      >
        生成随机数
      </button>
    </div>
  );
};

const UUIDGenerator: React.FC = () => {
  const generateUUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
  
  const [uuid, setUuid] = useState(generateUUID());
  
  return (
    <div className="text-center">
      <h3 className="text-xl font-bold text-white mb-4">UUID 生成器</h3>
      <div className="glass-card p-4 rounded-xl mb-6 font-mono text-cyan-400 break-all">{uuid}</div>
      <button
        onClick={() => setUuid(generateUUID())}
        className="glow-button px-8 py-3 rounded-xl text-white font-semibold"
      >
        生成新 UUID
      </button>
    </div>
  );
};

const Base64Tool: React.FC = () => {
  const [input, setInput] = useState('Hello World');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  
  const result = mode === 'encode' 
    ? btoa(input) 
    : (() => { try { return atob(input); } catch { return '无效的 Base64'; } })();
  
  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-4 text-center">Base64 编码/解码</h3>
      <div className="flex space-x-2 mb-4 justify-center">
        <button
          onClick={() => setMode('encode')}
          className={`px-4 py-2 rounded-lg ${mode === 'encode' ? 'glow-button text-white' : 'glass-card text-gray-300'}`}
        >
          编码
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`px-4 py-2 rounded-lg ${mode === 'decode' ? 'glow-button text-white' : 'glass-card text-gray-300'}`}
        >
          解码
        </button>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="输入文本"
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 mb-4 h-24"
      />
      <div className="glass-card p-4 rounded-xl font-mono text-green-400 break-all">{result}</div>
    </div>
  );
};

const JSONFormatter: React.FC = () => {
  const [input, setInput] = useState('{"name":"John","age":30}');
  const [formatted, setFormatted] = useState('');
  
  const format = () => {
    try {
      setFormatted(JSON.stringify(JSON.parse(input), null, 2));
    } catch (e) {
      setFormatted('无效的 JSON');
    }
  };
  
  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-4 text-center">JSON 格式化</h3>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="输入 JSON"
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 mb-4 h-24 font-mono text-sm"
      />
      <button onClick={format} className="glow-button px-6 py-2 rounded-xl text-white font-semibold w-full mb-4">
        格式化
      </button>
      <pre className="glass-card p-4 rounded-xl font-mono text-green-400 text-sm overflow-x-auto">{formatted || '点击格式化'}</pre>
    </div>
  );
};

const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  
  const generate = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let newPass = '';
    for (let i = 0; i < length; i++) {
      newPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPass);
  };
  
  React.useEffect(() => { generate(); }, []);
  
  return (
    <div className="text-center">
      <h3 className="text-xl font-bold text-white mb-4">密码生成器</h3>
      <div className="glass-card p-4 rounded-xl mb-4 font-mono text-cyan-400 break-all">{password}</div>
      <div className="mb-4">
        <label className="text-gray-300 block mb-2">长度: {length}</label>
        <input
          type="range"
          min="8"
          max="32"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full"
        />
      </div>
      <button onClick={generate} className="glow-button px-8 py-3 rounded-xl text-white font-semibold">
        生成密码
      </button>
    </div>
  );
};

const TextReverser: React.FC = () => {
  const [text, setText] = useState('Hello World');
  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-4 text-center">文本反转</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="输入文本"
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 mb-4 h-24"
      />
      <div className="glass-card p-4 rounded-xl text-green-400">{text.split('').reverse().join('')}</div>
    </div>
  );
};

const WordCounter: React.FC = () => {
  const [text, setText] = useState('Hello World 这是一段测试文本');
  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text.split('\n').length;
  
  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-4 text-center">字数统计</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="输入文本"
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 mb-6 h-32"
      />
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-xl text-center">
          <div className="text-3xl font-bold gradient-text">{chars}</div>
          <div className="text-gray-400 text-sm">字符</div>
        </div>
        <div className="glass-card p-4 rounded-xl text-center">
          <div className="text-3xl font-bold gradient-text">{words}</div>
          <div className="text-gray-400 text-sm">单词</div>
        </div>
        <div className="glass-card p-4 rounded-xl text-center">
          <div className="text-3xl font-bold gradient-text">{lines}</div>
          <div className="text-gray-400 text-sm">行数</div>
        </div>
      </div>
    </div>
  );
};

const CaseConverter: React.FC = () => {
  const [text, setText] = useState('Hello World');
  
  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-4 text-center">大小写转换</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="输入文本"
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 mb-4 h-24"
      />
      <div className="space-y-3">
        <div className="glass-card p-3 rounded-xl">
          <span className="text-gray-400 text-sm">大写: </span>
          <span className="text-cyan-400">{text.toUpperCase()}</span>
        </div>
        <div className="glass-card p-3 rounded-xl">
          <span className="text-gray-400 text-sm">小写: </span>
          <span className="text-cyan-400">{text.toLowerCase()}</span>
        </div>
      </div>
    </div>
  );
};

const TimestampConverter: React.FC = () => {
  const [timestamp, setTimestamp] = useState(Date.now());
  const date = new Date(timestamp);
  
  return (
    <div className="text-center">
      <h3 className="text-xl font-bold text-white mb-4">时间戳转换</h3>
      <input
        type="number"
        value={timestamp}
        onChange={(e) => setTimestamp(Number(e.target.value))}
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 mb-6 text-center font-mono"
      />
      <div className="glass-card p-4 rounded-xl">
        <div className="text-gray-400 mb-2">日期时间</div>
        <div className="text-xl text-cyan-400 font-semibold">{date.toLocaleString()}</div>
      </div>
    </div>
  );
};

// 主工具页面
const Tools: React.FC = () => {
  const tools = [
    { id: 'qr', name: '二维码生成', icon: QrCode, component: QRGenerator, color: 'from-cyan-500 to-blue-600' },
    { id: 'random', name: '随机数生成', icon: Shuffle, component: RandomGenerator, color: 'from-purple-500 to-pink-600' },
    { id: 'uuid', name: 'UUID 生成', icon: Hash, component: UUIDGenerator, color: 'from-green-500 to-teal-600' },
    { id: 'base64', name: 'Base64 编解码', icon: ArrowLeftRight, component: Base64Tool, color: 'from-orange-500 to-red-600' },
    { id: 'json', name: 'JSON 格式化', icon: FileJson, component: JSONFormatter, color: 'from-yellow-500 to-orange-600' },
    { id: 'password', name: '密码生成', icon: Key, component: PasswordGenerator, color: 'from-indigo-500 to-purple-600' },
    { id: 'reverse', name: '文本反转', icon: Text, component: TextReverser, color: 'from-pink-500 to-rose-600' },
    { id: 'count', name: '字数统计', icon: AlignJustify, component: WordCounter, color: 'from-teal-500 to-cyan-600' },
    { id: 'case', name: '大小写转换', icon: Type, component: CaseConverter, color: 'from-blue-500 to-indigo-600' },
    { id: 'timestamp', name: '时间戳转换', icon: Clock, component: TimestampConverter, color: 'from-emerald-500 to-green-600' },
    // 更多工具...
    { id: 'placeholder1', name: '更多工具...', icon: Trash2, component: () => <div className="text-center text-gray-400">更多功能开发中...</div>, color: 'from-gray-500 to-gray-600' },
    { id: 'placeholder2', name: '更多工具...', icon: Trash2, component: () => <div className="text-center text-gray-400">更多功能开发中...</div>, color: 'from-gray-500 to-gray-600' },
    { id: 'placeholder3', name: '更多工具...', icon: Trash2, component: () => <div className="text-center text-gray-400">更多功能开发中...</div>, color: 'from-gray-500 to-gray-600' },
    { id: 'placeholder4', name: '更多工具...', icon: Trash2, component: () => <div className="text-center text-gray-400">更多功能开发中...</div>, color: 'from-gray-500 to-gray-600' },
    { id: 'placeholder5', name: '更多工具...', icon: Trash2, component: () => <div className="text-center text-gray-400">更多功能开发中...</div>, color: 'from-gray-500 to-gray-600' },
  ];

  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const SelectedComponent = selectedTool ? tools.find(t => t.id === selectedTool)?.component : null;

  if (selectedTool && SelectedComponent) {
    const tool = tools.find(t => t.id === selectedTool);
    return (
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setSelectedTool(null)}
            className="flex items-center text-cyan-400 hover:text-cyan-300 mb-6 transition-colors"
          >
            <ArrowLeftRight className="w-5 h-5 mr-2 rotate-180" />
            返回工具列表
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
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">工具中心</h1>
          <p className="text-gray-400 text-lg">30+ 实用工具，提升你的效率</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className="glass-card rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 fade-in-up group"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-medium text-sm">{tool.name}</h3>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Tools;
