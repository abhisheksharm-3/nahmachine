"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export function GridBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  const isDark = resolvedTheme === "dark";
  
  return (
    <div className="fixed inset-0 -z-10">
      {/* Primary grid */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, ${isDark ? 'rgba(96, 165, 250, 0.03)' : 'rgba(96, 165, 250, 0.07)'} 1px, transparent 1px),
                           linear-gradient(to bottom, ${isDark ? 'rgba(96, 165, 250, 0.03)' : 'rgba(96, 165, 250, 0.07)'} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Secondary grid (larger) */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, ${isDark ? 'rgba(96, 165, 250, 0.05)' : 'rgba(96, 165, 250, 0.1)'} 1px, transparent 1px),
                           linear-gradient(to bottom, ${isDark ? 'rgba(96, 165, 250, 0.05)' : 'rgba(96, 165, 250, 0.1)'} 1px, transparent 1px)`,
          backgroundSize: '200px 200px',
        }}
      />
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-white/0 dark:from-blue-950/20 dark:to-zinc-950/0" />
    </div>
  );
}