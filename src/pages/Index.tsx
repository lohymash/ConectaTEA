import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Gamepad2, BookOpen, Star, Heart, Sparkles } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";
import featuresIllustration from "@/assets/features-illustration.png";
import NewsArticles from "@/components/NewsArticles";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const Index = () => {
  const [membersCount, setMembersCount] = useState<number | null>(null);
  const [loadingMembers, setLoadingMembers] = useState(true);

  useEffect(() => {
    const fetchMembersCount = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        setMembersCount(usersSnapshot.size);
      } catch (error) {
        console.error("Erro ao buscar membros:", error);
        setMembersCount(0);
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchMembersCount();
  }, []);

  const features = [
    {
      icon: Users,
      title: "Comunidade Acolhedora",
      description: "Compartilhe experiências, dúvidas e curiosidades em um espaço seguro e respeitoso",
      color: "bg-primary",
    },
    {
      icon: Gamepad2,
      title: "Jogos Terapêuticos",
      description: "Desenvolva habilidades cognitivas e emocionais através de jogos interativos",
      color: "bg-secondary",
    },
    {
      icon: BookOpen,
      title: "Artigos e Conteúdo",
      description: "Acesse informações atualizadas e confiáveis sobre o espectro autista",
      color: "bg-accent",
    },
    {
      icon: Star,
      title: "Sistema de Níveis",
      description: "Ganhe XP, conquiste medalhas e acompanhe seu progresso",
      color: "bg-warning",
    },
  ];

  const stats = [
    { 
      value: loadingMembers ? <Skeleton className="h-8 w-20 mx-auto" /> : membersCount?.toString() || "0", 
      label: "Membros Ativos" 
    },
    { value: "4", label: "Jogos Disponíveis" },
    { value: "50+", label: "Artigos" },
    { value: "100%", label: "Acessível" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative py-20 md:py-32 overflow-hidden"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-slide-up">
            <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Bem-vindo ao ConectaTEA
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Um espaço feito para{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                compreender, aprender
              </span>{" "}
              e crescer juntos
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-balance">
              Plataforma inclusiva e acessível que conecta pessoas autistas através de 
              jogos terapêuticos, comunidade acolhedora e conteúdo educativo
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="w-full sm:w-auto gap-2 bg-gradient-primary text-lg hover:opacity-90 shadow-glow">
                  <Heart className="w-5 h-5" />
                  Começar Agora
                </Button>
              </Link>
              <Link to="/community">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg hover-lift">
                  Explorar Comunidade
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container-custom">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Recursos da Plataforma
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Desenvolvemos funcionalidades pensadas especialmente para promover 
              bem-estar, aprendizado e conexão
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="hover-lift border-2 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardHeader>
                  <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-4 shadow-soft`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <img 
              src={featuresIllustration} 
              alt="Ilustração dos recursos" 
              className="max-w-md mx-auto rounded-3xl shadow-medium"
            />
          </div>
        </div>
      </section>

      {/* News Section */}
      <NewsArticles />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container-custom">
          <Card className="max-w-4xl mx-auto text-center border-2 shadow-glow">
            <CardHeader className="space-y-6 pb-8">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center shadow-medium">
                <Heart className="w-8 h-8 text-white animate-pulse-soft" />
              </div>
              <CardTitle className="text-3xl md:text-4xl">
                Pronto para fazer parte?
              </CardTitle>
              <CardDescription className="text-lg">
                Junte-se a uma comunidade que te entende, respeita e apoia. 
                Crie sua conta gratuitamente e comece sua jornada hoje mesmo!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/auth">
                <Button size="lg" className="gap-2 bg-gradient-primary text-lg hover:opacity-90">
                  <Sparkles className="w-5 h-5" />
                  Criar Conta Grátis
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
