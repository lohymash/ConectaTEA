import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Edit, Save, Trophy, Star, Gamepad2, MessageCircle } from "lucide-react";

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
  });

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
    toast({
      title: "Perfil atualizado! ✅",
      description: "Suas informações foram salvas com sucesso",
    });
  };

  const stats = [
    { icon: Star, label: "Nível", value: user?.level || 1, color: "text-warning" },
    { icon: Trophy, label: "XP Total", value: user?.xp || 0, color: "text-primary" },
    { icon: Gamepad2, label: "Jogos", value: 42, color: "text-secondary" },
    { icon: MessageCircle, label: "Posts", value: 15, color: "text-accent" },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <User className="w-8 h-8 text-primary" />
            Meu Perfil
          </h1>
          <p className="text-lg text-muted-foreground">
            Gerencie suas informações e acompanhe seu progresso
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="border-2 shadow-soft text-center">
              <CardHeader>
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center text-5xl shadow-glow">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full" />
                  ) : "👤"}
                </div>
                <CardTitle className="text-2xl">{user?.name}</CardTitle>
                <CardDescription className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Badge className="w-full justify-center py-2 bg-gradient-primary text-lg">
                  Nível {user?.level || 1}
                </Badge>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={logout}
                >
                  Sair
                </Button>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="border-2 mt-6">
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className="p-3 rounded-lg bg-muted/50 text-center"
                  >
                    <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Info Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Informações Pessoais</CardTitle>
                    <CardDescription>Gerencie seus dados pessoais</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-4 h-4" />
                        Salvar
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4" />
                        Editar
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    O email não pode ser alterado
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biografia</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    placeholder="Conte um pouco sobre você..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Achievements Card */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-warning" />
                  Conquistas Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { title: "Primeiro Post", unlocked: true },
                    { title: "10 Jogos", unlocked: true },
                    { title: "5 Comentários", unlocked: true },
                    { title: "Nível 2", unlocked: false },
                  ].map((achievement, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg text-center transition-all ${
                        achievement.unlocked
                          ? "bg-gradient-primary text-white shadow-soft"
                          : "bg-muted opacity-50"
                      }`}
                    >
                      <Trophy className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm font-medium">{achievement.title}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-2 border-destructive/20">
              <CardHeader>
                <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
                <CardDescription>
                  Ações irreversíveis relacionadas à sua conta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" className="w-full sm:w-auto">
                  Excluir Conta
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
