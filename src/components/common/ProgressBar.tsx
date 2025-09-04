import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, className = '' }) => (
  <div className={`w-full bg-gray-200 rounded-full h-3 overflow-hidden ${className}`}>
    <motion.div
      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
      initial={{ width: 0 }}
      animate={{ width: `${(current / total) * 100}%` }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    />
  </div>
);