
import React, { useState, useEffect, useRef } from 'react';
import { 
  Gamepad2, 
  Trophy, 
  RefreshCw,
  ArrowLeftRight
} from 'lucide-react';

// 贪吃蛇游戏
const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const directionRef = useRef('right');
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gridSize = 20;
    const tileCount = canvas.width / gridSize;

    let snake = [{ x: 10, y: 10 }];
    let food = { x: 15, y: 15 };
    let dx = 1;
    let dy = 0;

    const changeDirection = (newDx: number, newDy: number) => {
      if (dx !== -newDx || dy !== -newDy) {
        dx = newDx;
        dy = newDy;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': changeDirection(0, -1); break;
        case 'ArrowDown': changeDirection(0, 1); break;
        case 'ArrowLeft': changeDirection(-1, 0); break;
        case 'ArrowRight': changeDirection(1, 0); break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    const gameLoop = () => {
      const head = { x: snake[0].x + dx, y: snake[0].y + dy };

      if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        setGameOver(true);
        return;
      }

      for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
          setGameOver(true);
          return;
        }
      }

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        food = {
          x: Math.floor(Math.random() * tileCount),
          y: Math.floor(Math.random() * tileCount)
        };
      } else {
        snake.pop();
      }

      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00d2ff';
      for (let segment of snake) {
        ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
      }

      ctx.fillStyle = '#ff6b6b';
      ctx.fillRect(food.x * gridSize + 1, food.y * gridSize + 1, gridSize - 2, gridSize - 2);
    };

    if (!gameOver) {
      gameLoopRef.current = setInterval(gameLoop, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameOver]);

  const restart = () => {
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="text-center">
      <h3 className="text-xl font-bold text-white mb-4">贪吃蛇</h3>
      <div className="text-cyan-400 text-2xl font-bold mb-4">分数: {score}</div>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="rounded-xl border border-white/20 mx-auto"
        style={{ maxWidth: '100%' }}
      />
      {gameOver && (
        <div className="mt-6">
          <div className="text-red-400 text-xl font-bold mb-4">游戏结束!</div>
          <button onClick={restart} className="glow-button px-6 py-3 rounded-xl text-white font-semibold">
            重新开始
          </button>
        </div>
      )}
      <div className="mt-4 text-gray-400 text-sm">使用方向键控制</div>
    </div>
  );
};

// 2048 游戏
const Game2048: React.FC = () => {
  const [board, setBoard] = useState<number[][]>([]);
  const [score, setScore] = useState(0);

  const initBoard = () => {
    const newBoard = Array(4).fill(null).map(() => Array(4).fill(0));
    addRandom(newBoard);
    addRandom(newBoard);
    setBoard(newBoard);
    setScore(0);
  };

  const addRandom = (board: number[][]) => {
    const empty = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) empty.push({ i, j });
      }
    }
    if (empty.length > 0) {
      const { i, j } = empty[Math.floor(Math.random() * empty.length)];
      board[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const slideAndMerge = (row: number[]) => {
    let arr = row.filter(val => val !== 0);
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        setScore(s => s + arr[i]);
        arr.splice(i + 1, 1);
      }
    }
    while (arr.length < 4) arr.push(0);
    return arr;
  };

  const moveLeft = () => {
    const newBoard = board.map(row => slideAndMerge(row));
    if (JSON.stringify(newBoard) !== JSON.stringify(board)) {
      addRandom(newBoard);
      setBoard(newBoard);
    }
  };

  const moveRight = () => {
    const newBoard = board.map(row => slideAndMerge(row.reverse()).reverse());
    if (JSON.stringify(newBoard) !== JSON.stringify(board)) {
      addRandom(newBoard);
      setBoard(newBoard);
    }
  };

  const moveUp = () => {
    const newBoard = [...board.map(row => [...row])];
    for (let j = 0; j < 4; j++) {
      let col = [newBoard[0][j], newBoard[1][j], newBoard[2][j], newBoard[3][j]];
      col = slideAndMerge(col);
      for (let i = 0; i < 4; i++) newBoard[i][j] = col[i];
    }
    if (JSON.stringify(newBoard) !== JSON.stringify(board)) {
      addRandom(newBoard);
      setBoard(newBoard);
    }
  };

  const moveDown = () => {
    const newBoard = [...board.map(row => [...row])];
    for (let j = 0; j < 4; j++) {
      let col = [newBoard[3][j], newBoard[2][j], newBoard[1][j], newBoard[0][j]];
      col = slideAndMerge(col);
      for (let i = 0; i < 4; i++) newBoard[3 - i][j] = col[i];
    }
    if (JSON.stringify(newBoard) !== JSON.stringify(board)) {
      addRandom(newBoard);
      setBoard(newBoard);
    }
  };

  useEffect(() => {
    initBoard();
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft': moveLeft(); break;
        case 'ArrowRight': moveRight(); break;
        case 'ArrowUp': moveUp(); break;
        case 'ArrowDown': moveDown(); break;
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const getTileColor = (val: number) => {
    const colors: Record<number, string> = {
      2: 'bg-yellow-100 text-gray-800',
      4: 'bg-yellow-200 text-gray-800',
      8: 'bg-orange-400 text-white',
      16: 'bg-orange-500 text-white',
      32: 'bg-orange-600 text-white',
      64: 'bg-red-500 text-white',
      128: 'bg-yellow-500 text-white',
      256: 'bg-yellow-600 text-white',
      512: 'bg-yellow-400 text-white',
      1024: 'bg-yellow-300 text-white',
      2048: 'bg-yellow-200 text-white',
    };
    return colors[val] || 'bg-gray-700 text-white';
  };

  return (
    <div className="text-center">
      <h3 className="text-xl font-bold text-white mb-4">2048</h3>
      <div className="text-cyan-400 text-2xl font-bold mb-4">分数: {score}</div>
      <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto mb-4">
        {board.map((row, i) => 
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className={`aspect-square rounded-lg flex items-center justify-center font-bold text-lg ${getTileColor(cell)}`}
            >
              {cell || ''}
            </div>
          ))
        )}
      </div>
      <div className="flex justify-center gap-2 mb-4">
        <button onClick={moveUp} className="glass-card p-3 rounded-lg">↑</button>
      </div>
      <div className="flex justify-center gap-2 mb-4">
        <button onClick={moveLeft} className="glass-card p-3 rounded-lg">←</button>
        <button onClick={moveDown} className="glass-card p-3 rounded-lg">↓</button>
        <button onClick={moveRight} className="glass-card p-3 rounded-lg">→</button>
      </div>
      <button onClick={initBoard} className="glow-button px-6 py-2 rounded-xl text-white font-semibold">
        重新开始
      </button>
    </div>
  );
};

// 井字棋
const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isX, setIsX] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);

  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const checkWinner = (squares: (string | null)[]) => {
    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (i: number) => {
    if (board[i] || winner) return;
    const newBoard = [...board];
    newBoard[i] = isX ? 'X' : 'O';
    setBoard(newBoard);
    setIsX(!isX);
    setWinner(checkWinner(newBoard));
  };

  const restart = () => {
    setBoard(Array(9).fill(null));
    setIsX(true);
    setWinner(null);
  };

  return (
    <div className="text-center">
      <h3 className="text-xl font-bold text-white mb-4">井字棋</h3>
      <div className="text-cyan-400 text-lg mb-4">
        {winner ? `获胜者: ${winner}` : `当前: ${isX ? 'X' : 'O'}`}
      </div>
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-4">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className={`aspect-square rounded-xl glass-card text-3xl font-bold ${
              cell === 'X' ? 'text-cyan-400' : 'text-pink-400'
            }`}
          >
            {cell}
          </button>
        ))}
      </div>
      <button onClick={restart} className="glow-button px-6 py-2 rounded-xl text-white font-semibold">
        重新开始
      </button>
    </div>
  );
};

// 猜数字
const GuessNumber: React.FC = () => {
  const [target, setTarget] = useState(Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('猜一个 1-100 的数字');
  const [attempts, setAttempts] = useState(0);

  const checkGuess = () => {
    const num = Number(guess);
    setAttempts(a => a + 1);
    if (num < target) setMessage('太小了!');
    else if (num > target) setMessage('太大了!');
    else setMessage(`恭喜! 你猜了 ${attempts + 1} 次!`);
  };

  const restart = () => {
    setTarget(Math.floor(Math.random() * 100) + 1);
    setGuess('');
    setMessage('猜一个 1-100 的数字');
    setAttempts(0);
  };

  return (
    <div className="text-center">
      <h3 className="text-xl font-bold text-white mb-4">猜数字</h3>
      <div className="text-cyan-400 mb-4">{message}</div>
      <input
        type="number"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        placeholder="输入数字"
        className="w-40 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-center mb-4"
      />
      <div className="space-x-2">
        <button onClick={checkGuess} className="glow-button px-6 py-2 rounded-xl text-white font-semibold">
          猜!
        </button>
        <button onClick={restart} className="glass-card px-6 py-2 rounded-xl text-white font-semibold">
          重新开始
        </button>
      </div>
    </div>
  );
};

// 石头剪刀布
const RockPaperScissors: React.FC = () => {
  const [player, setPlayer] = useState<string | null>(null);
  const [computer, setComputer] = useState<string | null>(null);
  const [result, setResult] = useState('');

  const choices = ['石头', '剪刀', '布'];

  const play = (choice: string) => {
    setPlayer(choice);
    const compChoice = choices[Math.floor(Math.random() * 3)];
    setComputer(compChoice);
    
    if (choice === compChoice) setResult('平局!');
    else if (
      (choice === '石头' && compChoice === '剪刀') ||
      (choice === '剪刀' && compChoice === '布') ||
      (choice === '布' && compChoice === '石头')
    ) setResult('你赢了!');
    else setResult('你输了!');
  };

  return (
    <div className="text-center">
      <h3 className="text-xl font-bold text-white mb-4">石头剪刀布</h3>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {choices.map(choice => (
          <button
            key={choice}
            onClick={() => play(choice)}
            className="glass-card p-6 rounded-xl hover:scale-105 transition-transform text-4xl"
          >
            {choice === '石头' ? '🪨' : choice === '剪刀' ? '✂️' : '📄'}
            <div className="text-white text-sm mt-2">{choice}</div>
          </button>
        ))}
      </div>
      {player && computer && (
        <div className="glass-card p-4 rounded-xl">
          <div className="text-gray-300">
            你: {player === '石头' ? '🪨' : player === '剪刀' ? '✂️' : '📄'} {player}
          </div>
          <div className="text-gray-300 mb-2">
            电脑: {computer === '石头' ? '🪨' : computer === '剪刀' ? '✂️' : '📄'} {computer}
          </div>
          <div className="text-2xl font-bold gradient-text">{result}</div>
        </div>
      )}
    </div>
  );
};

// 主游戏页面
const Games: React.FC = () => {
  const games = [
    { id: 'snake', name: '贪吃蛇', icon: Gamepad2, component: SnakeGame, color: 'from-cyan-500 to-blue-600' },
    { id: '2048', name: '2048', icon: Trophy, component: Game2048, color: 'from-yellow-500 to-orange-600' },
    { id: 'tictactoe', name: '井字棋', icon: RefreshCw, component: TicTacToe, color: 'from-purple-500 to-pink-600' },
    { id: 'guess', name: '猜数字', icon: Trophy, component: GuessNumber, color: 'from-green-500 to-teal-600' },
    { id: 'rps', name: '石头剪刀布', icon: Gamepad2, component: RockPaperScissors, color: 'from-red-500 to-pink-600' },
    { id: 'more', name: '更多游戏...', icon: Trophy, component: () => <div className="text-center text-gray-400">更多游戏开发中...</div>, color: 'from-gray-500 to-gray-600' },
  ];

  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const SelectedComponent = selectedGame ? games.find(g => g.id === selectedGame)?.component : null;

  if (selectedGame && SelectedComponent) {
    return (
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setSelectedGame(null)}
            className="flex items-center text-cyan-400 hover:text-cyan-300 mb-6 transition-colors"
          >
            <ArrowLeftRight className="w-5 h-5 mr-2 rotate-180" />
            返回游戏列表
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
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">游戏娱乐</h1>
          <p className="text-gray-400 text-lg">10+ 精选小游戏，休闲放松</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {games.map((game, index) => {
            const Icon = game.icon;
            return (
              <button
                key={game.id}
                onClick={() => setSelectedGame(game.id)}
                className="glass-card rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 fade-in-up group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-medium">{game.name}</h3>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Games;
