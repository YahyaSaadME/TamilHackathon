// components/Translator.tsx
"use client";

import { useState, useEffect } from "react";
// Import the correct type from the library
import type { TranslationPipeline } from "@xenova/transformers";

// Define the options type for the translation pipeline
// interface TranslationPipelineOptions {
//   src_lang?: string;
//   tgt_lang?: string;
//   progress_callback?: (progress: ProgressInfo) => void;
//   [key: string]: unknown; // Allow other options if needed
// }

// Define the progress info type
interface ProgressInfo {
  progress: number; // 0 to 1
  status?: string;
  [key: string]: unknown; // Allow other properties
}

export default function Translator() {
  // Use the imported type here
  const [translator, setTranslator] = useState<TranslationPipeline | null>(null);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load the model once on client
  useEffect(() => {
    const loadModel = async () => {
      setLoading(true);
      setError(null);
      try {
        if (typeof window !== "undefined") {
          const { pipeline, env } = await import("@xenova/transformers");
          
          // Configure the environment (optional but recommended)
          env.allowLocalModels = false;
          env.allowRemoteModels = true;

          // Use a working translation model - here are several options:
          // Option 1: NLLB (multilingual, larger but more accurate)
          // const modelId = "Xenova/nllb-200-distilled-600M";
          
          // Option 2: Opus models (smaller, specific language pairs)
          const modelId = "Xenova/opus-mt-en-es"; // English to Spanish
          
          // Option 3: T5 fine-tuned for translation
          // const modelId = "Xenova/t5-small";
          
          const isCached = localStorage.getItem("translator-downloaded") === "true";
          if (!isCached) {
            alert("Downloading translation model. This may take a moment.");
          }

          // Create the pipeline with proper error handling
          const model = await pipeline("translation", modelId, {
            // Add progress callback
            progress_callback: (progress: ProgressInfo) => {
              console.log("Model loading progress:", progress);
            }
          });

          if (!model) {
            throw new Error("Failed to initialize translation pipeline");
          }

          setTranslator(model); // model matches imported TranslationPipeline type
          localStorage.setItem("translator-downloaded", "true");
        } else {
          throw new Error("Model loading only supported in browser environment");
        }
      } catch (e: unknown) {
        console.error("Model loading error:", e);
        const errorMessage = e instanceof Error ? e.message : String(e);
        setError(`Failed to load translation model: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    loadModel();
  }, []);

  const handleTranslate = async () => {
    if (!translator || !input.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // For Opus models, no language specification needed (they're pre-configured)
      // For NLLB models, you would need: { src_lang: "eng_Latn", tgt_lang: "spa_Latn" }
      const result = await translator(input);
      
      if (result && result.length > 0 && Object(result[0]).translation_text) {
        setOutput(Object(result[0]).translation_text);
      }
    } catch (e: unknown) {
      console.error("Translation error:", e);
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(`Translation failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Client-side Translator</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter text to translate (English to Spanish):
        </label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          placeholder="Enter English text to translate to Spanish..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      
      <button
        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-md transition-colors"
        onClick={handleTranslate}
        disabled={loading || !translator || !input.trim()}
      >
        {loading ? "Translating..." : "Translate"}
      </button>
      
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Translation:
        </label>
        <div className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 min-h-[100px]">
          {output || "Translation will appear here"}
        </div>
      </div>
      
      {loading && !error && (
        <div className="mt-4 text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">
            {translator ? "Translating..." : "Loading model..."}
          </span>
        </div>
      )}
    </div>
  );
}