import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, ExternalLink, Search, Clock, TrendingUp, Languages, BookOpenCheck } from "lucide-react";
import TextToSpeech from "@/components/TextToSpeech";
import ArticleReader from "@/components/ArticleReader";
import { fetchAutismNews, translateText, NewsArticle as ApiArticle } from "@/services/newsApi";
import { useToast } from "@/hooks/use-toast";

interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string;
  content?: string;
}

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [translating, setTranslating] = useState<Record<string, boolean>>({});
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async (page: number = 1) => {
    const isFirstLoad = page === 1;
    if (isFirstLoad) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    
    try {
      const newsArticles = await fetchAutismNews(page);
      const formattedArticles: Article[] = newsArticles.map((article, index) => ({
        id: `article-${page}-${index}`,
        title: article.title,
        description: article.description,
        url: article.url,
        source: article.source,
        publishedAt: article.publishedAt,
        category: article.category,
        content: article.content,
      }));
      
      if (isFirstLoad) {
        setArticles(formattedArticles);
      } else {
        setArticles(prev => [...prev, ...formattedArticles]);
      }
    } catch (error) {
      console.error("Error loading articles:", error);
      toast({
        title: "Erro ao carregar artigos",
        description: "Não foi possível carregar os artigos. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      if (isFirstLoad) {
        setIsLoading(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  };

  const handleLoadMore = async () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    await loadArticles(nextPage);
  };

  const handleTranslate = async (articleId: string) => {
    setTranslating((prev) => ({ ...prev, [articleId]: true }));
    
    const article = articles.find((a) => a.id === articleId);
    if (!article) return;

    try {
      const translatedTitle = await translateText(article.title);
      const translatedDescription = await translateText(article.description);

      setArticles((prev) =>
        prev.map((a) =>
          a.id === articleId
            ? { ...a, title: translatedTitle, description: translatedDescription }
            : a
        )
      );

      toast({
        title: "Tradução concluída",
        description: "O artigo foi traduzido para português",
      });
    } catch (error) {
      toast({
        title: "Erro na tradução",
        description: "Não foi possível traduzir o artigo",
        variant: "destructive",
      });
    } finally {
      setTranslating((prev) => ({ ...prev, [articleId]: false }));
    }
  };

  const categories = ["Todos", "Diagnóstico", "Terapias", "Inclusão", "Qualidade de Vida", "Direitos"];
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const handleReadArticle = (article: Article) => {
    setSelectedArticle(article);
    setIsReaderOpen(true);
  };

  const getArticleContent = (article: Article) => {
    return article.content || article.description;
  };

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
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-sm text-muted-foreground">{article.source}</span>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTranslate(article.id)}
                          disabled={translating[article.id]}
                          className="gap-2"
                          title="Traduzir para português"
                        >
                          <Languages className="w-4 h-4" />
                          {translating[article.id] ? "Traduzindo..." : "PT-BR"}
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="gap-2"
                          onClick={() => handleReadArticle(article)}
                        >
                          <BookOpenCheck className="w-4 h-4" />
                          Ler Aqui
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2"
                          onClick={() => window.open(article.url, "_blank")}
                        >
                          <ExternalLink className="w-4 h-4" />
                          Ver Original
                        </Button>
                      </div>
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
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="gap-2"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                >
                  <TrendingUp className="w-5 h-5" />
                  {isLoadingMore ? "Carregando..." : "Carregar Mais Artigos"}
                </Button>
              </div>
            )}
          </>
        )}

        {/* Article Reader Dialog */}
        {selectedArticle && (
          <ArticleReader
            isOpen={isReaderOpen}
            onClose={() => {
              setIsReaderOpen(false);
              setSelectedArticle(null);
            }}
            title={selectedArticle.title}
            content={getArticleContent(selectedArticle)}
            url={selectedArticle.url}
            source={selectedArticle.source}
          />
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
