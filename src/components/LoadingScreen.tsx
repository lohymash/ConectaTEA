import { Puzzle } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-hero flex items-center justify-center z-50">
      <div className="text-center space-y-6 animate-fade-in">
        <div className="relative">
          <Puzzle 
            className="w-20 h-20 mx-auto text-primary animate-bounce-gentle" 
            strokeWidth={1.5}
          />
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse-soft" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">ConectaTEA</h2>
          <p className="text-muted-foreground animate-pulse-soft">Conectando com você...</p>
        </div>
        <div className="flex gap-2 justify-center">
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce-gentle" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce-gentle" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce-gentle" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
