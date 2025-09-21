"use client";
import React, { useState } from 'react';
import { LANGUAGES, useTranslator } from '@/hooks/useTranslator';
import { RefreshCw, Languages, ArrowRight, Copy, Volume2, Mic, Speaker } from 'lucide-react';

// Type declarations for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }

  interface SpeechRecognition extends EventTarget {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    onstart: () => void;
    onend: () => void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    start(): void;
    stop(): void;
  }
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

export default function Translator() {
  const [input, setInput] = useState('');
  const [from, setFrom] = useState('en');
  const [to, setTo] = useState('ta');
  const [isListening, setIsListening] = useState(false);
  const { loading, translated, error, translateText } = useTranslator();

  const handleTranslate = () => {
    if (input.trim()) translateText(input, from, to);
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
    if (translated) setInput(translated);
  };

  const handleCopy = () => {
    if (translated) {
      navigator.clipboard.writeText(translated);
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = from;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const speakText = () => {
    if (!translated) return;
    const utterance = new SpeechSynthesisUtterance(translated);
    const voices = speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(to.split('-')[0]));
    if (voice) utterance.voice = voice;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen  flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
          <div className="flex items-center justify-center gap-3">
            <Languages className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">Universal Translator</h1>
          </div>
          <p className="text-blue-100 text-center mt-2">Translate text between languages instantly</p>
        </div>

        <div className="p-8">
          {/* Language Selection */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-700">
                <Volume2 className="w-4 h-4 text-blue-600" />
                From
              </label>
              <select
                value={from}
                onChange={e => setFrom(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              >
                {Object.entries(LANGUAGES).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col items-center pt-6">
              <button
                type="button"
                onClick={handleSwap}
                className="p-3 bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                title="Swap languages"
              >
                <RefreshCw className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <div className="flex-1">
              <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-700">
                <ArrowRight className="w-4 h-4 text-blue-600" />
                To
              </label>
              <select
                value={to}
                onChange={e => setTo(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              >
                {Object.entries(LANGUAGES).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Input Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">
                Enter text to translate
              </label>
              <button
                type="button"
                onClick={startListening}
                disabled={isListening}
                className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-50"
                title="Speak to input text"
              >
                <Mic className={`w-4 h-4 ${isListening ? 'animate-pulse text-red-500' : ''}`} />
                {isListening ? 'Listening...' : 'Listen'}
              </button>
            </div>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              rows={4}
              placeholder="Type your text here..."
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
            />
          </div>

          {/* Translate Button */}
          <button
            type="button"
            onClick={handleTranslate}
            disabled={loading || !input.trim()}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Translating...
              </>
            ) : (
              <>
                <Languages className="w-5 h-5" />
                Translate
              </>
            )}
          </button>

          {/* Translation Output */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Translation</label>
              <div className="flex items-center gap-2">
                {translated && !error && (
                  <>
                    <button
                      type="button"
                      onClick={speakText}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all"
                      title="Speak translation"
                    >
                      <Speaker className="w-4 h-4" />
                      Speak
                    </button>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
                      title="Copy translation"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="min-h-[100px] p-4 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-800 flex items-center">
              {error ? (
                <span className="text-red-600 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  {error}
                </span>
              ) : translated ? (
                <span className="text-gray-800 leading-relaxed">{translated}</span>
              ) : (
                <span className="text-gray-400 italic">Your translation will appear here...</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}