"use client";

import React, { useState, useRef } from "react";
import Tesseract from "tesseract.js";
import { Camera, Upload, FileText, Settings, Loader2, X, Copy } from "lucide-react";
import Image from "next/image";

const languages = [
  { code: "tam", name: "Tamil" },
  { code: "eng", name: "English" },
  { code: "spa", name: "Spanish" },
  { code: "fra", name: "French" },
  { code: "deu", name: "German" },
  { code: "ita", name: "Italian" },
  { code: "por", name: "Portuguese" },
  { code: "rus", name: "Russian" },
  { code: "chi_sim", name: "Chinese (Simplified)" },
  { code: "jpn", name: "Japanese" },
  { code: "kor", name: "Korean" },
  { code: "ara", name: "Arabic" },
  { code: "hin", name: "Hindi" }
];

export default function OCR() {
  const [image, setImage] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  
  // New state for enhanced features
  const [imageUrl, setImageUrl] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState("eng");
  const [activeTab, setActiveTab] = useState<"file" | "camera">("file");
  const [showSettings, setShowSettings] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Original functionality preserved
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
      setText(""); // reset previous text
      setProgress(0);
    }
  };

  const handleOCR = () => {
    if (!image) return;

    Tesseract.recognize(image, selectedLanguage, {
      logger: (m) => {
        if (m.status === "recognizing text") setProgress(Math.round(m.progress * 100));
      },
    })
      .then(({ data: { text } }) => {
        setText(text);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // New camera functionality
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      setStream(mediaStream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
            setImage(file);
            setImageUrl(URL.createObjectURL(file));
            setText(""); // reset previous text
            setProgress(0);
            stopCamera();
            setActiveTab("file");
          }
        }, "image/jpeg", 0.9);
      }
    }
  };

  const clearImage = () => {
    setImage(null);
    setImageUrl("");
    setText("");
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const copyText = () => {
    if (text) {
      navigator.clipboard.writeText(text);
      alert("Text copied to clipboard!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="text-blue-600" />
            Client-Side OCR
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Works fully offline in your browser. No data leaves your device.
          </p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Settings size={24} />
        </button>
      </div>

      {/* Language Settings */}
      {showSettings && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border">
          <h3 className="font-semibold text-gray-900 mb-3">Language Settings</h3>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => {
            setActiveTab("file");
            if (isCameraActive) stopCamera();
          }}
          className={`flex-1 py-3 px-4 rounded-md font-medium transition-all flex items-center justify-center gap-2 ${
            activeTab === "file"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Upload size={20} />
          Upload File
        </button>
        <button
          onClick={() => setActiveTab("camera")}
          className={`flex-1 py-3 px-4 rounded-md font-medium transition-all flex items-center justify-center gap-2 ${
            activeTab === "camera"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Camera size={20} />
          Use Camera
        </button>
      </div>

      {/* File Upload Tab */}
      {activeTab === "file" && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <Upload className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 mb-4">
              Drop an image here or click to browse
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors inline-block font-medium"
            >
              Choose File
            </label>
          </div>
        </div>
      )}

      {/* Camera Tab */}
      {activeTab === "camera" && (
        <div className="space-y-4">
          <div className="bg-black rounded-lg overflow-hidden relative">
            {!isCameraActive ? (
              <div className="aspect-video flex items-center justify-center text-white">
                <div className="text-center">
                  <Camera size={64} className="mx-auto mb-4 text-gray-400" />
                  <p className="mb-4">Camera not active</p>
                  <button
                    onClick={startCamera}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Start Camera
                  </button>
                </div>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                  <button
                    onClick={capturePhoto}
                    className="bg-white text-black px-6 py-3 rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2 font-medium"
                  >
                    <Camera size={20} />
                    Capture
                  </button>
                  <button
                    onClick={stopCamera}
                    className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-colors flex items-center gap-2 font-medium"
                  >
                    <X size={20} />
                    Stop
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Image Preview */}
      {imageUrl && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Image Preview</h3>
            <button
              onClick={clearImage}
              className="text-red-600 hover:text-red-700 flex items-center gap-1 font-medium"
            >
              <X size={16} />
              Clear
            </button>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt="Preview"
              width={600} // Add width prop
  height={400}
              className="w-full max-h-96 object-contain bg-gray-50"
            />
          </div>
        </div>
      )}

      {/* OCR Button - Original functionality preserved */}
      <button
        onClick={handleOCR}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium mt-4"
        disabled={!image}
      >
        {progress > 0 && progress < 100 ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <FileText size={20} />
        )}
        {progress > 0 && progress < 100 ? "Processing..." : "Start OCR"}
      </button>

      {/* Progress Bar - Original functionality preserved */}
      {progress > 0 && progress < 100 && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress:</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Results - Original functionality preserved with enhanced UI */}
      {text && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              <strong>Recognized Text:</strong>
            </h3>
            <button
              onClick={copyText}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 font-medium"
            >
              <Copy size={16} />
              Copy
            </button>
          </div>
          <div className="p-4 border bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
            <p className="whitespace-pre-wrap text-gray-900">{text}</p>
          </div>
        </div>
      )}

      {/* Hidden Canvas for Camera Capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}