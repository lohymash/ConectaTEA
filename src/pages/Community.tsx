import { useState, useEffect } from "react";
import { 
  createPost, 
  getPosts, 
  deletePost as deletePostFirestore, 
  likePost,
  createComment,
  getComments,
  deleteComment,
  Post,
  Comment
} from '@/services/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Heart, MessageCircle, Send, Plus, Star, TrendingUp, Search, Filter, Edit2, Trash2, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CATEGORIES = ["Dúvida", "Conquista", "Curiosidade", "Experiência", "Dica", "Outro"];

const Community = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("Dúvida");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent");
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [editingPost, setEditingPost] = useState<string | null>(null);

  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [loading, setLoading] = useState(true);

  // Carregar posts do Firebase
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Erro ao carregar posts:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os posts. Verifique sua configuração do Firebase.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async (postId: string) => {
    try {
      const fetchedComments = await getComments(postId);
      setComments(prev => ({ ...prev, [postId]: fetchedComments }));
    } catch (error) {
      console.error("Erro ao carregar comentários:", error);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) {
      toast({
        title: "Faça login",
        description: "Você precisa estar logado para curtir posts",
        variant: "destructive",
      });
      return;
    }

    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const alreadyLiked = post.likedBy.includes(user.id);
      await likePost(postId, user.id, !alreadyLiked);
      
      // Atualizar estado local
      setPosts(posts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            likes: alreadyLiked ? p.likes - 1 : p.likes + 1,
            likedBy: alreadyLiked 
              ? p.likedBy.filter(id => id !== user.id)
              : [...p.likedBy, user.id]
          };
        }
        return p;
      }));
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível curtir o post",
        variant: "destructive",
      });
    }
  };

  const handleNewPost = async () => {
    if (!user) {
      toast({
        title: "Faça login",
        description: "Você precisa estar logado para criar posts",
        variant: "destructive",
      });
      return;
    }

    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha título e conteúdo",
        variant: "destructive",
      });
      return;
    }

    try {
      const newPost: Omit<Post, 'id'> = {
        author: user.name,
        authorId: user.id,
        avatar: user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`,
        title: newPostTitle,
        content: newPostContent,
        category: newPostCategory,
        likes: 0,
        likedBy: [],
        timestamp: "Agora",
        createdAt: Date.now(),
      };

      await createPost(newPost);
      await loadPosts();
      
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostCategory("Dúvida");
      setShowNewPost(false);
      
      toast({
        title: "Post criado! 🎉",
        description: "Seu post foi publicado na comunidade",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o post",
        variant: "destructive",
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePostFirestore(postId);
      setPosts(posts.filter(p => p.id !== postId));
      toast({
        title: "Post excluído",
        description: "Seu post foi removido da comunidade",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o post",
        variant: "destructive",
      });
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!user) {
      toast({
        title: "Faça login",
        description: "Você precisa estar logado para comentar",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) return;

    try {
      const comment: Omit<Comment, 'id'> = {
        postId,
        author: user.name,
        authorId: user.id,
        avatar: user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`,
        content: newComment,
        timestamp: "Agora",
        createdAt: Date.now(),
      };

      await createComment(comment);
      await loadComments(postId);
      setNewComment("");
      
      toast({
        title: "Comentário adicionado! 💬",
        description: "Seu comentário foi publicado",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o comentário",
        variant: "destructive",
      });
    }
  };

  const getPostComments = (postId: string) => {
    return comments[postId] || [];
  };

  // Carregar comentários quando expandir post
  useEffect(() => {
    if (expandedPost) {
      loadComments(expandedPost);
    }
  }, [expandedPost]);

  // Filtrar e ordenar posts
  const filteredPosts = posts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "Todos" || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "recent") {
        return b.createdAt - a.createdAt;
      } else {
        return b.likes - a.likes;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen py-8 flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Carregando comunidade...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-primary" />
            Comunidade
          </h1>
          <p className="text-lg text-muted-foreground">
            Compartilhe experiências, dúvidas e conquistas em um espaço seguro
          </p>
        </div>

        {/* Filtros e Busca */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todas Categorias</SelectItem>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="w-full md:w-[200px]">
                <TrendingUp className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Mais Recentes</SelectItem>
                <SelectItem value="popular">Mais Populares</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* New Post Button */}
        <div className="mb-6">
          {!showNewPost ? (
            <Button 
              onClick={() => setShowNewPost(true)}
              size="lg"
              className="w-full bg-gradient-primary hover:opacity-90 gap-2"
              disabled={!user}
            >
              <Plus className="w-5 h-5" />
              {user ? "Criar Novo Post" : "Faça login para criar posts"}
            </Button>
          ) : (
            <Card className="border-2 shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Novo Post</CardTitle>
                    <CardDescription>Compartilhe algo com a comunidade</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowNewPost(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Título do post"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                />
                <Select value={newPostCategory} onValueChange={setNewPostCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Escreva seu post aqui..."
                  rows={4}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button onClick={handleNewPost} className="flex-1 gap-2">
                    <Send className="w-4 h-4" />
                    Publicar
                  </Button>
                  <Button variant="outline" onClick={() => setShowNewPost(false)}>
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <Card className="border-2 text-center py-12">
              <CardContent>
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-muted-foreground">
                  {searchQuery || selectedCategory !== "Todos" 
                    ? "Nenhum post encontrado com esses filtros"
                    : "Seja o primeiro a criar um post!"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredPosts.map((post, index) => {
              const postComments = getPostComments(post.id);
              const isExpanded = expandedPost === post.id;
              const isOwner = user?.id === post.authorId;
              const hasLiked = user ? post.likedBy.includes(user.id) : false;
              
              return (
              <Card 
                key={post.id} 
                className={`border-2 hover-lift animate-fade-in ${post.isHighlighted ? 'border-warning shadow-glow' : ''}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {post.isHighlighted && (
                  <div className="bg-warning/10 border-b border-warning/20 px-6 py-2 flex items-center gap-2">
                    <Star className="w-4 h-4 text-warning" />
                    <span className="text-sm font-medium text-warning">Dúvida da Semana</span>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                      <img src={post.avatar} alt={post.author} className="w-full h-full rounded-full" />
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1">{post.title}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                            <span className="font-medium">{post.author}</span>
                            <span>•</span>
                            <span>{post.timestamp}</span>
                            <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                          </div>
                        </div>
                        {isOwner && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePost(post.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
                  
                  <div className="flex items-center gap-4 pt-2 border-t">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`gap-2 ${hasLiked ? 'text-primary' : ''}`}
                      onClick={() => handleLike(post.id)}
                    >
                      <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
                      {post.likes}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                    >
                      <MessageCircle className="w-4 h-4" />
                      {postComments.length}
                    </Button>
                  </div>

                  {/* Seção de Comentários */}
                  {isExpanded && (
                    <div className="space-y-4 border-t pt-4 animate-slide-down">
                      <h4 className="font-semibold text-sm">Comentários ({postComments.length})</h4>
                      
                      {/* Lista de Comentários */}
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {postComments.map((comment) => (
                          <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-muted/30">
                            <Avatar className="w-8 h-8 rounded-full">
                              <img src={comment.avatar} alt={comment.author} className="w-full h-full rounded-full" />
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 text-sm mb-1">
                                <span className="font-medium">{comment.author}</span>
                                <span className="text-muted-foreground">• {comment.timestamp}</span>
                              </div>
                              <p className="text-sm">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                        {postComments.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            Seja o primeiro a comentar!
                          </p>
                        )}
                      </div>

                      {/* Adicionar Comentário */}
                      {user ? (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Escreva um comentário..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                          />
                          <Button 
                            size="sm"
                            onClick={() => handleAddComment(post.id)}
                            disabled={!newComment.trim()}
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-2">
                          Faça login para comentar
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
          )}
        </div>

        {/* Estatísticas */}
        {filteredPosts.length > 0 && (
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Mostrando {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
            {(searchQuery || selectedCategory !== "Todos") && ` de ${posts.length} total`}
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
