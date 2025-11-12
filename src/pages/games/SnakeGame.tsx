import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Pause, RotateCcw, Trophy, ArrowUp, ArrowDown, ArrowRight, ArrowLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };

const GRID_SIZE = 15;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

const SnakeGame = () => {
  const navigate = useNavigate();
  const { addXP } = useAuth();
  const [snake, setSnake] = useState<Position[]>([{ x: 7, y: 7 }]);
  const [food, setFood] = useState<Position>({ x: 3, y: 3 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const directionRef = useRef<Direction>("RIGHT");

  const generateFood = useCallback((snakeBody: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snakeBody.some((segment) => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = () => {
    const initialSnake = [{ x: 7, y: 7 }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection("RIGHT");
    directionRef.current = "RIGHT";
    setScore(0);
    setGameOver(false);
    setIsPlaying(false);
  };

  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const head = prevSnake[0];
      let newHead: Position;

      switch (directionRef.current) {
        case "UP":
          newHead = { x: head.x, y: head.y - 1 };
          break;
        case "DOWN":
          newHead = { x: head.x, y: head.y + 1 };
          break;
        case "LEFT":
          newHead = { x: head.x - 1, y: head.y };
          break;
        case "RIGHT":
          newHead = { x: head.x + 1, y: head.y };
          break;
      }

      // Check wall collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((prev) => prev + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, generateFood]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const interval = setInterval(moveSnake, INITIAL_SPEED);
    return () => clearInterval(interval);
  }, [isPlaying, gameOver, moveSnake]);

  useEffect(() => {
    if (gameOver && score > 0) {
      const xpEarned = Math.floor(score / 2);
      addXP(xpEarned);
      if (score > highScore) {
        setHighScore(score);
      }
    }
  }, [gameOver, score, addXP, highScore]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return;

      // Prevenir scroll da página com as setas
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case "ArrowUp":
          if (directionRef.current !== "DOWN") {
            directionRef.current = "UP";
            setDirection("UP");
          }
          break;
        case "ArrowDown":
          if (directionRef.current !== "UP") {
            directionRef.current = "DOWN";
            setDirection("DOWN");
          }
          break;
        case "ArrowLeft":
          if (directionRef.current !== "RIGHT") {
            directionRef.current = "LEFT";
            setDirection("LEFT");
          }
          break;
        case "ArrowRight":
          if (directionRef.current !== "LEFT") {
            directionRef.current = "RIGHT";
            setDirection("RIGHT");
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isPlaying, gameOver]);

  const handleMobileControl = (newDirection: Direction) => {
    if (!isPlaying || gameOver) return;
    
    const opposites: Record<Direction, Direction> = {
      UP: "DOWN",
      DOWN: "UP",
      LEFT: "RIGHT",
      RIGHT: "LEFT",
    };

    if (directionRef.current !== opposites[newDirection]) {
      directionRef.current = newDirection;
      setDirection(newDirection);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container-custom max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/games")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar aos Jogos
        </Button>

        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl mb-2">🐍 Jogo da Cobra</CardTitle>
                <CardDescription className="text-base">
                  Use as setas do teclado ou os botões abaixo para controlar
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2">
                <Trophy className="w-4 h-4 mr-2" />
                {score} pontos
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Game Board */}
            <div className="flex justify-center">
              <div
                className="border-2 border-border bg-background shadow-lg"
                style={{
                  width: GRID_SIZE * CELL_SIZE,
                  height: GRID_SIZE * CELL_SIZE,
                  position: "relative",
                  display: "grid",
                  gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
                  gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
                }}
              >
                {/* Grid lines */}
                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
                  <div
                    key={`grid-${i}`}
                    className="border border-border/10"
                    style={{ width: CELL_SIZE, height: CELL_SIZE }}
                  />
                ))}
                {/* Snake */}
                {snake.map((segment, index) => (
                  <div
                    key={index}
                    className="absolute bg-primary"
                    style={{
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      left: segment.x * CELL_SIZE,
                      top: segment.y * CELL_SIZE,
                      opacity: index === 0 ? 1 : 0.9,
                      boxShadow: index === 0 ? "0 0 10px rgba(var(--primary), 0.5)" : "none",
                    }}
                  />
                ))}
                {/* Food */}
                <div
                  className="absolute bg-accent animate-pulse"
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    left: food.x * CELL_SIZE,
                    top: food.y * CELL_SIZE,
                    boxShadow: "0 0 15px rgba(var(--accent), 0.6)",
                  }}
                />
                {/* Game Over Overlay */}
                {gameOver && (
                  <div className="absolute inset-0 bg-background/90 flex items-center justify-center rounded-lg">
                    <div className="text-center space-y-4">
                      <h3 className="text-2xl font-bold">Fim de Jogo!</h3>
                      <p className="text-xl">Pontuação: {score}</p>
                      <p className="text-muted-foreground">
                        +{Math.floor(score / 2)} XP ganhos
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Pontuação</CardDescription>
                  <CardTitle>{score}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Recorde</CardDescription>
                  <CardTitle>{highScore}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Tamanho</CardDescription>
                  <CardTitle>{snake.length}</CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Controls */}
            <div className="flex gap-3 justify-center flex-wrap">
              {!isPlaying && !gameOver && (
                <Button
                  size="lg"
                  onClick={() => setIsPlaying(true)}
                  className="gap-2"
                >
                  <Play className="w-5 h-5" />
                  Começar
                </Button>
              )}
              {isPlaying && (
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => setIsPlaying(false)}
                  className="gap-2"
                >
                  <Pause className="w-5 h-5" />
                  Pausar
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                onClick={resetGame}
                className="gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Reiniciar
              </Button>
            </div>

            {/* Mobile Controls */}
            <div className="lg:hidden">
              <p className="text-center text-sm text-muted-foreground mb-4">
                Controles do Jogo
              </p>
              <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                <div></div>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleMobileControl("UP")}
                  className="w-full aspect-square"
                  disabled={!isPlaying || gameOver}
                  aria-label="Mover para cima"
                >
                  <ArrowUp className="w-6 h-6" />
                </Button>
                <div></div>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleMobileControl("LEFT")}
                  className="w-full aspect-square"
                  disabled={!isPlaying || gameOver}
                  aria-label="Mover para esquerda"
                >
                  <ArrowLeftIcon className="w-6 h-6" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleMobileControl("DOWN")}
                  className="w-full aspect-square"
                  disabled={!isPlaying || gameOver}
                  aria-label="Mover para baixo"
                >
                  <ArrowDown className="w-6 h-6" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleMobileControl("RIGHT")}
                  className="w-full aspect-square"
                  disabled={!isPlaying || gameOver}
                  aria-label="Mover para direita"
                >
                  <ArrowRight className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* Instructions */}
            <Card className="bg-card-soft border-2">
              <CardHeader>
                <CardTitle className="text-lg">Como Jogar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Use as setas do teclado ou os botões para mover a cobra</p>
                <p>• Coma a comida (círculo brilhante) para crescer</p>
                <p>• Não bata nas paredes ou no próprio corpo</p>
                <p>• Cada comida vale 10 pontos e 5 XP no final</p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SnakeGame;
