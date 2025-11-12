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

interface TextToSpeechProps {
  text: string;
  className?: string;
}

const TextToSpeech = ({ text, className = "" }: TextToSpeechProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [rate, setRate] = useState<number>(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Carregar vozes disponíveis
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      // Priorizar vozes em português
      const ptVoices = availableVoices.filter(
        (voice) => voice.lang.startsWith("pt")
      );
      const allVoices = ptVoices.length > 0 ? ptVoices : availableVoices;
      setVoices(allVoices);

      // Carregar preferências salvas
      const savedVoice = localStorage.getItem("tts-voice");
      const savedRate = localStorage.getItem("tts-rate");

      if (savedVoice && allVoices.find((v) => v.name === savedVoice)) {
        setSelectedVoice(savedVoice);
      } else if (allVoices.length > 0) {
        setSelectedVoice(allVoices[0].name);
      }

      if (savedRate) {
        setRate(parseFloat(savedRate));
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

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

    // Limpar texto para melhor leitura
    const cleanText = text
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/\s+/g, " ") // Remove espaços extras
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;

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
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const handleVoiceChange = (voiceName: string) => {
    setSelectedVoice(voiceName);
    localStorage.setItem("tts-voice", voiceName);
  };

  const handleRateChange = (newRate: number[]) => {
    const rateValue = newRate[0];
    setRate(rateValue);
    localStorage.setItem("tts-rate", rateValue.toString());
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
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
            : "Ouvir texto"
        }
        aria-live="polite"
      >
        {isSpeaking && !isPaused ? (
          <>
            <Pause className="w-4 h-4" />
            <span className="hidden sm:inline">Pausar</span>
          </>
        ) : isPaused ? (
          <>
            <Play className="w-4 h-4" />
            <span className="hidden sm:inline">Continuar</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">Ouvir</span>
          </>
        )}
      </Button>

      {isSpeaking && (
        <Button
          onClick={handleStop}
          size="sm"
          variant="ghost"
          className="gap-2"
          aria-label="Parar leitura"
        >
          <VolumeX className="w-4 h-4" />
          <span className="hidden sm:inline">Parar</span>
        </Button>
      )}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            aria-label="Configurações de voz"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="voice-select">Voz</Label>
              <Select value={selectedVoice} onValueChange={handleVoiceChange}>
                <SelectTrigger id="voice-select">
                  <SelectValue placeholder="Selecione uma voz" />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((voice) => (
                    <SelectItem key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate-slider">
                Velocidade: {rate.toFixed(1)}x
              </Label>
              <Slider
                id="rate-slider"
                min={0.5}
                max={2}
                step={0.1}
                value={[rate]}
                onValueChange={handleRateChange}
                aria-label="Ajustar velocidade da fala"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Devagar (0.5x)</span>
                <span>Rápido (2x)</span>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TextToSpeech;
