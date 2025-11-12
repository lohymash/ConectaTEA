import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Volume2, VolumeX, ExternalLink, Minus, Plus, Type } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface ArticleReaderProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  url: string;
  source: string;
}

const ArticleReader = ({ isOpen, onClose, title, content, url, source }: ArticleReaderProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const { toast } = useToast();
  const [fullContent, setFullContent] = useState(content);
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  const increaseFontSize = () => {
    if (fontSize < 24) {
      setFontSize(prev => prev + 2);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 12) {
      setFontSize(prev => prev - 2);
    }
  };

useEffect(() => {
  return () => {
    try {
      window.speechSynthesis.cancel();
    } catch (error) {
      console.error("Error cleaning up speech:", error);
    }
  };
}, []);

// Sincroniza conteúdo inicial
useEffect(() => {
  setFullContent(content || "");
}, [content]);

// Busca conteúdo completo para Wikipedia quando necessário
useEffect(() => {
  if (!isOpen || !url) return;

  const hasFull = (content && content.length > 400) || (fullContent && fullContent.length > 400);
  if (hasFull) return;

  const isWikipedia = url.includes("wikipedia.org/wiki/");
  if (!isWikipedia) return;

  const fetchContent = async () => {
    try {
      setIsLoadingContent(true);
      const u = new URL(url);
      const lang = u.host.split(".")[0];
      const titlePath = decodeURIComponent(u.pathname.replace("/wiki/", ""));
      const api = `https://${lang}.wikipedia.org/api/rest_v1/page/plain/${encodeURIComponent(titlePath)}`;
      const res = await fetch(api);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      if (text && text.trim()) {
        setFullContent(text.trim());
      }
    } catch (e) {
      console.error("Conteúdo completo indisponível", e);
      toast({
        title: "Conteúdo completo indisponível",
        description: "Abrir o original pode ajudar.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingContent(false);
    }
  };

  fetchContent();
}, [isOpen, url, content, fullContent, toast]);

  const handleSpeak = () => {
    if (isSpeaking) {
      try {
        window.speechSynthesis.cancel();
      } catch (error) {
        console.error("Error stopping speech:", error);
      }
      setIsSpeaking(false);
      return;
    }

    const fullText = `${title}. ${fullContent || ""}`;
    const utterance = new SpeechSynthesisUtterance(fullText);
    
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find(v => v.lang.startsWith("pt"));
    if (ptVoice) utterance.voice = ptVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      toast({
        title: "Erro na leitura",
        description: "Não foi possível ler o artigo",
        variant: "destructive",
      });
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      toast({
        title: "Erro na leitura",
        description: "Não foi possível iniciar a leitura",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    try {
      window.speechSynthesis.cancel();
    } catch (error) {
      console.error("Error stopping speech on close:", error);
    }
    setIsSpeaking(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl pr-8">{title}</DialogTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
            <span>{source}</span>
          </div>
        </DialogHeader>
        
        <ScrollArea className="h-[50vh] pr-4">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {isLoadingContent ? (
              <p className="text-muted-foreground">Carregando conteúdo completo...</p>
            ) : (
              <p className="whitespace-pre-wrap leading-relaxed" style={{ fontSize: `${fontSize}px` }}>
                {fullContent}
              </p>
            )}
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between pt-4 border-t gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSpeak}
              variant={isSpeaking ? "default" : "outline"}
              className="gap-2"
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  Parar
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  Ouvir
                </>
              )}
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-lg overflow-hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={decreaseFontSize}
                disabled={fontSize <= 12}
                className="gap-1.5 rounded-none border-r h-9 px-3"
                title="Diminuir tamanho do texto"
              >
                <Type className="w-3.5 h-3.5" />
                <Minus className="w-3 h-3" />
              </Button>
              <div className="px-3 text-sm text-muted-foreground bg-muted/30 h-9 flex items-center">
                {fontSize}px
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={increaseFontSize}
                disabled={fontSize >= 24}
                className="gap-1.5 rounded-none border-l h-9 px-3"
                title="Aumentar tamanho do texto"
              >
                <Type className="w-4 h-4" />
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => window.open(url, "_blank")}
            >
              <ExternalLink className="w-4 h-4" />
              Original
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleReader;
