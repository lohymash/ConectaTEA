import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type CardType = {
  id: number;
  emoji: string;
  label: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const emojis = [
  { emoji: "😊", label: "Feliz" },
  { emoji: "😢", label: "Triste" },
  { emoji: "😠", label: "Raiva" },
  { emoji: "😰", label: "Medo" },
  { emoji: "😲", label: "Surpresa" },
  { emoji: "😌", label: "Calma" },
  { emoji: "🥰", label: "Amor" },
  { emoji: "😴", label: "Cansado" },
];

const MemoryGame = () => {
  const navigate = useNavigate();
  const { addXP } = useAuth();
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [score, setScore] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [canFlip, setCanFlip] = useState(true);

  const initializeGame = () => {
    const gameCards = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((item, index) => ({
        id: index,
        emoji: item.emoji,
        label: item.label,
        isFlipped: false,
        isMatched: false,
      }));
    
    setCards(gameCards);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setScore(0);
    setGameWon(false);
    setCanFlip(true);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (flippedCards.length === 2) {
      setCanFlip(false);
      const [first, second] = flippedCards;
      const firstCard = cards[first];
      const secondCard = cards[second];

      if (firstCard.emoji === secondCard.emoji) {
        // Match!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === first || card.id === second
                ? { ...card, isMatched: true }
                : card
            )
          );
          setMatches((prev) => prev + 1);
          setScore((prev) => prev + 20);
          setFlippedCards([]);
          setCanFlip(true);
        }, 800);
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === first || card.id === second
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
          setCanFlip(true);
        }, 1200);
      }
      setMoves((prev) => prev + 1);
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (matches === emojis.length && !gameWon) {
      setGameWon(true);

      const bonus = Math.max(0, 100 - moves * 2);
      const finalScore = score + bonus;
      const xpEarned = Math.floor(finalScore / 4);

      setScore(finalScore);
      addXP(xpEarned);
    }
  }, [matches, moves, gameWon]);

  const handleCardClick = (cardId: number) => {
    if (!canFlip || flippedCards.length >= 2 || cards[cardId].isFlipped || cards[cardId].isMatched) {
      return;
    }

    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, isFlipped: true } : card
      )
    );
    setFlippedCards((prev) => [...prev, cardId]);
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
                <CardTitle className="text-3xl mb-2">🧠 Jogo da Memória</CardTitle>
                <CardDescription className="text-base">
                  Encontre os pares de emoções
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2">
                <Trophy className="w-4 h-4 mr-2" />
                {score}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Movimentos</CardDescription>
                  <CardTitle>{moves}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Pares</CardDescription>
                  <CardTitle>{matches}/{emojis.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Pontos</CardDescription>
                  <CardTitle>{score}</CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Game Board */}
            <div className="grid grid-cols-4 gap-3">
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  disabled={!canFlip || card.isFlipped || card.isMatched}
                  className={`
                    aspect-square rounded-xl transition-all duration-300 text-4xl
                    ${card.isFlipped || card.isMatched
                      ? "bg-card-soft border-2 border-primary"
                      : "bg-primary hover:bg-primary/80"
                    }
                    ${card.isMatched ? "opacity-50" : ""}
                    disabled:cursor-not-allowed
                    hover-lift
                  `}
                >
                  {card.isFlipped || card.isMatched ? card.emoji : "❓"}
                </button>
              ))}
            </div>

            {/* Game Won */}
            {gameWon && (
              <Card className="border-2 border-success bg-success/10">
                <CardContent className="py-6 text-center space-y-4">
                  <div className="text-6xl">🎉</div>
                  <h3 className="text-2xl font-bold">Parabéns!</h3>
                  <div className="space-y-1">
                    <p className="text-xl">Você completou o jogo!</p>
                    <p className="text-lg">Movimentos: {moves}</p>
                    <p className="text-lg">Pontuação Final: {score}</p>
                    <p className="text-muted-foreground">+{Math.floor(score / 4)} XP ganhos</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Controls */}
            <div className="flex justify-center">
              <Button
                size="lg"
                variant="outline"
                onClick={initializeGame}
                className="gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Novo Jogo
              </Button>
            </div>

            {/* Instructions */}
            <Card className="bg-card-soft border-2">
              <CardHeader>
                <CardTitle className="text-lg">Como Jogar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Clique em duas cartas para revelá-las</p>
                <p>• Se os emojis forem iguais, você encontrou um par!</p>
                <p>• Cada par vale 20 pontos</p>
                <p>• Tente completar com o menor número de movimentos</p>
                <p>• Menos movimentos = mais pontos de bônus!</p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemoryGame;
