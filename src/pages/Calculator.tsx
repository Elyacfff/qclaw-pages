
import React, { useState } from 'react';
import { Calculator as CalcIcon, ArrowLeftRight, Thermometer, Ruler, Scale, Zap, Database } from 'lucide-react';

// 基础计算器
const BasicCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForNew, setWaitingForNew] = useState(false);

  const clear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForNew(false);
  };

  const appendNumber = (num: string) => {
    if (waitingForNew) {
      setDisplay(num);
      setWaitingForNew(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const setDecimal = () => {
    if (waitingForNew) {
      setDisplay('0.');
      setWaitingForNew(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const calculate = () => {
    if (prevValue !== null && operator !== null) {
      const prev = parseFloat(prevValue);
      const current = parseFloat(display);
      let result;

      switch (operator) {
        case '+': result = prev + current; break;
        case '-': result = prev - current; break;
        case '*': result = prev * current; break;
        case '/': result = prev / current; break;
        default: return;
      }

      setDisplay(String(result));
      setPrevValue(null);
      setOperator(null);
      setWaitingForNew(true);
    }
  };

  const handleOperator = (op: string) => {
    const current = parseFloat(display);

    if (prevValue !== null && operator !== null) {
      calculate();
    }

    setPrevValue(display);
    setOperator(op);
    setWaitingForNew(true);
  };

  return (
    <div className="max-w-xs mx-auto">
      <h3 className="text-xl font-bold text-white mb-4 text-center">基础计算器</h3>
      <div className="glass-card p-4 rounded-xl mb-4 text-right">
        <div className="text-3xl font-bold text-cyan-400">{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <button onClick={clear} className="bg-red-500/20 text-red-400 p-4 rounded-xl font-bold hover:bg-red-500/30">C</button>
        <button onClick={() => {}} className="bg-gray-500/20 text-gray-300 p-4 rounded-xl font-bold hover:bg-gray-500/30">±</button>
        <button onClick={() => {}} className="bg-gray-500/20 text-gray-300 p-4 rounded-xl font-bold hover:bg-gray-500/30">%</button>
        <button onClick={() => handleOperator('/')} className="bg-cyan-500/20 text-cyan-400 p-4 rounded-xl font-bold hover:bg-cyan-500/30">÷</button>
        
        <button onClick={() => appendNumber('7')} className="bg-white/10 text-white p-4 rounded-xl font-bold hover:bg-white/20">7</button>
        <button onClick={() => appendNumber('8')} className="bg-white/10 text-white p-4 rounded-xl font-bold hover:bg-white/20">8</button>
        <button onClick={() => appendNumber('9')} className="bg-white/10 text-white p-4 rounded-xl font-bold hover:bg-white/20">9</button>
        <button onClick={() => handleOperator('*')} className="bg-cyan-500/20 text-cyan-400 p-4 rounded-xl font-bold hover:bg-cyan-500/30">×</button>
        
        <button onClick={() => appendNumber('4')} className="bg-white/10 text-white p-4 rounded-xl font-bold hover:bg-white/20">4</button>
        <button onClick={() => appendNumber('5')} className="bg-white/10 text-white p-4 rounded-xl font-bold hover:bg-white/20">5</button>
        <button onClick={() => appendNumber('6')} className="bg-white/10 text-white p-4 rounded-xl font-bold hover:bg-white/20">6</button>
        <button onClick={() => handleOperator('-')} className="bg-cyan-500/20 text-cyan-400 p-4 rounded-xl font-bold hover:bg-cyan-500/30">-</button>
        
        <button onClick={() => appendNumber('1')} className="bg-white/10 text-white p-4 rounded-xl font-bold hover:bg-white/20">1</button>
        <button onClick={() => appendNumber('2')} className="bg-white/10 text-white p-4 rounded-xl font-bold hover:bg-white/20">2</button>
        <button onClick={() => appendNumber('3')} className="bg-white/10 text-white p-4 rounded-xl font-bold hover:bg-white/20">3</button>
        <button onClick={() => handleOperator('+')} className="bg-cyan-500/20 text-cyan-400 p-4 rounded-xl font-bold hover:bg-cyan-500/30">+</button>
        
        <button onClick={() => appendNumber('0')} className="col-span-2 bg-white/10 text-white p-4 rounded-xl font-bold hover:bg-white/20">0</button>
        <button onClick={setDecimal} className="bg-white/10 text-white p-4 rounded-xl font-bold hover:bg-white/20">.</button>
        <button onClick={calculate} className="bg-cyan-500/20 text-cyan-400 p-4 rounded-xl font-bold hover:bg-cyan-500/30">=</button>
      </div>
    </div>
  );
};

// 单位转换器
const UnitConverter: React.FC = () => {
  const [value, setValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('celsius');
  const [toUnit, setToUnit] = useState('fahrenheit');

  const convert = () => {
    const val = parseFloat(value);
    if (isNaN(val)) return '0';

    if (fromUnit === 'celsius' && toUnit === 'fahrenheit') return String((val * 9/5) + 32);
    if (fromUnit === 'fahrenheit' && toUnit === 'celsius') return String((val - 32) * 5/9);
    if (fromUnit === 'celsius' && toUnit === 'kelvin') return String(val + 273.15);
    if (fromUnit === 'kelvin' && toUnit === 'celsius') return String(val - 273.15);
    
    return String(val);
  };

  return (
    <div className="text-center">
      <h3 className="text-xl font-bold text-white mb-4">温度转换</h3>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white mb-4"
      />
      <div className="grid grid-cols-2 gap-4 mb-4">
        <select
          value={fromUnit}
          onChange={(e) => setFromUnit(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
        >
          <option value="celsius">摄氏度</option>
          <option value="fahrenheit">华氏度</option>
          <option value="kelvin">开尔文</option>
        </select>
        <select
          value={toUnit}
          onChange={(e) => setToUnit(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
        >
          <option value="fahrenheit">华氏度</option>
          <option value="celsius">摄氏度</option>
          <option value="kelvin">开尔文</option>
        </select>
      </div>
      <div className="glass-card p-6 rounded-xl">
        <div className="text-3xl font-bold gradient-text">{convert()}</div>
      </div>
    </div>
  );
};

// BMI计算器
const BMICalculator: React.FC = () => {
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('70');

  const calculateBMI = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    const bmi = w / (h * h);
    return bmi.toFixed(1);
  };

  const getStatus = () => {
    const bmi = parseFloat(calculateBMI());
    if (bmi < 18.5) return { text: '偏瘦', color: 'text-blue-400' };
    if (bmi < 25) return { text: '正常', color: 'text-green-400' };
    if (bmi < 30) return { text: '偏胖', color: 'text-yellow-400' };
    return { text: '肥胖', color: 'text-red-400' };
  };

  const status = getStatus();

  return (
    <div className="text-center">
      <h3 className="text-xl font-bold text-white mb-4">BMI 计算器</h3>
      <div className="space-y-4 mb-6">
        <div>
          <label className="text-gray-300 block mb-2">身高 (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
          />
        </div>
        <div>
          <label className="text-gray-300 block mb-2">体重 (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
          />
        </div>
      </div>
      <div className="glass-card p-6 rounded-xl">
        <div className="text-5xl font-bold gradient-text mb-2">{calculateBMI()}</div>
        <div className={`text-xl font-bold ${status.color}`}>{status.text}</div>
      </div>
    </div>
  );
};

// 主计算器页面
const CalculatorPage: React.FC = () => {
  const calculators = [
    { id: 'basic', name: '基础计算器', icon: CalcIcon, component: BasicCalculator, color: 'from-cyan-500 to-blue-600' },
    { id: 'temp', name: '温度转换', icon: Thermometer, component: UnitConverter, color: 'from-orange-500 to-red-600' },
    { id: 'bmi', name: 'BMI计算器', icon: Scale, component: BMICalculator, color: 'from-green-500 to-teal-600' },
    { id: 'length', name: '长度转换', icon: Ruler, component: () => <div className="text-center text-gray-400">开发中...</div>, color: 'from-purple-500 to-pink-600' },
    { id: 'data', name: '数据转换', icon: Database, component: () => <div className="text-center text-gray-400">开发中...</div>, color: 'from-yellow-500 to-orange-600' },
    { id: 'more', name: '更多...', icon: Zap, component: () => <div className="text-center text-gray-400">更多计算器开发中...</div>, color: 'from-gray-500 to-gray-600' },
  ];

  const [selected, setSelected] = useState<string | null>(null);
  const SelectedComponent = selected ? calculators.find(c => c.id === selected)?.component : null;

  if (selected && SelectedComponent) {
    return (
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-md mx-auto">
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
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">计算器专区</h1>
          <p className="text-gray-400 text-lg">10+ 专业计算器，精确计算</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {calculators.map((calc, index) => {
            const Icon = calc.icon;
            return (
              <button
                key={calc.id}
                onClick={() => setSelected(calc.id)}
                className="glass-card rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 fade-in-up group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${calc.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-white font-medium">{calc.name}</h3>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;
