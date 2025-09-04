import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Target, Check, RotateCcw, Home, Share2, X } from 'lucide-react';
import { Button } from '../components/common/Button';
import { ResultAnimation } from '../components/results/ResultAnimation';

interface ResultsProps {
  score: number;
  accuracy: number;
  correctAnswers: number;
  totalQuestions: number;
  questions: any[];
  userAnswers: { [key: number]: string };
  restartQuiz: () => void;
  goHome: () => void;
  openPremiumModal: () => void;
  setUserStats: (value: (prev: import('../types/user').UserStats) => import('../types/user').UserStats) => void;
}

export const Results: React.FC<ResultsProps> = ({
  score,
  accuracy,
  correctAnswers,
  totalQuestions,
  questions,
  userAnswers,
  restartQuiz,
  goHome,
  openPremiumModal,
  setUserStats
}) => {
  useEffect(() => {
    // Store result for performance tracking
    const resultData = {
      date: new Date().toISOString(),
      score,
      accuracy,
      correctAnswers,
      totalQuestions,
      userAnswers,
      questions
    };
    const prevResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
    localStorage.setItem('quizResults', JSON.stringify([...prevResults, resultData]));

    // Update contest intake and achievement levels
    if (typeof score === 'number' && score > 0) {
      setUserStats((prev: import('../types/user').UserStats) => {
        const prevContests = typeof prev.contestsEntered === 'number' ? prev.contestsEntered : 0;
        const newContests = prevContests + 1;
        let newAchievements = [...prev.achievements];
        let achievementLevel = 1;
        if (newContests % 3 === 0) {
          achievementLevel = Math.floor(newContests / 3) + 1;
        }
        if (prev.streak >= 30) {
          achievementLevel = 10; // Top level
        }
        return {
          ...prev,
          contestsEntered: newContests,
          achievements: newAchievements,
          level: achievementLevel
        };
      });
    }
  }, [score, setUserStats]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              {/* Cute cartoon animation based on result */}
              <ResultAnimation type={score === totalQuestions * 10 ? 'win' : score > 0 ? 'neutral' : 'lose'} />
            </div>
            <h1 className="text-4xl font-bold mb-4">Quiz Complete!</h1>
            <p className="text-xl text-gray-300">Here's how you performed</p>
          </motion.div>

          {/* Score Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-2">{score}</h3>
              <p className="text-gray-300">Total Points</p>
            </motion.div>

            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Target className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-2">{accuracy}%</h3>
              <p className="text-gray-300">Accuracy</p>
            </motion.div>

            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Check className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-2">{correctAnswers}/{totalQuestions}</h3>
              <p className="text-gray-300">Correct</p>
            </motion.div>
          </div>

          {/* Detailed Results */}
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h3 className="text-2xl font-bold mb-6">Question Review</h3>
            <div className="space-y-4">
              {questions.map((question, index) => {
                const userAnswer = userAnswers[question.id];
                const isCorrect = userAnswer === question.correct_answer;
                
                return (
                  <div
                    key={question.id}
                    className={`p-4 rounded-lg border-2 ${
                      isCorrect 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : 'bg-red-500/10 border-red-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold flex-1">{question.question}</h4>
                      <div className="flex items-center ml-4">
                        {isCorrect ? (
                          <Check className="w-5 h-5 text-green-400" />
                        ) : (
                          <X className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400 mb-1">Your Answer:</p>
                        <p className={isCorrect ? 'text-green-300' : 'text-red-300'}>
                          {userAnswer || 'No answer'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Correct Answer:</p>
                        <p className="text-green-300">{question.correct_answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Motivation & Suggestions Card */}
          <motion.div
            className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 mb-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {accuracy === 100 ? (
              <>
                <h3 className="text-2xl font-bold mb-2 text-green-400">Outstanding!</h3>
                <p className="text-lg text-green-200 mb-2">You got a perfect score! Keep up the amazing work!</p>
                <p className="text-md text-gray-100">Try a harder quiz or challenge your friends!</p>
              </>
            ) : accuracy >= 70 ? (
              <>
                <h3 className="text-2xl font-bold mb-2 text-blue-400">Great Job!</h3>
                <p className="text-lg text-blue-200 mb-2">You're doing well. Review missed questions and aim for perfection!</p>
                <p className="text-md text-gray-100">Practice daily to boost your skills!</p>
              </>
            ) : accuracy >= 40 ? (
              <>
                <h3 className="text-2xl font-bold mb-2 text-yellow-400">Keep Going!</h3>
                <p className="text-lg text-yellow-200 mb-2">Not bad! Review your mistakes and try again for a better score.</p>
                <p className="text-md text-gray-100">Consistency is key. You can do it!</p>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold mb-2 text-red-400">Don't Give Up!</h3>
                <p className="text-lg text-red-200 mb-2">Every expert was once a beginner. Review your answers and keep practicing!</p>
                <p className="text-md text-gray-100">Try easier quizzes to build confidence.</p>
              </>
            )}
          </motion.div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={restartQuiz} icon={RotateCcw}>
              Play Again
            </Button>
            <Button onClick={goHome} variant="secondary" icon={Home}>
              Back to Home
            </Button>
            <Button 
              onClick={openPremiumModal} 
              variant="primary" 
              icon={Share2}
            >
              Share Results
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};