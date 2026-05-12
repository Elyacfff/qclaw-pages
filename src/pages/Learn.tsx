
import React, { useState, useEffect } from 'react';
import { Clock, ListTodo, Edit3, ArrowLeftRight } from 'lucide-react';

// Pomodoro计时器
const PomodoroTimer: React.FC = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsRunning(false);
            setMode(mode === 'work' ? 'break' : 'work');
            setMinutes(mode === 'work' ? 5 : 25);
          } else {
            setMinutes(m => m - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(s => s - 1);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, minutes, seconds, mode]);

  const reset = () => {
    setIsRunning(false);
    setMinutes(mode === 'work' ? 25 : 5);
    setSeconds(0);
  };

  return (
    <div className="text-center">
      <h3 className="text-xl font-bold text-white mb-6">Pomodoro 计时器</h3>
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => { setMode('work'); setMinutes(25); setSeconds(0); setIsRunning(false); }}
          className={`px-4 py-2 rounded-xl ${mode === 'work' ? 'bg-cyan-500/20 text-cyan-400' : 'glass-card text-gray-300'}`}
        >
          工作
        </button>
        <button
          onClick={() => { setMode('break'); setMinutes(5); setSeconds(0); setIsRunning(false); }}
          className={`px-4 py-2 rounded-xl ${mode === 'break' ? 'bg-green-500/20 text-green-400' : 'glass-card text-gray-300'}`}
        >
          休息
        </button>
      </div>
      <div className="text-7xl font-bold gradient-text mb-8">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="glow-button px-8 py-4 rounded-xl text-white font-bold"
        >
          {isRunning ? '暂停' : '开始'}
        </button>
        <button
          onClick={reset}
          className="glass-card px-8 py-4 rounded-xl text-white font-bold"
        >
          重置
        </button>
      </div>
    </div>
  );
};

// 待办事项
const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<{ id: number; text: string; completed: boolean }[]>([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
      setInput('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-6 text-center">待办事项</h3>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="添加新任务..."
          className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
        />
        <button
          onClick={addTodo}
          className="glow-button px-6 py-3 rounded-xl text-white font-bold"
        >
          添加
        </button>
      </div>
      <div className="space-y-3">
        {todos.map(todo => (
          <div key={todo.id} className="glass-card p-4 rounded-xl flex items-center gap-4">
            <button
              onClick={() => toggleTodo(todo.id)}
              className={`w-6 h-6 rounded-full border-2 ${todo.completed ? 'bg-green-500 border-green-500' : 'border-gray-400'}`}
            />
            <span className={`flex-1 ${todo.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-400 hover:text-red-300"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// 主学习助手页面
const Learn: React.FC = () => {
  const tools = [
    { id: 'pomodoro', name: 'Pomodoro', icon: Clock, component: PomodoroTimer, color: 'from-red-500 to-pink-600' },
    { id: 'todo', name: '待办事项', icon: ListTodo, component: TodoList, color: 'from-cyan-500 to-blue-600' },
    { id: 'notes', name: '笔记', icon: Edit3, component: () => <div className="text-center text-gray-400">开发中...</div>, color: 'from-yellow-500 to-orange-600' },
    { id: 'more', name: '更多...', icon: Clock, component: () => <div className="text-center text-gray-400">更多工具开发中...</div>, color: 'from-gray-500 to-gray-600' },
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
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">学习助手</h1>
          <p className="text-gray-400 text-lg">5+ 学习工具，高效学习</p>
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

export default Learn;
