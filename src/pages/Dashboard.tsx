import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { Users, Gamepad2, BookOpen, Trophy, Star, TrendingUp, MessageCircle, Sparkles, Info } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  const quickActions = [
    { 
      title: "Comunidade", 
      description: "Participe das discussões",
      icon: Users, 
      path: "/community",
      color: "bg-primary",
    },
    { 
      title: "Jogos", 
      description: "Continue jogando",
      icon: Gamepad2, 
      path: "/games",
      color: "bg-secondary",
    },
    { 
      title: "Artigos", 
      description: "Leia algo novo",
      icon: BookOpen, 
      path: "/articles",
      color: "bg-accent",
    },
    {
      title: "Sobre nós",
      description: "Saiba um pouco quem nós somos",
      icon: Info,
      path: "/about",
      color: "bg-red"
    }
  ];

  const achievements = [
    { title: "Primeiro Post", icon: MessageCircle, unlocked: true },
    { title: "10 Jogos", icon: Gamepad2, unlocked: true },
    { title: "Leitor Ávido", icon: BookOpen, unlocked: false },
    { title: "Mestre TEA", icon: Trophy, unlocked: false },
  ];

  // XP para próximo nível
  const xpForNextLevel = 1000;
  const currentXP = user?.xp || 0;
  const xpProgress = (currentXP / xpForNextLevel) * 100;

  return (
    <div className="min-h-screen py-8">
      <div className="container-custom">
        {/* Welcome Section */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Olá, {user?.name || "Visitante"}! 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            Bem-vindo de volta ao ConectaTEA
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Level Card */}
            <Card className="border-2 shadow-soft animate-fade-in">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-6 h-6 text-warning" />
                      Nível {user?.level || 1}
                    </CardTitle>
                    <CardDescription>Continue progredindo!</CardDescription>
                  </div>
                  <Badge className="bg-gradient-primary text-lg px-4 py-2">
                    {currentXP} XP
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Progresso para o próximo nível</span>
                    <span>{currentXP} / {xpForNextLevel}</span>
                  </div>
                  <Progress value={xpProgress} className="h-3" />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                Ações Rápidas
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={index} to={action.path}>
                    <Card className="hover-lift cursor-pointer border-2 h-full transition-all animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-3 shadow-soft`}>
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <CardTitle className="text-xl">{action.title}</CardTitle>
                        <CardDescription>{action.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Atividade Recente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                      <Gamepad2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Jogou Jogo da Memória</p>
                      <p className="text-sm text-muted-foreground">Ganhou 50 XP • Há 2 horas</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Comentou em um post</p>
                      <p className="text-sm text-muted-foreground">Na comunidade • Ontem</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="border-2 shadow-soft">
              <CardHeader className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center text-4xl shadow-glow">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full" />
                  ) : "👤"}
                </div>
                <CardTitle>{user?.name || "Visitante"}</CardTitle>
                <CardDescription>{user?.email || "visitante@email.com"}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/profile">
                  <Button variant="outline" className="w-full">
                    Ver Perfil
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-warning" />
                  Conquistas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg text-center transition-all ${
                        achievement.unlocked
                          ? "bg-gradient-primary text-white shadow-soft"
                          : "bg-muted opacity-50"
                      }`}
                    >
                      <achievement.icon className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-xs font-medium">{achievement.title}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
