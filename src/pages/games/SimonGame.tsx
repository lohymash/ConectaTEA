import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type Color = "red" | "blue" | "green" | "yellow";

const colorMap: Record<Color, { bg: string; active: string; label: string }> = {
  red: { bg: "bg-red-500", active: "bg-red-300", label: "Vermelho" },
  blue: { bg: "bg-blue-500", active: "bg-blue-300", label: "Azul" },
  green: { bg: "bg-green-500", active: "bg-green-300", label: "Verde" },
  yellow: { bg: "bg-yellow-500", active: "bg-yellow-300", label: "Amarelo" },
};

const SimonGame = () => {
  const navigate = useNavigate();
  const { addXP } = useAuth();
  const [sequence, setSequence] = useState<Color[]>([]);
  const [playerSequence, setPlayerSequence] = useState<Color[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [activeColor, setActiveColor] = useState<Color | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("Pressione Iniciar para começar");
  const timeoutRef = useRef<NodeJS.Timeout>();

  const colors: Color[] = ["red", "blue", "green", "yellow"];

  const playSequence = async (seq: Color[]) => {
    setIsShowingSequence(true);
    setMessage("Memorize a sequência...");
    
    for (let i = 0; i < seq.length; i++) {
      await new Promise((resolve) => {
        timeoutRef.current = setTimeout(() => {
          setActiveColor(seq[i]);
          setTimeout(() => {
            setActiveColor(null);
            resolve(null);
          }, 500);
        }, 700);
      });
    }
    
    setIsShowingSequence(false);
    setMessage("Sua vez! Repita a sequência");
  };

  const startGame = () => {
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    const newSequence = [newColor];
    setSequence(newSequence);
    setPlayerSequence([]);
    setScore(0);
    setRound(1);
    setGameOver(false);
    setIsPlaying(true);
    playSequence(newSequence);
  };

  const nextRound = () => {
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    const newSequence = [...sequence, newColor];
    setSequence(newSequence);
    setPlayerSequence([]);
    setRound((prev) => prev + 1);
    setScore((prev) => prev + 10);
    playSequence(newSequence);
  };

  const handleColorClick = (color: Color) => {
    if (isShowingSequence || !isPlaying || gameOver) return;

    const newPlayerSequence = [...playerSequence, color];
    setPlayerSequence(newPlayerSequence);
    
    // Flash the color
    setActiveColor(color);
    setTimeout(() => setActiveColor(null), 300);

    // Check if correct
    const currentIndex = newPlayerSequence.length - 1;
    if (newPlayerSequence[currentIndex] !== sequence[currentIndex]) {
      // Wrong!
      setGameOver(true);
      setIsPlaying(false);
      setMessage(`Fim de Jogo! Pontuação: ${score}`);
      const xpEarned = Math.floor(score / 2);
      addXP(xpEarned);
      return;
    }

    // Check if sequence is complete
    if (newPlayerSequence.length === sequence.length) {
      setMessage("Correto! Prepare-se para a próxima...");
      setTimeout(() => {
        nextRound();
      }, 1500);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

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
                <CardTitle className="text-3xl mb-2">🎵 Jogo da Sequência</CardTitle>
                <CardDescription className="text-base">
                  Memorize e repita a sequência de cores
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2">
                <Trophy className="w-4 h-4 mr-2" />
                {score}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Message */}
            <div className="text-center">
              <p className="text-lg font-medium min-h-[28px]">{message}</p>
              {isPlaying && !gameOver && (
                <p className="text-muted-foreground mt-2">Rodada {round}</p>
              )}
            </div>

            {/* Game Board */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorClick(color)}
                  disabled={isShowingSequence || !isPlaying || gameOver}
                  className={`
                    aspect-square rounded-2xl transition-all duration-200 
                    ${activeColor === color ? colorMap[color].active : colorMap[color].bg}
                    ${isShowingSequence || !isPlaying || gameOver ? "opacity-50 cursor-not-allowed" : "hover:scale-105 hover:shadow-lg cursor-pointer"}
                    disabled:cursor-not-allowed
                  `}
                  aria-label={colorMap[color].label}
                />
              ))}
            </div>

            {/* Stats */}
            {isPlaying && !gameOver && (
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Rodada</CardDescription>
                    <CardTitle>{round}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Sequência</CardDescription>
                    <CardTitle>{sequence.length}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Pontos</CardDescription>
                    <CardTitle>{score}</CardTitle>
                  </CardHeader>
                </Card>
              </div>
            )}

            {/* Game Over */}
            {gameOver && (
              <Card className="border-2 border-primary bg-card-soft">
                <CardContent className="py-6 text-center space-y-4">
                  <div className="text-5xl">🎮</div>
                  <h3 className="text-2xl font-bold">Fim de Jogo!</h3>
                  <div className="space-y-1">
                    <p className="text-xl">Pontuação: {score}</p>
                    <p className="text-muted-foreground">Sequência de {sequence.length} cores</p>
                    <p className="text-muted-foreground">+{Math.floor(score / 2)} XP ganhos</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Controls */}
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={startGame}
                disabled={isPlaying && !gameOver}
                className="gap-2"
              >
                <Play className="w-5 h-5" />
                {isPlaying && !gameOver ? "Em Jogo..." : gameOver ? "Jogar Novamente" : "Iniciar Jogo"}
              </Button>
            </div>

            {/* Instructions */}
            <Card className="bg-card-soft border-2">
              <CardHeader>
                <CardTitle className="text-lg">Como Jogar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Observe a sequência de cores que pisca</p>
                <p>• Repita a sequência clicando nas cores na ordem correta</p>
                <p>• A cada rodada, uma nova cor é adicionada</p>
                <p>• Cada rodada completada vale 10 pontos</p>
                <p>• O jogo termina se você errar a sequência</p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimonGame;
