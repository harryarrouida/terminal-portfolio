import React, { useState, useEffect, useCallback } from 'react';

const SnakeGame = ({ onGameOver }) => {
  const GRID_SIZE = 15;
  const CELL_SIZE = 20;
  const INITIAL_SNAKE = [{ x: 7, y: 7 }];
  const INITIAL_FOOD = { x: 5, y: 5 };
  const INITIAL_DIRECTION = 'RIGHT';
  const SPEED = 150;

  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [countdown, setCountdown] = useState(5);
  const [gameStarted, setGameStarted] = useState(false);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    setSnake(currentSnake => {
      const head = currentSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
        default: break;
      }

      // Check collision with walls
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        if (!gameOver) {
          setGameOver(true);
          onGameOver(score);
        }
        return currentSnake;
      }

      // Check collision with self
      if (currentSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        if (!gameOver) {
          setGameOver(true);
          onGameOver(score);
        }
        return currentSnake;
      }

      const newSnake = [newHead, ...currentSnake];

      // Check if food is eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setFood(generateFood());
        setScore(s => s + 1);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, generateFood, score, onGameOver]);

  useEffect(() => {
    // Countdown timer
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !gameStarted) {
      setGameStarted(true);
    }
  }, [countdown, gameStarted]);

  useEffect(() => {
    if (!gameStarted) return;

    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    const gameInterval = setInterval(moveSnake, SPEED);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      clearInterval(gameInterval);
    };
  }, [direction, moveSnake, gameStarted]);

  return (
    <div className="inline-block bg-gray-800 p-4 rounded">
      {!gameStarted ? (
        <div className="text-center mb-4">
          <div className="text-2xl text-yellow-400 font-bold mb-2">
            Game starting in:
          </div>
          <div className="text-4xl text-green-400 font-bold animate-pulse">
            {countdown}
          </div>
        </div>
      ) : (
        <div className="mb-2 text-green-400">Score: {score}</div>
      )}
      <div 
        style={{ 
          width: GRID_SIZE * CELL_SIZE, 
          height: GRID_SIZE * CELL_SIZE 
        }} 
        className="relative border border-gray-600"
      >
        {snake.map((segment, i) => (
          <div
            key={i}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              position: 'absolute',
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
            }}
            className="bg-green-500"
          />
        ))}
        <div
          style={{
            width: CELL_SIZE,
            height: CELL_SIZE,
            position: 'absolute',
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
          }}
          className="bg-red-500"
        />
      </div>
      {gameOver && (
        <div className="mt-2 text-red-400">
          Game Over! Final Score: {score}
        </div>
      )}
    </div>
  );
};

export default SnakeGame; 