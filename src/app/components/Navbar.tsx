"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center px-6 z-30 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-blue-600">Tamil 2</span>
        <span className="text-sm text-gray-500 font-mono">Hackathon</span>
      </div>
      <div className="ml-auto flex gap-6">
        <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</Link>
        <Link href="/ocr" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">OCR</Link>
        <Link href="/translator" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Translator</Link>
      </div>
    </nav>
  );
}
