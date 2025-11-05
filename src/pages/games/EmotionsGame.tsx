import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type Emotion = {
  name: string;
  emoji: string;
  color: string;
};

const emotions: Emotion[] = [
  { name: "Feliz", emoji: "😊", color: "bg-success" },
  { name: "Triste", emoji: "😢", color: "bg-info" },
  { name: "Com Raiva", emoji: "😠", color: "bg-destructive" },
  { name: "Com Medo", emoji: "😰", color: "bg-warning" },
  { name: "Surpreso", emoji: "😲", color: "bg-accent" },
  { name: "Tranquilo", emoji: "😌", color: "bg-secondary" },
];

const EmotionsGame = () => {
  const navigate = useNavigate();
  const { addXP } = useAuth();
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>(emotions[0]);
  const [options, setOptions] = useState<Emotion[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<{ show: boolean; correct: boolean; message: string }>({
    show: false,
    correct: false,
    message: "",
  });

  const generateRound = () => {
    const correct = emotions[Math.floor(Math.random() * emotions.length)];
    const wrongOptions = emotions.filter((e) => e.name !== correct.name);
    const shuffled = [correct, ...wrongOptions.sort(() => Math.random() - 0.5).slice(0, 3)]
      .sort(() => Math.random() - 0.5);
    
    setCurrentEmotion(correct);
    setOptions(shuffled);
    setFeedback({ show: false, correct: false, message: "" });
  };

  useEffect(() => {
    generateRound();
  }, []);

  const handleAnswer = (selected: Emotion) => {
    const isCorrect = selected.name === currentEmotion.name;
    
    if (isCorrect) {
      setScore((prev) => prev + 10);
      setFeedback({
        show: true,
        correct: true,
        message: "Parabéns! Você acertou! 🎉",
      });
      
      setTimeout(() => {
        setRound((prev) => prev + 1);
        generateRound();
      }, 1500);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setFeedback({
        show: true,
        correct: false,
        message: `Ops! A resposta correta era "${currentEmotion.name}"`,
      });
      
      if (newLives <= 0) {
        setGameOver(true);
        const xpEarned = Math.floor(score / 3);
        addXP(xpEarned);
      } else {
        setTimeout(() => {
          generateRound();
        }, 2000);
      }
    }
  };

  const resetGame = () => {
    setScore(0);
    setLives(3);
    setRound(1);
    setGameOver(false);
    generateRound();
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
                <CardTitle className="text-3xl mb-2">😊 Jogo das Emoções</CardTitle>
                <CardDescription className="text-base">
                  Identifique a emoção correta
                </CardDescription>
              </div>
              <div className="flex gap-3">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  <Trophy className="w-4 h-4 mr-2" />
                  {score}
                </Badge>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  <Heart className="w-4 h-4 mr-2" />
                  {lives}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {!gameOver ? (
              <>
                {/* Emotion Display */}
                <div className="text-center space-y-4">
                  <p className="text-lg text-muted-foreground">Rodada {round}</p>
                  <div className="py-12">
                    <div className="text-9xl animate-scale-in">{currentEmotion.emoji}</div>
                  </div>
                  <p className="text-xl font-medium">Qual emoção é esta?</p>
                </div>

                {/* Feedback */}
                {feedback.show && (
                  <Card className={`border-2 ${feedback.correct ? "border-success bg-success/10" : "border-destructive bg-destructive/10"}`}>
                    <CardContent className="py-4 text-center">
                      <p className="font-medium">{feedback.message}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Options */}
                <div className="grid grid-cols-2 gap-4">
                  {options.map((emotion) => (
                    <Button
                      key={emotion.name}
                      size="lg"
                      variant="outline"
                      onClick={() => handleAnswer(emotion)}
                      disabled={feedback.show}
                      className="h-auto py-6 text-lg hover-lift"
                    >
                      <span className="text-3xl mr-3">{emotion.emoji}</span>
                      {emotion.name}
                    </Button>
                  ))}
                </div>
              </>
            ) : (
              /* Game Over */
              <div className="text-center space-y-6 py-8">
                <div className="text-6xl">🎮</div>
                <h3 className="text-3xl font-bold">Fim de Jogo!</h3>
                <div className="space-y-2">
                  <p className="text-2xl">Pontuação Final: {score}</p>
                  <p className="text-lg text-muted-foreground">Rodadas Completadas: {round - 1}</p>
                  <p className="text-muted-foreground">+{Math.floor(score / 3)} XP ganhos</p>
                </div>
                <Button size="lg" onClick={resetGame} className="gap-2">
                  Jogar Novamente
                </Button>
              </div>
            )}

            {/* Instructions */}
            <Card className="bg-card-soft border-2">
              <CardHeader>
                <CardTitle className="text-lg">Como Jogar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Observe o emoji apresentado</p>
                <p>• Clique na emoção que corresponde ao emoji</p>
                <p>• Cada acerto vale 10 pontos</p>
                <p>• Você tem 3 vidas (❤️) para usar</p>
                <p>• O jogo termina quando acabarem as vidas</p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmotionsGame;
