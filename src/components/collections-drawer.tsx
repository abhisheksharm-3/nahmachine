"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Bookmark, Clock, X, ChevronUp, ChevronDown } from "lucide-react";
import { useNahMachineStore, Reason } from "@/lib/store";

/**
 * Ultra-minimal Collections Drawer
 */
export function CollectionsDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"liked" | "saved" | "recent">("liked");
  const drawerRef = useRef<HTMLDivElement>(null);
  
  // Access store state and actions
  const { 
    likedReasons, 
    savedReasons, 
    recentReasons, 
    setCurrentReason,
    removeFromLikedReasons,
    removeFromSavedReasons,
    clearRecentReasons
  } = useNahMachineStore();

  // Check if we have any collections
  const hasCollections = likedReasons.length > 0 || savedReasons.length > 0 || recentReasons.length > 0;
  
  // Close drawer when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!hasCollections) return null;

  // Get current collection data based on active tab
  const currentCollection = 
    activeTab === "liked" ? { items: likedReasons, removeAction: removeFromLikedReasons, color: "rose" } :
    activeTab === "saved" ? { items: savedReasons, removeAction: removeFromSavedReasons, color: "amber" } :
    { items: recentReasons, color: "blue" };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4" ref={drawerRef}>
      <div className="max-w-md mx-auto">
        {/* Minimal drawer handle */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center gap-1.5 mx-auto px-4 py-1.5 
                   bg-white/80 dark:bg-zinc-900/50 backdrop-blur-sm rounded-t-lg
                   border border-zinc-100 dark:border-zinc-800/80 shadow-sm"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
            {isOpen ? "Close" : "Collections"}
          </span>
          {isOpen ? (
            <ChevronDown className="h-3 w-3 text-zinc-400" />
          ) : (
            <ChevronUp className="h-3 w-3 text-zinc-400" />
          )}
        </motion.button>
        
        {/* Drawer content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="bg-white/80 dark:bg-zinc-900/50 backdrop-blur-sm rounded-lg overflow-hidden
                       border border-zinc-100 dark:border-zinc-800/80 shadow-sm"
            >
              {/* Tab navigation */}
              <div className="flex border-b border-zinc-100/60 dark:border-zinc-800/60">
                <Tab 
                  id="liked" 
                  isActive={activeTab === "liked"} 
                  onClick={() => setActiveTab("liked")}
                  icon={<Heart className="h-3.5 w-3.5" />}
                  count={likedReasons.length}
                  color="rose"
                />
                <Tab 
                  id="saved" 
                  isActive={activeTab === "saved"} 
                  onClick={() => setActiveTab("saved")}
                  icon={<Bookmark className="h-3.5 w-3.5" />}
                  count={savedReasons.length}
                  color="amber"
                />
                <Tab 
                  id="recent" 
                  isActive={activeTab === "recent"} 
                  onClick={() => setActiveTab("recent")}
                  icon={<Clock className="h-3.5 w-3.5" />}
                  count={recentReasons.length}
                  color="blue"
                />
              </div>
              
              {/* Tab content */}
              <div className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {activeTab === "liked" ? "Reasons you liked" :
                     activeTab === "saved" ? "Saved for later" :
                     "Recently viewed"}
                  </span>
                  
                  {activeTab === "recent" && recentReasons.length > 0 && (
                    <button
                      onClick={clearRecentReasons}
                      className="text-xs flex items-center gap-1 text-zinc-400 hover:text-blue-500 transition-colors"
                    >
                      <span>Clear all</span>
                    </button>
                  )}
                </div>
                
                {/* Content with smooth transitions */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {currentCollection.items.length > 0 ? (
                      <div className="space-y-2 max-h-64 overflow-y-auto pr-1 drawer-scroll">
                        <AnimatePresence initial={false}>
                          {currentCollection.items.map((reason, index) => (
                            <ReasonItem
                              key={reason.timestamp}
                              reason={reason}
                              index={index}
                              color={currentCollection.color as "rose" | "amber" | "blue"}
                              onSelect={() => {
                                setCurrentReason(reason.text);
                                setIsOpen(false);
                              }}
                              onRemove={activeTab !== "recent" && currentCollection.removeAction ? () => 
                                currentCollection.removeAction!(reason.text)
                              : undefined}
                            />
                          ))}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <EmptyState type={activeTab} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Tab button component
function Tab({ 
  isActive, 
  onClick, 
  icon, 
  count,
  color
}: { 
  id: string;
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  count: number;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 py-2.5 relative flex flex-col items-center justify-center"
    >
      <div className={`
        ${isActive ? `text-${color}-500` : "text-zinc-400 dark:text-zinc-500"}
        transition-colors
      `}>
        {icon}
      </div>
      
      <span className={`
        text-xs mt-1
        ${isActive ? "text-zinc-800 dark:text-zinc-200" : "text-zinc-500 dark:text-zinc-400"}
      `}>
        {count}
      </span>
      
      {isActive && (
        <motion.div
          layoutId="activeTabIndicator"
          className={`absolute bottom-0 h-0.5 w-1/2 bg-${color}-500`}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </button>
  );
}

// Individual reason item
function ReasonItem({
  reason,
  index,
  onSelect,
  onRemove
}: {
  reason: Reason;
  index: number;
  color: "rose" | "amber" | "blue";
  onSelect: () => void;
  onRemove?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      layout
    >
      <div
        onClick={onSelect}
        className="group relative p-3 rounded-lg cursor-pointer
                 bg-white/50 dark:bg-zinc-800/30
                 border border-zinc-100 dark:border-zinc-800/60
                 hover:bg-white dark:hover:bg-zinc-800/50 transition-colors"
      >
        <p className="text-sm text-zinc-700 dark:text-zinc-300 pr-6 line-clamp-2">
          {reason.text}
        </p>
        
        <div className="mt-1.5 text-xs text-zinc-400 dark:text-zinc-500">
          {new Date(reason.timestamp).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric'
          })}
        </div>
        
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100
                     p-1 rounded-full transition-opacity duration-200
                     text-zinc-400 hover:text-red-500"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

// Empty state component
function EmptyState({ type }: { type: "liked" | "saved" | "recent" }) {
  const Icon = type === "liked" ? Heart : type === "saved" ? Bookmark : Clock;
  
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className={`p-2 rounded-full mb-2 bg-${type === "liked" ? "rose" : type === "saved" ? "amber" : "blue"}-50/50 dark:bg-${type === "liked" ? "rose" : type === "saved" ? "amber" : "blue"}-500/10`}>
        <Icon className={`h-4 w-4 text-${type === "liked" ? "rose" : type === "saved" ? "amber" : "blue"}-400`} />
      </div>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        {type === "liked" ? "No liked reasons yet" : 
         type === "saved" ? "Nothing saved yet" : 
         "No recent activity"}
      </p>
    </div>
  );
}