'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import type { ChatMessage } from '@/app/api/chat/route';

interface VoiceBotProps {
  className?: string;
}

export default function VoiceBot({ className = '' }: VoiceBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Speech recognition and synthesis hooks
  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const {
    speak,
    cancel: cancelSpeech,
    isSpeaking,
    browserSupportsSpeechSynthesis,
  } = useSpeechSynthesis();

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle speech recognition transcript
  useEffect(() => {
    if (transcript && !isListening) {
      setInputText(transcript);
      resetTranscript();
    }
  }, [transcript, isListening, resetTranscript]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = { role: 'assistant', content: data.message };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Speak the response
      if (browserSupportsSpeechSynthesis) {
        speak(data.message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      if (isSpeaking) {
        cancelSpeech();
      }
      startListening();
    }
  };

  const handleSpeechToggle = () => {
    if (isSpeaking) {
      cancelSpeech();
    }
  };

  return (
    <div className={`flex flex-col h-screen bg-gray-50 ${className}`}>
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p>Start a conversation!</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-900 shadow-sm border'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-900 shadow-sm border p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? "Listening..." : "Type a message..."}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
              disabled={isLoading}
            />
            {transcript && isListening && (
              <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                {transcript}
              </div>
            )}
          </div>

          {/* Voice Controls */}
          <div className="flex gap-2">
            {browserSupportsSpeechRecognition && (
              <button
                type="button"
                onClick={handleVoiceToggle}
                className={`p-3 rounded-lg transition-colors ${
                  isListening
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )}

            {browserSupportsSpeechSynthesis && (
              <button
                type="button"
                onClick={handleSpeechToggle}
                className={`p-3 rounded-lg transition-colors ${
                  isSpeaking
                    ? 'bg-orange-600 text-white hover:bg-orange-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            )}

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Browser Support Messages */}
        <div className="mt-2 text-sm text-gray-500">
          {!browserSupportsSpeechRecognition && (
            <p>⚠️ Speech recognition not supported in this browser</p>
          )}
          {!browserSupportsSpeechSynthesis && (
            <p>⚠️ Text-to-speech not supported in this browser</p>
          )}
        </div>
      </div>
    </div>
  );
}