"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Languages, Camera, Zap, Shield, Globe, ArrowRight, Star } from 'lucide-react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: FileText,
      title: "Smart OCR",
      description: "Extract text from images with AI-powered recognition supporting 13+ languages",
      color: "from-blue-500 to-cyan-500",
      link: "/ocr"
    },
    {
      icon: Languages,
      title: "Real-time Translation",
      description: "Instant translation between multiple languages with offline capability",
      color: "from-purple-500 to-pink-500",
      link: "/translator"
    },
    {
      icon: Camera,
      title: "Camera Integration",
      description: "Capture and process images directly from your device camera",
      color: "from-green-500 to-emerald-500",
      link: "/ocr?tab=camera"
    }
  ];

  const stats = [
    { label: "Languages Supported", value: "13+", icon: Globe },
    { label: "Offline Capable", value: "100%", icon: Shield },
    { label: "Processing Speed", value: "Fast", icon: Zap },
    { label: "User Friendly", value: "Easy", icon: Star }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className={`text-center space-y-8 transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 rounded-full text-sm font-medium text-blue-700">
            <Zap size={16} />
            Powered by AI • Works Offline
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent leading-tight">
            Tamil 2
            <br />
            <span className="text-3xl md:text-5xl lg:text-6xl">Language Tools</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Advanced OCR and translation tools that work entirely in your browser. 
            Extract text from images and translate between languages - all offline and secure.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/ocr"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <FileText size={24} />
            Try OCR Now
            <ArrowRight size={20} />
          </Link>
          
          <Link 
            href="/translator"
            className="inline-flex items-center gap-3 bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <Languages size={24} />
            Try Translator
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className={`transform transition-all duration-1000 delay-200 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="text-white" size={24} />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className={`transform transition-all duration-1000 delay-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need for text extraction and translation, built with modern web technologies
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link 
                key={feature.title}
                href={feature.link}
                className="group"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 hover:shadow-2xl transition-all duration-500 hover:scale-105 h-full">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="text-white" size={32} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="flex items-center text-blue-600 font-semibold group-hover:gap-3 transition-all duration-300">
                    Learn more
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Benefits Section */}
      <div className={`transform transition-all duration-1000 delay-400 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        <div className="bg-gradient-to-r from-blue-50 via-white to-purple-50 rounded-3xl p-8 md:p-12 border border-blue-200/50">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Tamil 2?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built with privacy and performance in mind
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">100% Private</h3>
              <p className="text-gray-600">All processing happens in your browser. No data leaves your device.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Optimized algorithms for quick text extraction and translation.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Multi-Language</h3>
              <p className="text-gray-600">Support for 13+ languages including Tamil, English, and more.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className={`text-center transform transition-all duration-1000 delay-500 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Try our tools now - no registration required
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/ocr"
              className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300"
            >
              <FileText size={24} />
              Start with OCR
            </Link>
            
            <Link 
              href="/translator"
              className="inline-flex items-center gap-3 bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg border-2 border-blue-500 hover:bg-blue-800 hover:scale-105 transition-all duration-300"
            >
              <Languages size={24} />
              Try Translator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}