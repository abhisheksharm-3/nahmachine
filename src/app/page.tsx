"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCcw, Heart, Bookmark, Github, Info, X, Sparkles, ExternalLink } from "lucide-react";
import { getNoReason, generateAIReason } from "./actions";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useNahMachineStore } from "@/lib/store";
import { CollectionsDrawer } from "@/components/collections-drawer";
import { Button } from "@/components/ui/button";
import { GridBackground } from "@/components/ui/grid-background";

export default function Home() {
  const {
    currentReason,
    isLoading,
    likedReasons,
    savedReasons,
    setCurrentReason,
    setLoading,
    addToRecentReasons,
    addToLikedReasons,
    removeFromLikedReasons,
    addToSavedReasons,
    removeFromSavedReasons
  } = useNahMachineStore();

  const [showAbout, setShowAbout] = useState(false);
  
  const isLiked = currentReason && likedReasons.some(reason => reason.text === currentReason);
  const isSaved = currentReason && savedReasons.some(reason => reason.text === currentReason);
  const canGenerateAI = likedReasons.length > 0 || savedReasons.length > 0;

  // Fetch a new random reason
  const fetchReason = async () => {
    setLoading(true);
    
    try {
      const data = await getNoReason();
      setCurrentReason(data.message);
      
      if (data.message) {
        addToRecentReasons(data.message);
      }
    } catch (error) {
      console.error("Error fetching reason:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate AI reason based on liked/saved reasons
  const generatePersonalizedReason = async () => {
    if (!canGenerateAI) return;
    
    setLoading(true);
    
    try {
      const allReasons = [
        ...new Set([
          ...likedReasons.map(r => r.text),
          ...savedReasons.map(r => r.text)
        ])
      ];
      
      const data = await generateAIReason(allReasons);
      
      if (data.message) {
        setCurrentReason(data.message);
        addToRecentReasons(data.message);
      }
    } catch (error) {
      console.error("Error generating AI reason:", error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle like status for current reason
  const toggleLike = () => {
    if (!currentReason) return;
    
    if (isLiked) {
      removeFromLikedReasons(currentReason);
    } else {
      addToLikedReasons(currentReason);
    }
  };

  // Toggle save status for current reason
  const toggleSave = () => {
    if (!currentReason) return;
    
    if (isSaved) {
      removeFromSavedReasons(currentReason);
    } else {
      addToSavedReasons(currentReason);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    if (!currentReason) {
      fetchReason();
    }
  }, []);

  return (
    <>
      <GridBackground />
      
      <div className="relative min-h-screen flex flex-col items-center justify-center">
        {/* Header controls - extremely minimal */}
        <div className="absolute top-5 right-5 z-20 flex items-center gap-3">
          <Button 
            size="icon" 
            variant="ghost"
            className="h-8 w-8 rounded-full text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            onClick={() => setShowAbout(true)}
          >
            <Info className="h-4 w-4" />
          </Button>
          <ThemeSwitcher />
        </div>
        
        {/* Main content - centered with perfect spacing */}
        <main className="w-full max-w-md px-5 flex flex-col items-center justify-center space-y-8">
          {/* Minimal title */}
          <motion.h1 
            className="text-3xl font-medium tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            nah<span className="text-blue-500">.</span>machine
          </motion.h1>
          
          {/* Main card - ultra minimal */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full"
          >
            <div className="bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800/80 overflow-hidden">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 px-6 flex items-center justify-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="h-6 w-6 border-2 border-zinc-200 dark:border-zinc-700 border-t-blue-500 rounded-full"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 px-6"
                  >
                    <p className="text-xl text-center leading-relaxed">
                      {currentReason}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 dark:border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleLike}
                    disabled={isLoading || !currentReason}
                    className={`p-2 rounded-full transition-colors ${
                      isLiked 
                        ? 'text-rose-500' 
                        : 'text-zinc-400 hover:text-rose-500 dark:text-zinc-500 dark:hover:text-rose-400'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? 'fill-rose-500' : ''}`} />
                  </button>
                  
                  <button
                    onClick={toggleSave}
                    disabled={isLoading || !currentReason}
                    className={`p-2 rounded-full transition-colors ${
                      isSaved 
                        ? 'text-amber-500' 
                        : 'text-zinc-400 hover:text-amber-500 dark:text-zinc-500 dark:hover:text-amber-400'
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-amber-500' : ''}`} />
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={generatePersonalizedReason}
                    disabled={isLoading || !canGenerateAI}
                    className={`p-2 rounded-full transition-colors ${
                      !canGenerateAI || isLoading
                        ? 'text-zinc-300 dark:text-zinc-700' 
                        : 'text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300'
                    }`}
                  >
                    <Sparkles className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={fetchReason}
                    disabled={isLoading}
                    className="p-2 rounded-full text-zinc-700 dark:text-zinc-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                  >
                    <RefreshCcw className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
        
        {/* Collections Drawer */}
        <CollectionsDrawer />
        
        {/* Ultra-minimal footer with links */}
        <footer className="absolute bottom-14 left-0 right-0 text-center">
          <div className="flex items-center justify-center gap-4 mb-2">
            <a 
              href="https://github.com/abhisheksharm-3" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 inline-flex items-center gap-1.5 transition-colors"
            >
              <Github className="h-3 w-3" />
              <span>GitHub</span>
            </a>
            
            <a 
              href="https://abhisheksharma.tech" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 inline-flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              <span>Portfolio</span>
            </a>
          </div>
          <div className="text-xs text-zinc-400">
            © 2025 Abhishek Sharma
          </div>
        </footer>
        
        {/* Minimal about modal */}
        <AnimatePresence>
          {showAbout && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowAbout(false)}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 25 }}
                className="bg-white dark:bg-zinc-900 rounded-2xl p-6 max-w-sm w-full shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">About</h2>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => setShowAbout(false)}
                    className="h-8 w-8 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-300">
                  <p className="leading-relaxed">
                    NahMachine helps you find creative ways to say &quot;no&quot; to things you don&apos;t want to do.
                  </p>
                  
                  <p className="leading-relaxed">
                    Like or save your favorite excuses to get personalized AI-powered suggestions from Gemini.
                  </p>
                  
                  <p className="text-xs text-zinc-400">
                    Created by <a 
                      href="https://github.com/abhisheksharm-3" 
                      className="text-blue-500 hover:underline" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >Abhishek Sharma</a>
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}