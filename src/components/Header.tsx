import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon, User, Home, Users, Gamepad2, BookOpen, Info } from "lucide-react";
import favicon from "@/assets/favicon.png"; 
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const Header = ({ isDark, toggleTheme }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Início", icon: Home },
    { path: "/community", label: "Comunidade", icon: Users },
    { path: "/games", label: "Jogos", icon: Gamepad2 },
    { path: "/articles", label: "Artigos", icon: BookOpen },
    { path: "/about", label: "Sobre nós", icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <nav className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-soft group-hover:shadow-glow transition-all">
              <img src={favicon} alt="ConectaTEA logo" className="w-8 h-8" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              ConectaTEA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover-lift ${
                  isActive(path)
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
              aria-label="Alternar tema"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {/* ✅ Só mostra "Perfil" se logado */}
            {user && (
              <Link to="/profile">
                <Button variant="outline" className="gap-2">
                  <User className="w-4 h-4" />
                  Perfil
                </Button>
              </Link>
            )}

            {/* ✅ Só mostra "Entrar" se NÃO logado */}
            {!user && (
              <Link to="/auth">
                <Button className="gap-2 bg-gradient-primary hover:opacity-90">
                  Entrar
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-full"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-slide-up">
            <div className="flex flex-col gap-2">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive(path)
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              ))}

              <div className="h-px bg-border my-2" />

              {/* ✅ Só mostra se logado */}
              {user && (
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-foreground hover:bg-muted transition-all"
                >
                  <User className="w-5 h-5" />
                  Perfil
                </Link>
              )}

              {/* ✅ Só mostra se NÃO logado */}
              {!user && (
                <Link
                  to="/auth"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button className="w-full gap-2 bg-gradient-primary">
                    Entrar
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
