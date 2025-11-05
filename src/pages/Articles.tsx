import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, ExternalLink, Search, Clock, TrendingUp } from "lucide-react";

interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string;
}

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Simulação de artigos - substituir por API real
  useEffect(() => {
    const mockArticles: Article[] = [
      {
        id: "1",
        title: "Avanços no diagnóstico precoce do TEA",
        description: "Novas tecnologias e métodos estão tornando possível identificar sinais de autismo em crianças cada vez mais cedo, permitindo intervenções mais eficazes.",
        url: "#",
        source: "Portal Autismo Brasil",
        publishedAt: "2024-01-15",
        category: "Diagnóstico",
      },
      {
        id: "2",
        title: "Terapias baseadas em jogos para autistas",
        description: "Estudos mostram que jogos terapêuticos podem auxiliar significativamente no desenvolvimento de habilidades sociais e cognitivas.",
        url: "#",
        source: "Revista Neurociência",
        publishedAt: "2024-01-10",
        category: "Terapias",
      },
      {
        id: "3",
        title: "Inclusão no mercado de trabalho",
        description: "Empresas brasileiras estão implementando programas específicos para contratar e apoiar profissionais autistas.",
        url: "#",
        source: "TEA Notícias",
        publishedAt: "2024-01-05",
        category: "Inclusão",
      },
      {
        id: "4",
        title: "Estratégias para lidar com sobrecarga sensorial",
        description: "Especialistas compartilham técnicas práticas para gerenciar situações de sobrecarga sensorial no dia a dia.",
        url: "#",
        source: "Autismo em Foco",
        publishedAt: "2023-12-28",
        category: "Qualidade de Vida",
      },
      {
        id: "5",
        title: "Direitos das pessoas autistas no Brasil",
        description: "Conheça as principais leis e direitos garantidos para pessoas com TEA no território nacional.",
        url: "#",
        source: "Direito e Autismo",
        publishedAt: "2023-12-20",
        category: "Direitos",
      },
    ];

    setTimeout(() => {
      setArticles(mockArticles);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const categories = ["Todos", "Diagnóstico", "Terapias", "Inclusão", "Qualidade de Vida", "Direitos"];
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  return (
    <div className="min-h-screen py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            Artigos e Conteúdo
          </h1>
          <p className="text-lg text-muted-foreground">
            Mantenha-se informado com conteúdo atualizado sobre autismo
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8 border-2">
          <CardContent className="pt-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Buscar artigos..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary animate-pulse" />
            <p className="text-muted-foreground">Carregando artigos...</p>
          </div>
        ) : (
          <>
            {/* Articles Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredArticles.map((article, index) => (
                <Card 
                  key={article.id}
                  className="border-2 hover-lift flex flex-col animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="secondary">{article.category}</Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl line-clamp-2">{article.title}</CardTitle>
                    <CardDescription className="text-base line-clamp-3">
                      {article.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{article.source}</span>
                      <Button variant="outline" size="sm" className="gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Ler mais
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filteredArticles.length === 0 && (
              <Card className="border-2">
                <CardContent className="py-12 text-center">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg text-muted-foreground">
                    Nenhum artigo encontrado para sua busca
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Load More */}
            {filteredArticles.length > 0 && (
              <div className="text-center">
                <Button variant="outline" size="lg" className="gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Carregar Mais Artigos
                </Button>
              </div>
            )}
          </>
        )}

        {/* Info Card */}
        <Card className="mt-12 border-2 bg-gradient-hero">
          <CardHeader>
            <CardTitle className="text-2xl">Sobre Nosso Conteúdo</CardTitle>
            <CardDescription className="text-base">
              Curadoria de informações confiáveis sobre o espectro autista
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">
              Todos os artigos são selecionados de fontes confiáveis e verificadas, 
              incluindo instituições de pesquisa, associações de autismo e profissionais 
              especializados. Nosso objetivo é fornecer informação de qualidade que ajude 
              na compreensão e no apoio ao autismo.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Articles;
