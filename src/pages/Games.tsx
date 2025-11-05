import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Smile, Brain, Zap, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Games = () => {
  const navigate = useNavigate();
  const games = [
    {
      id: "snake",
      title: "Jogo da Cobra",
      description: "Teste seus reflexos e coordenação em um clássico renovado",
      icon: Zap,
      difficulty: "Médio",
      xp: "50 XP",
      color: "bg-primary",
      available: true,
    },
    {
      id: "emotions",
      title: "Jogo das Emoções",
      description: "Identifique diferentes expressões faciais e emoções",
      icon: Smile,
      difficulty: "Fácil",
      xp: "30 XP",
      color: "bg-secondary",
      available: true,
    },
    {
      id: "simon",
      title: "Jogo da Sequência (Simon)",
      description: "Memorize e repita sequências de cores e sons",
      icon: Brain,
      difficulty: "Difícil",
      xp: "75 XP",
      color: "bg-accent",
      available: true,
    },
    {
      id: "memory",
      title: "Jogo da Memória",
      description: "Encontre os pares de cartas relacionadas a emoções",
      icon: Trophy,
      difficulty: "Fácil",
      xp: "40 XP",
      color: "bg-warning",
      available: true,
    },
  ];

  const handlePlayGame = (gameId: string) => {
    navigate(`/games/${gameId}`);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <Gamepad2 className="w-8 h-8 text-primary" />
            Jogos Terapêuticos
          </h1>
          <p className="text-lg text-muted-foreground">
            Desenvolva habilidades cognitivas e emocionais de forma divertida
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardDescription>Jogos Jogados</CardDescription>
              <CardTitle className="text-3xl">42</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardDescription>XP Total</CardDescription>
              <CardTitle className="text-3xl">1,580</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardDescription>Melhor Pontuação</CardDescription>
              <CardTitle className="text-3xl">985</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardDescription>Conquistas</CardDescription>
              <CardTitle className="text-3xl">8/12</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {games.map((game, index) => (
            <Card 
              key={game.id}
              className="border-2 hover-lift animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-16 h-16 rounded-2xl ${game.color} flex items-center justify-center shadow-soft`}>
                    <game.icon className="w-8 h-8 text-white" />
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {game.xp}
                  </Badge>
                </div>
                <CardTitle className="text-2xl">{game.title}</CardTitle>
                <CardDescription className="text-base">{game.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Dificuldade:</span>
                  <Badge 
                    variant="secondary"
                    className={
                      game.difficulty === "Fácil" 
                        ? "bg-success/20 text-success" 
                        : game.difficulty === "Médio"
                        ? "bg-warning/20 text-warning"
                        : "bg-destructive/20 text-destructive"
                    }
                  >
                    {game.difficulty}
                  </Badge>
                </div>
                
                <Button 
                  className={`w-full gap-2 ${game.color} hover:opacity-90`}
                  onClick={() => handlePlayGame(game.id)}
                  disabled={!game.available}
                >
                  <Gamepad2 className="w-5 h-5" />
                  {game.available ? "Jogar Agora" : "Em Breve"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <Card className="mt-12 border-2 bg-gradient-hero">
          <CardHeader>
            <CardTitle className="text-2xl">Benefícios dos Jogos Terapêuticos</CardTitle>
            <CardDescription className="text-base">
              Cada jogo foi desenvolvido com objetivos específicos de desenvolvimento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-card">
                <Brain className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Desenvolvimento Cognitivo</h3>
                  <p className="text-sm text-muted-foreground">
                    Memória, atenção e raciocínio lógico
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-card">
                <Smile className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Inteligência Emocional</h3>
                  <p className="text-sm text-muted-foreground">
                    Reconhecimento e expressão de emoções
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-card">
                <Zap className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Coordenação Motora</h3>
                  <p className="text-sm text-muted-foreground">
                    Reflexos e coordenação olho-mão
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-card">
                <Trophy className="w-6 h-6 text-warning flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Motivação e Recompensa</h3>
                  <p className="text-sm text-muted-foreground">
                    Sistema de níveis e conquistas
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Games;
