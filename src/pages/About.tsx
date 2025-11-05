import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Heart, Sparkles, School } from "lucide-react";

const About = () => {
  const teamMembers = [
    {
      name: "Isabelly Vitória",
      role: "Líder do grupo, responsável pela organização e repositórios",
    },
    {
      name: "Ana Carolina Teles",
      role: "Responsável pela documentação do projeto",
    },
    {
      name: "Heloísa Targa",
      role: "Criação e desenvolvimento do site",
    },
    {
      name: "Letícia Vieira",
      role: "Criação e desenvolvimento do site",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero py-12 px-4">
      <div className="container-custom">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Conect TEA
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Uma plataforma inclusiva, acessível e interativa para pessoas com Transtorno do Espectro Autista
          </p>
        </div>

        {/* ETEC Info Card */}
        <Card className="mb-8 animate-slide-up hover-lift">
          <CardHeader>
            <div className="flex items-center gap-3">
              <School className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">Instituição</CardTitle>
                <CardDescription>Nosso instituto de aprendizado</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-primary">
              ETEC Professor Edson Galvão – Itapetininga/SP
            </p>
          </CardContent>
        </Card>

        {/* Team Section */}
        <Card className="mb-8 animate-slide-up hover-lift" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-secondary" />
              <div>
                <CardTitle className="text-2xl">Integrantes da Equipe</CardTitle>
                <CardDescription>As mentes por trás do projeto</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-muted/50 border border-border hover:border-primary transition-all"
                >
                  <h3 className="font-semibold text-lg mb-2 text-foreground">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project History */}
        <Card className="animate-slide-up hover-lift" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-destructive" />
              <div>
                <CardTitle className="text-2xl">História do Projeto</CardTitle>
                <CardDescription>Nossa motivação e propósito</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground leading-relaxed">
              O <span className="font-semibold text-primary">Conect TEA</span> nasceu a partir de um olhar sensível e atento 
              para as necessidades de um público que ainda enfrenta muitas barreiras no dia a dia: pessoas com Transtorno do 
              Espectro Autista (TEA) e seus familiares.
            </p>
            <p className="text-foreground leading-relaxed">
              Nosso grupo, ao refletir sobre qual projeto poderia causar impacto positivo na sociedade, percebeu a carência 
              de ferramentas digitais voltadas para esse público. Assim, surgiu a ideia de criar uma plataforma inclusiva, 
              acessível e interativa, que unisse suporte para os responsáveis, jogos educativos e uma rede de apoio para 
              fortalecer a comunidade.
            </p>
            <div className="flex items-start gap-3 p-4 bg-accent/10 rounded-lg border border-accent/20">
              <Sparkles className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
              <p className="text-foreground leading-relaxed">
                Com esse propósito, o <span className="font-semibold text-accent">Conect TEA</span> foi idealizado como um 
                espaço de acolhimento, informação e desenvolvimento, utilizando a tecnologia como aliada da inclusão.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;