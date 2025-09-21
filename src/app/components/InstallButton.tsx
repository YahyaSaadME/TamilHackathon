"use client";

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setIsInstalled(true);
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferred prompt
    setDeferredPrompt(null);
    setIsInstallable(false);
    setShowInstallPrompt(false);
  };

  const handleShowInstallPrompt = () => {
    setShowInstallPrompt(true);
  };

  const handleDismissPrompt = () => {
    setShowInstallPrompt(false);
  };

  // Don't show anything if already installed or not installable
  if (isInstalled || (!isInstallable && !showInstallPrompt)) {
    return null;
  }

  return (
    <>
      {/* Install Button */}
      <button
        onClick={isInstallable ? handleInstallClick : handleShowInstallPrompt}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
        title="Install Tamil 2 as an app"
      >
        <Download size={18} />
        Install App
      </button>

      {/* Install Prompt Modal */}
      {showInstallPrompt && !isInstallable && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Install Tamil 2</h3>
              <button
                onClick={handleDismissPrompt}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">T2</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Tamil 2</div>
                  <div className="text-sm text-gray-600">AI Language Tools</div>
                </div>
              </div>

              <p className="text-gray-600 text-sm">
                Install Tamil 2 for the best experience. You&apos;ll be able to use OCR and translation features even when offline!
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleDismissPrompt}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Not Now
                </button>
                <button
                  onClick={() => {
                    setShowInstallPrompt(false);
                    // Try to trigger install prompt again (may not work on all browsers)
                    window.location.reload();
                  }}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}