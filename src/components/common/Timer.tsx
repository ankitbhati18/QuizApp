import React from 'react';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface TimerProps {
  timeLeft: number;
  total: number;
}

export const Timer: React.FC<TimerProps> = ({ timeLeft, total }) => {
  const percentage = (timeLeft / total) * 100;
  const isUrgent = percentage < 25;

  return (
    <div className="flex items-center gap-3">
      <Clock className={`w-5 h-5 ${isUrgent ? 'text-red-500 animate-pulse' : 'text-blue-600'}`} />
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">Time Left</span>
          <span className={`text-sm font-bold ${isUrgent ? 'text-red-500' : 'text-blue-600'}`}>
            {timeLeft}s
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className={`h-full rounded-full transition-colors duration-200 ${
              isUrgent ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-blue-500 to-green-500'
            }`}
            style={{ width: `${percentage}%` }}
            animate={isUrgent ? { scale: [1, 1.02, 1] } : {}}
            transition={isUrgent ? { duration: 0.5, repeat: Infinity, type: 'keyframes' } : {}}
          />
        </div>
      </div>
    </div>
  );
};