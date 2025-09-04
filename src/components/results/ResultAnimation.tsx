import React from 'react';
import { motion } from 'framer-motion';

export const ResultAnimation: React.FC<{ type: 'win' | 'lose' | 'neutral' }> = ({ type }) => {
  const getAnimation = () => {
    switch (type) {
      case 'win':
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1, type: 'keyframes' }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-6xl">🎉</span>
            <span className="text-xl font-bold text-green-600">Awesome! You Won!</span>
          </motion.div>
        );
      case 'lose':
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
            transition={{ duration: 1, type: 'keyframes' }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-6xl">😢</span>
            <span className="text-xl font-bold text-red-600">Better Luck Next Time!</span>
          </motion.div>
        );
      default:
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, type: 'spring' }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-6xl">🤔</span>
            <span className="text-xl font-bold text-blue-600">Keep Practicing!</span>
          </motion.div>
        );
    }
  };
  return <>{getAnimation()}</>;
};
