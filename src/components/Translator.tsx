"use client";
import React, { useState } from 'react';
import { LANGUAGES, useTranslator } from '@/hooks/useTranslator';
import { RefreshCw, Languages, ArrowRight, Copy, Volume2 } from 'lucide-react';

export default function Translator() {
  const [input, setInput] = useState('');
  const [from, setFrom] = useState('en');
  const [to, setTo] = useState('ta');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
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
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Enter text to translate
            </label>
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
              {translated && !error && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
                  title="Copy translation"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              )}
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

      {/* Footer */}
      <footer className="mt-8 text-sm text-gray-500 text-center bg-white px-6 py-3 rounded-full shadow-md">
        <div className="flex items-center justify-center gap-2">
          <Languages className="w-4 h-4 text-blue-600" />
          Powered by Google Translate API © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}