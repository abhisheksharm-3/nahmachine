"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { RefreshCcw, Heart, Bookmark, Github, Info, X, Sparkles, ExternalLink, Copy, Share2, Check, KeyRound } from "lucide-react";
import { getNoReason, generateAIReason } from "./actions";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useNahMachineStore } from "@/lib/store";
import { CollectionsDrawer } from "@/components/collections-drawer";
import { Button } from "@/components/ui/button";
import { GridBackground } from "@/components/ui/grid-background";
import { toast } from "sonner";
import { useHotkeys } from "react-hotkeys-hook";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const [copied, setCopied] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  
  const isLiked = currentReason && likedReasons.some(reason => reason.text === currentReason);
  const isSaved = currentReason && savedReasons.some(reason => reason.text === currentReason);
  const canGenerateAI = likedReasons.length > 0 || savedReasons.length > 0;

  // Fetch a new random reason
  const fetchReason = async () => {
    setLoading(true);
    
    // Subtle animation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      const data = await getNoReason();
      setCurrentReason(data.message);
      
      if (data.message) {
        addToRecentReasons(data.message);
      }
    } catch (error) {
      console.error("Error fetching reason:", error);
      toast.error("Failed to get a new reason");
    } finally {
      setLoading(false);
    }
  };

  // Generate AI reason based on liked/saved reasons
  const generatePersonalizedReason = async () => {
    if (!canGenerateAI) {
      toast.info("Like or save some reasons first");
      return;
    }
    
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
      toast.error("AI couldn't generate a reason");
    } finally {
      setLoading(false);
    }
  };

  // Toggle like status for current reason
  const toggleLike = () => {
    if (!currentReason) return;
    
    if (isLiked) {
      removeFromLikedReasons(currentReason);
      toast.info("Removed from liked reasons");
    } else {
      addToLikedReasons(currentReason);
      toast.success("Added to liked reasons");
    }
  };

  // Toggle save status for current reason
  const toggleSave = () => {
    if (!currentReason) return;
    
    if (isSaved) {
      removeFromSavedReasons(currentReason);
      toast.info("Removed from saved reasons");
    } else {
      addToSavedReasons(currentReason);
      toast.success("Saved for later");
    }
  };

  // Copy current reason to clipboard
  const copyToClipboard = async () => {
    if (!currentReason) return;
    
    try {
      await navigator.clipboard.writeText(currentReason);
      setCopied(true);
      toast.success("Copied to clipboard");
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy to clipboard");
    }
  };

  // Share current reason
  const shareReason = async () => {
    if (!currentReason) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Excuse from NahMachine",
          text: currentReason,
          url: window.location.href,
        });
        toast.success("Shared successfully");
      } catch (error: unknown) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Error sharing:", error);
          toast.error("Failed to share");
        }
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      copyToClipboard();
      toast.info("Share not supported, copied to clipboard instead");
    }
  };

  // Keyboard shortcuts
  useHotkeys('r', fetchReason, []);
  useHotkeys('l', toggleLike, [currentReason]);
  useHotkeys('s', toggleSave, [currentReason]);
  useHotkeys('c', copyToClipboard, [currentReason]);
  useHotkeys('g', generatePersonalizedReason, [canGenerateAI]);
  useHotkeys('q', () => setShowKeyboardShortcuts(prev => !prev), []);

  // Initial fetch on mount
  useEffect(() => {
    if (!currentReason) {
      fetchReason();
    }
    
    // Show keyboard shortcut tip after first load
    const hasSeenTip = localStorage.getItem('nahm-seen-kbd-tip');
    if (!hasSeenTip) {
      setTimeout(() => {
        toast.info("Pro tip: Press q for keyboard shortcuts", {
          duration: 5000,
        });
        localStorage.setItem('nahm-seen-kbd-tip', 'true');
      }, 3000);
    }
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider delayDuration={300}>
        <GridBackground />
        
        <div className="relative min-h-screen flex flex-col items-center justify-center">
          {/* Header controls */}
          <div className="absolute top-5 right-5 z-20 flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="icon" 
                  variant="ghost"
                  className="h-8 w-8 rounded-full text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                  onClick={() => setShowKeyboardShortcuts(true)}
                >
                  <KeyRound className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Keyboard shortcuts
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="icon" 
                  variant="ghost"
                  className="h-8 w-8 rounded-full text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                  onClick={() => setShowAbout(true)}
                >
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                About NahMachine
              </TooltipContent>
            </Tooltip>
            
            <ThemeSwitcher />
          </div>
          
          {/* Main content */}
          <main className="w-full max-w-md px-5 flex flex-col items-center justify-center space-y-8">
            {/* Title */}
            <motion.h1 
              className="text-3xl font-medium tracking-tight"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring" }}
            >
              nah<span className="text-blue-500">.</span>machine
            </motion.h1>
            
            {/* Main card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
              className="w-full"
            >
              <div className="bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl shadow-sm 
                           border border-zinc-100 dark:border-zinc-800/80 overflow-hidden">
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
                      transition={{ duration: 0.3 }}
                      className="py-12 px-6"
                    >
                      <motion.p 
                        className="text-xl text-center leading-relaxed"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                      >
                        {currentReason}
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 dark:border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={toggleLike}
                          disabled={isLoading || !currentReason}
                          className={`p-2 rounded-full transition-all ${
                            isLiked 
                              ? 'text-rose-500 scale-110' 
                              : 'text-zinc-400 hover:text-rose-500 dark:text-zinc-500 dark:hover:text-rose-400'
                          }`}
                          aria-label={isLiked ? "Unlike" : "Like"}
                        >
                          <motion.div
                            initial={{ scale: 1 }}
                            animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
                            transition={{ duration: 0.3 }}
                          >
                            <Heart className={`h-4 w-4 ${isLiked ? 'fill-rose-500' : ''}`} />
                          </motion.div>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        {isLiked ? 'Unlike (L)' : 'Like (L)'}
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={toggleSave}
                          disabled={isLoading || !currentReason}
                          className={`p-2 rounded-full transition-all ${
                            isSaved 
                              ? 'text-amber-500 scale-110' 
                              : 'text-zinc-400 hover:text-amber-500 dark:text-zinc-500 dark:hover:text-amber-400'
                          }`}
                          aria-label={isSaved ? "Unsave" : "Save"}
                        >
                          <motion.div
                            initial={{ scale: 1 }}
                            animate={isSaved ? { scale: [1, 1.2, 1] } : {}}
                            transition={{ duration: 0.3 }}
                          >
                            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-amber-500' : ''}`} />
                          </motion.div>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        {isSaved ? 'Unsave (S)' : 'Save (S)'}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={copyToClipboard}
                          disabled={isLoading || !currentReason}
                          className={`p-2 rounded-full transition-colors ${
                            isLoading || !currentReason
                              ? 'text-zinc-300 dark:text-zinc-700'
                              : copied
                                ? 'text-emerald-500'
                                : 'text-zinc-500 hover:text-emerald-500 dark:text-zinc-400 dark:hover:text-emerald-400'
                          }`}
                          aria-label="Copy to clipboard"
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            {copied ? (
                              <motion.div
                                key="check"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                              >
                                <Check className="h-4 w-4" />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="copy"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                              >
                                <Copy className="h-4 w-4" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        Copy (C)
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={shareReason}
                          disabled={isLoading || !currentReason}
                          className={`p-2 rounded-full transition-colors ${
                            isLoading || !currentReason
                              ? 'text-zinc-300 dark:text-zinc-700'
                              : 'text-zinc-500 hover:text-indigo-500 dark:text-zinc-400 dark:hover:text-indigo-400'
                          }`}
                          aria-label="Share"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        Share
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={generatePersonalizedReason}
                          disabled={isLoading || !canGenerateAI}
                          className={`p-2 rounded-full transition-colors ${
                            !canGenerateAI || isLoading
                              ? 'text-zinc-300 dark:text-zinc-700' 
                              : 'text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300'
                          }`}
                          aria-label="Generate AI reason"
                        >
                          <Sparkles className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        AI generate (G)
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={fetchReason}
                          disabled={isLoading}
                          className="p-2 rounded-full text-zinc-700 dark:text-zinc-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                          aria-label="Get new reason"
                        >
                          <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        New reason (R)
                      </TooltipContent>
                    </Tooltip>
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
                className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 
                         inline-flex items-center gap-1.5 transition-colors hover:scale-105"
              >
                <Github className="h-3 w-3" />
                <span>GitHub</span>
              </a>
              
              <a 
                href="https://abhisheksharma.tech" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 
                         inline-flex items-center gap-1.5 transition-colors hover:scale-105"
              >
                <ExternalLink className="h-3 w-3" />
                <span>Portfolio</span>
              </a>
            </div>
            <div className="text-xs text-zinc-400">
              © 2025 Abhishek Sharma
            </div>
          </footer>
          
          {/* Modals */}
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
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
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
            
            {showKeyboardShortcuts && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setShowKeyboardShortcuts(false)}
              >
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ type: "spring", damping: 25 }}
                  className="bg-white dark:bg-zinc-900 rounded-2xl p-6 max-w-sm w-full shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium">Keyboard Shortcuts</h2>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => setShowKeyboardShortcuts(false)}
                      className="h-8 w-8 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <ShortcutRow shortcut="R" description="Get new reason" />
                    <ShortcutRow shortcut="L" description="Like/unlike current reason" />
                    <ShortcutRow shortcut="S" description="Save/unsave current reason" />
                    <ShortcutRow shortcut="C" description="Copy to clipboard" />
                    <ShortcutRow shortcut="G" description="Generate AI reason" />
                    <ShortcutRow shortcut="Q" description="Show this dialog" />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </TooltipProvider>
    </MotionConfig>
  );
}

// Shortcut row component
function ShortcutRow({ shortcut, description }: { shortcut: string; description: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
      <span className="text-sm text-zinc-600 dark:text-zinc-300">{description}</span>
      <kbd className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-xs font-mono">
        {shortcut}
      </kbd>
    </div>
  );
}