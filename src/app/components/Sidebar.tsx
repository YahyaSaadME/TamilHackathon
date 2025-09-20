"use client";
import Link from "next/link";
import { Home, FileText, Languages } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: <Home size={20} /> },
  { href: "/ocr", label: "OCR", icon: <FileText size={20} /> },
  { href: "/translator", label: "Translator", icon: <Languages size={20} /> },
];

export default function Sidebar() {
  return (
    <aside className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-56 bg-white border-r border-gray-200 flex flex-col py-8 px-4 z-20 shadow-sm">
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-all"
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto text-xs text-gray-400 px-4 pt-8">
        &copy; {new Date().getFullYear()} Tamil 2 Hackathon
      </div>
    </aside>
  );
}
