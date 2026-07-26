import React from 'react';
import { motion } from 'motion/react';

interface SkeletonProps {
  className?: string;
  type?: 'rectangular' | 'circular' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', type = 'rectangular' }) => {
  const baseClass = "bg-gray-200 dark:bg-gray-700 overflow-hidden relative";
  
  const typeClasses = {
    rectangular: "rounded-md",
    circular: "rounded-full",
    text: "rounded-md h-4 w-full"
  };

  return (
    <div 
      className={`${baseClass} ${typeClasses[type]} ${className}`}
    >
      <motion.div
        className="absolute inset-0 -translate-x-full"
        animate={{ translateX: ['-100%', '100%'] }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear"
        }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
        }}
      />
    </div>
  );
};
