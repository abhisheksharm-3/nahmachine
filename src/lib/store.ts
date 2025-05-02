import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Reason {
  text: string;
  timestamp: number;
}

interface NahMachineState {
  // Core reason state
  currentReason: string | null;
  isLoading: boolean;
  
  // Collections
  likedReasons: Reason[];
  savedReasons: Reason[];
  recentReasons: Reason[];
  
  // Actions
  setCurrentReason: (text: string) => void;
  setLoading: (loading: boolean) => void;
  
  // Collection management
  addToLikedReasons: (text: string) => void;
  removeFromLikedReasons: (text: string) => void;
  addToSavedReasons: (text: string) => void;
  removeFromSavedReasons: (text: string) => void;
  addToRecentReasons: (text: string) => void;
  clearRecentReasons: () => void;
}

export const useNahMachineStore = create<NahMachineState>()(
  persist(
    (set) => ({
      // Core reason state
      currentReason: null,
      isLoading: false,
      
      // Collections
      likedReasons: [],
      savedReasons: [],
      recentReasons: [],
      
      // Actions
      setCurrentReason: (text) => set({ currentReason: text }),
      setLoading: (loading) => set({ isLoading: loading }),
      
      // Collection management
      addToLikedReasons: (text) => set((state) => {
        if (state.likedReasons.some(reason => reason.text === text)) {
          return state;
        }
        return { 
          likedReasons: [
            { text, timestamp: Date.now() },
            ...state.likedReasons
          ] 
        };
      }),
      
      removeFromLikedReasons: (text) => set((state) => ({
        likedReasons: state.likedReasons.filter(reason => reason.text !== text)
      })),
      
      addToSavedReasons: (text) => set((state) => {
        if (state.savedReasons.some(reason => reason.text === text)) {
          return state;
        }
        return { 
          savedReasons: [
            { text, timestamp: Date.now() },
            ...state.savedReasons
          ]
        };
      }),
      
      removeFromSavedReasons: (text) => set((state) => ({
        savedReasons: state.savedReasons.filter(reason => reason.text !== text)
      })),
      
      addToRecentReasons: (text) => set((state) => {
        const MAX_RECENT_ITEMS = 10;
        
        // Filter out any existing identical reason
        const filteredReasons = state.recentReasons.filter(reason => reason.text !== text);
        
        // Create new array with new reason at start
        const newRecentReasons = [
          { text, timestamp: Date.now() },
          ...filteredReasons
        ].slice(0, MAX_RECENT_ITEMS); // Keep only last 10
        
        return { recentReasons: newRecentReasons };
      }),
      
      clearRecentReasons: () => set({ recentReasons: [] }),
    }),
    {
      name: 'nah-machine-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);