import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Zap, Trophy, Target, Gift, Shield } from 'lucide-react';
import { Button } from '../common/Button';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const features = [
    { icon: Zap, text: "Unlimited daily quizzes" },
    { icon: Trophy, text: "Global leaderboards" },
    { icon: Target, text: "Advanced analytics" },
    { icon: Gift, text: "Exclusive categories" },
    { icon: Shield, text: "Power-ups & lifelines" }
  ];

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl max-w-md w-full p-6 relative overflow-hidden"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500"></div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Upgrade to Premium</h2>
          <p className="text-gray-600 mb-6">Unlock unlimited quizzes and advanced features!</p>
          
          <div className="space-y-3 mb-6 text-left">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <feature.icon className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700">{feature.text}</span>
              </div>
            ))}
          </div>
          
          <div className="space-y-3">
            <Button className="w-full" icon={Crown}>
              Start Premium Trial - $9.99/month
            </Button>
            <button
              onClick={onClose}
              className="w-full py-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};