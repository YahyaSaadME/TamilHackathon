'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseSpeechSynthesisReturn {
  speak: (text: string) => void;
  cancel: () => void;
  isSpeaking: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setSelectedVoice: (voice: SpeechSynthesisVoice) => void;
  rate: number;
  setRate: (rate: number) => void;
  pitch: number;
  setPitch: (pitch: number) => void;
  volume: number;
  setVolume: (volume: number) => void;
  browserSupportsSpeechSynthesis: boolean;
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [browserSupportsSpeechSynthesis, setBrowserSupportsSpeechSynthesis] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setBrowserSupportsSpeechSynthesis(true);

      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices();
        setVoices(availableVoices);
        
        // Set default voice to English if available
        const englishVoice = availableVoices.find(voice => 
          voice.lang.startsWith('en')
        );
        if (englishVoice && !selectedVoice) {
          setSelectedVoice(englishVoice);
        }
      };

      loadVoices();
      speechSynthesis.addEventListener('voiceschanged', loadVoices);

      return () => {
        speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      };
    }
  }, [selectedVoice]);

  const speak = useCallback((text: string) => {
    if (!browserSupportsSpeechSynthesis || !text.trim()) return;

    // Cancel any existing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };

    speechSynthesis.speak(utterance);
  }, [browserSupportsSpeechSynthesis, selectedVoice, rate, pitch, volume]);

  const cancel = useCallback(() => {
    if (browserSupportsSpeechSynthesis) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [browserSupportsSpeechSynthesis]);

  return {
    speak,
    cancel,
    isSpeaking,
    voices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
    pitch,
    setPitch,
    volume,
    setVolume,
    browserSupportsSpeechSynthesis,
  };
}