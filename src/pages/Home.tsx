import React from 'react';
import { motion } from 'framer-motion';
import { Play, Crown, Flame, Trophy, Coins, Heart, TrendingUp, Users, Award } from 'lucide-react';
import { Button } from '../components/common/Button';

interface HomeProps {
  userStats: {
    streak: number;
    level: number;
    coins: number;
    energy: number;
  };
  isPremium: boolean;
  startQuiz: () => void;
  openPremiumModal: () => void;
  goToDashboard: () => void;
}

export const Home: React.FC<HomeProps> = ({ userStats, isPremium, startQuiz, openPremiumModal, goToDashboard }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            className="text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Quiz Master
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Challenge your mind with addictive quizzes
          </motion.p>
        </div>

        {/* User Stats Card */}
        <motion.div 
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Flame className="w-6 h-6 text-orange-500 mr-2" />
                <span className="text-2xl font-bold">{userStats.streak}</span>
              </div>
              <p className="text-gray-300 text-sm">Day Streak</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
                <span className="text-2xl font-bold">{userStats.level}</span>
              </div>
              <p className="text-gray-300 text-sm">Level</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Coins className="w-6 h-6 text-yellow-400 mr-2" />
                <span className="text-2xl font-bold">{userStats.coins}</span>
              </div>
              <p className="text-gray-300 text-sm">Quiz Coins</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Heart className="w-6 h-6 text-red-500 mr-2" />
                <span className="text-2xl font-bold">{userStats.energy}/5</span>
              </div>
              <p className="text-gray-300 text-sm">Energy</p>
            </div>
          </div>
        </motion.div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-center relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <Play className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
            <h3 className="text-2xl font-bold mb-2">Quick Quiz</h3>
            <p className="text-blue-100 mb-6">
              {isPremium ? "Unlimited questions" : `${userStats.energy} plays remaining`}
            </p>
            <Button 
              onClick={startQuiz}
              variant="secondary"
              className="w-full"
              disabled={!isPremium && userStats.energy <= 0}
            >
              {!isPremium && userStats.energy <= 0 ? "No Energy Left" : "Start Quiz"}
            </Button>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-8 text-center relative overflow-hidden cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            onClick={openPremiumModal}
          >
            <div className="absolute top-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mt-12"></div>
            <Crown className="w-16 h-16 mx-auto mb-4 text-white" />
            <h3 className="text-2xl font-bold mb-2 text-white">Go Premium</h3>
            <p className="text-yellow-100 mb-6">Unlock unlimited features</p>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <p className="text-white font-semibold">50% OFF First Month!</p>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: TrendingUp, title: "Dashboard", desc: "Track your progress", onClick: goToDashboard },
            { icon: Users, title: "Leaderboard", desc: "Compete globally", onClick: openPremiumModal },
            { icon: Award, title: "Achievements", desc: "Unlock rewards", onClick: openPremiumModal }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/10 transition-colors cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              onClick={feature.onClick}
            >
              <feature.icon className="w-8 h-8 mx-auto mb-3 text-blue-400" />
              <h4 className="font-semibold mb-1">{feature.title}</h4>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};