import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Flame, Award, Check } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Achievement } from '../types/achievements';
import { UserStats } from '../types/user';

interface DashboardProps {
  userStats: UserStats;
  achievements: Achievement[];
  openPremiumModal: () => void;
  goHome: () => void;
}

export const Dashboard: React.FC<DashboardProps & { user: string; onLogout: () => void }> = ({ userStats, achievements, openPremiumModal, goHome, user, onLogout }) => {
  // Real performance data
  const quizResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
  const totalQuizzes = quizResults.length;
  const totalCorrect = quizResults.reduce((sum: number, r: any) => sum + (r.correctAnswers || 0), 0);
  const avgAccuracy = totalQuizzes > 0 ? Math.round(quizResults.reduce((sum: number, r: any) => sum + (r.accuracy || 0), 0) / totalQuizzes) : 0;
  const contestsEntered = userStats.contestsEntered || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Dashboard Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
              <p className="text-gray-300">Welcome, <span className="font-bold text-yellow-400">{user}</span></p>
            </div>
            <div className="flex gap-2">
              <button onClick={goHome} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Home</button>
              <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Logout</button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[
              { icon: Trophy, label: "Total Quizzes", value: userStats.totalQuizzes, color: "text-yellow-400" },
              { icon: Target, label: "Accuracy", value: `${userStats.totalQuizzes > 0 ? Math.round((userStats.totalCorrect / (userStats.totalQuizzes * 5)) * 100) : 0}%`, color: "text-green-400" },
              { icon: Flame, label: "Current Streak", value: userStats.streak, color: "text-orange-400" },
              { icon: Award, label: "Best Streak", value: userStats.bestStreak, color: "text-purple-400" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                <p className="text-gray-300 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Progress Section */}
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-xl font-bold mb-4">Level Progress</h3>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span>Level {userStats.level}</span>
                  <span>{userStats.xp} XP</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(userStats.xp % 1000) / 10}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                {1000 - (userStats.xp % 1000)} XP to next level
              </p>
            </motion.div>

            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3 className="text-xl font-bold mb-4">Achievements</h3>
              <div className="space-y-3">
                {achievements.slice(0, 3).map((achievement) => {
                  const isUnlocked = achievement.condition ? achievement.condition(userStats) : false;
                  return (
                    <div
                      key={achievement.id}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        isUnlocked 
                          ? 'bg-green-500/20 border border-green-500/30' 
                          : 'bg-gray-500/10 border border-gray-600/30'
                      }`}
                    >
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <h4 className={`font-semibold ${isUnlocked ? 'text-green-300' : 'text-gray-400'}`}>
                          {achievement.name}
                        </h4>
                        <p className="text-sm text-gray-400">{achievement.description}</p>
                      </div>
                      {isUnlocked && <Check className="w-5 h-5 text-green-400" />}
                    </div>
                  );
                })}
              </div>
              <Button 
                className="w-full mt-4" 
                variant="secondary"
                onClick={openPremiumModal}
              >
                View All Achievements
              </Button>
            </motion.div>
          </div>

          {/* Real-time Performance & Contest Intake */}
          <motion.div
            className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 mb-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h3 className="text-xl font-bold mb-2 text-blue-400">Performance Overview</h3>
            <p className="text-lg text-gray-100 mb-2">Quizzes Taken: {totalQuizzes}</p>
            <p className="text-lg text-gray-100 mb-2">Correct Answers: {totalCorrect}</p>
            <p className="text-lg text-gray-100 mb-2">Average Accuracy: {avgAccuracy}%</p>
            <p className="text-lg text-gray-100 mb-2">Contests Entered: {contestsEntered}</p>
          </motion.div>

          {/* All Achievements with Levels */}
          <motion.div
            className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h3 className="text-xl font-bold mb-4 text-purple-400">All Achievements</h3>
            <div className="space-y-3">
              {achievements.map((achievement) => {
                const isUnlocked = achievement.condition ? achievement.condition(userStats) : false;
                const level = achievement.level || 1;
                return (
                  <div
                    key={achievement.id}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      isUnlocked 
                        ? 'bg-green-500/20 border border-green-500/30' 
                        : 'bg-gray-500/10 border border-gray-600/30'
                    }`}
                  >
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${isUnlocked ? 'text-green-300' : 'text-gray-400'}`}>{achievement.name} <span className="ml-2 text-xs text-yellow-400">Lv.{level}</span></h4>
                      <p className="text-sm text-gray-400">{achievement.description}</p>
                    </div>
                    {isUnlocked && <Check className="w-5 h-5 text-green-400" />}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};