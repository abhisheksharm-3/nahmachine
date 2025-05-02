import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./button";

interface BannerAlertProps {
  message: string;
  onClose: () => void;
}

export function BannerAlert({ message, onClose }: BannerAlertProps) {
  return (
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      className="fixed top-0 inset-x-0 z-50 flex justify-center"
    >
      <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 backdrop-blur-sm 
                    border border-blue-100 dark:border-blue-800/50 
                    px-4 py-2 rounded-b-lg shadow-sm mt-0 max-w-lg">
        <p className="text-xs text-blue-600 dark:text-blue-300">
          {message}
        </p>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="h-5 w-5 rounded-full text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/50"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </motion.div>
  );
}