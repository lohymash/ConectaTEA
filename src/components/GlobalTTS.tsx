import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Pause, Play, Settings } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const GlobalTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [rate, setRate] = useState<number>(1);
  const [pitch, setPitch] = useState<number>(1);
  const [volume, setVolume] = useState<number>(1);
  const [voiceGender, setVoiceGender] = useState<"all" | "male" | "female">("all");
  const { toast } = useToast();

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const ptVoices = availableVoices.filter((voice) => voice.lang.startsWith("pt"));
      const allVoices = ptVoices.length > 0 ? ptVoices : availableVoices;
      setVoices(allVoices);

      const savedVoice = localStorage.getItem("global-tts-voice");
      const savedRate = localStorage.getItem("global-tts-rate");
      const savedPitch = localStorage.getItem("global-tts-pitch");
      const savedVolume = localStorage.getItem("global-tts-volume");
      const savedGender = localStorage.getItem("global-tts-gender");

      if (savedVoice && allVoices.find((v) => v.name === savedVoice)) {
        setSelectedVoice(savedVoice);
      } else if (allVoices.length > 0) {
        setSelectedVoice(allVoices[0].name);
      }

      if (savedRate) setRate(parseFloat(savedRate));
      if (savedPitch) setPitch(parseFloat(savedPitch));
      if (savedVolume) setVolume(parseFloat(savedVolume));
      if (savedGender) setVoiceGender(savedGender as "all" | "male" | "female");
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      try {
        window.speechSynthesis.cancel();
      } catch (error) {
        console.error("Error cleaning up speech synthesis:", error);
      }
    };
  }, []);

  const getPageText = () => {
    const mainContent = document.querySelector("main") || document.body;
    const clone = mainContent.cloneNode(true) as HTMLElement;

    // Remove elementos que não devem ser lidos
    const elementsToRemove = clone.querySelectorAll(
      'script, style, nav, header, footer, [role="navigation"], [aria-hidden="true"], .no-tts'
    );
    elementsToRemove.forEach((el) => el.remove());

    // Pegar texto limpo
    let text = clone.textContent || "";
    text = text.replace(/\s+/g, " ").trim();

    return text;
  };

  const handleSpeak = () => {
    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      return;
    }

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    const text = getPageText();

    if (!text) {
      toast({
        title: "Nenhum conteúdo",
        description: "Não há texto disponível para leitura nesta página",
        variant: "destructive",
      });
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      toast({
        title: "Erro na leitura",
        description: "Não foi possível ler o conteúdo",
        variant: "destructive",
      });
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    try {
      window.speechSynthesis.cancel();
    } catch (error) {
      console.error("Error stopping speech:", error);
    } finally {
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  const handleVoiceChange = (voiceName: string) => {
    setSelectedVoice(voiceName);
    localStorage.setItem("global-tts-voice", voiceName);
  };

  const handleRateChange = (newRate: number[]) => {
    setRate(newRate[0]);
    localStorage.setItem("global-tts-rate", newRate[0].toString());
  };

  const handlePitchChange = (newPitch: number[]) => {
    setPitch(newPitch[0]);
    localStorage.setItem("global-tts-pitch", newPitch[0].toString());
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume[0]);
    localStorage.setItem("global-tts-volume", newVolume[0].toString());
  };

  const handleGenderChange = (gender: "all" | "male" | "female") => {
    setVoiceGender(gender);
    localStorage.setItem("global-tts-gender", gender);
  };

  const getFilteredVoices = () => {
    if (voiceGender === "all") return voices;
    
    return voices.filter((voice) => {
      const name = voice.name.toLowerCase();
      const isFemale = name.includes("female") || name.includes("woman") || 
                       name.includes("luciana") || name.includes("francisca");
      const isMale = name.includes("male") || name.includes("man") || 
                     name.includes("felipe") || name.includes("google português");
      
      if (voiceGender === "female") return isFemale;
      if (voiceGender === "male") return isMale || !isFemale;
      return true;
    });
  };

  return (
    <div 
      className="fixed left-4 bottom-20 z-40 flex flex-col gap-2 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-2 shadow-lg"
      role="toolbar"
      aria-label="Leitura de tela"
    >
      <Button
        onClick={handleSpeak}
        size="sm"
        variant={isSpeaking ? "default" : "outline"}
        className={`gap-2 ${isSpeaking ? "animate-pulse" : ""}`}
        aria-label={
          isSpeaking && !isPaused
            ? "Pausar leitura"
            : isPaused
            ? "Continuar leitura"
            : "Ler página"
        }
      >
        {isSpeaking && !isPaused ? (
          <Pause className="w-4 h-4" />
        ) : isPaused ? (
          <Play className="w-4 h-4" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
      </Button>

      {isSpeaking && (
        <Button
          onClick={handleStop}
          size="sm"
          variant="outline"
          aria-label="Parar leitura"
        >
          <VolumeX className="w-4 h-4" />
        </Button>
      )}

      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" variant="outline" aria-label="Configurações de voz">
            <Settings className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Gênero da Voz</Label>
              <Select value={voiceGender} onValueChange={handleGenderChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="male">Masculina</SelectItem>
                  <SelectItem value="female">Feminina</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="voice-select">Voz Específica</Label>
              <Select value={selectedVoice} onValueChange={handleVoiceChange}>
                <SelectTrigger id="voice-select">
                  <SelectValue placeholder="Selecione uma voz" />
                </SelectTrigger>
                <SelectContent>
                  {getFilteredVoices().map((voice) => (
                    <SelectItem key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate-slider">Velocidade: {rate.toFixed(1)}x</Label>
              <Slider
                id="rate-slider"
                min={0.5}
                max={2}
                step={0.1}
                value={[rate]}
                onValueChange={handleRateChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pitch-slider">Tom: {pitch.toFixed(1)}</Label>
              <Slider
                id="pitch-slider"
                min={0.5}
                max={2}
                step={0.1}
                value={[pitch]}
                onValueChange={handlePitchChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="volume-slider">Volume: {Math.round(volume * 100)}%</Label>
              <Slider
                id="volume-slider"
                min={0}
                max={1}
                step={0.1}
                value={[volume]}
                onValueChange={handleVolumeChange}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default GlobalTTS;
