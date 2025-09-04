import React from 'react';
import { motion } from 'framer-motion';
import { Home, Volume2, VolumeX, Star, Check, X } from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Button } from '../components/common/Button';
import { ProgressBar } from '../components/common/ProgressBar';
import { Timer } from '../components/common/Timer';

interface QuizProps {
  loading: boolean;
  currentQuestionIndex: number;
  questionsLength: number;
  currentQuestion: any;
  allAnswers: string[];
  selectedAnswer: string | null;
  score: number;
  timeLeft: number;
  isActive: boolean;
  soundEnabled: boolean;
  goHome: () => void;
  toggleSound: () => void;
  selectAnswer: (answer: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onSubmit?: () => void;
}

export const Quiz: React.FC<QuizProps> = ({
  loading,
  currentQuestionIndex,
  questionsLength,
  currentQuestion,
  allAnswers,
  selectedAnswer,
  score,
  timeLeft,
  isActive,
  soundEnabled,
  goHome,
  toggleSound,
  selectAnswer,
  onNext,
  onPrev,
  onSkip,
  onSubmit
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Quiz Header */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={goHome}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <Home className="w-5 h-5" />
                  Home
                </button>
                <div className="flex items-center gap-4">
                  <button
                    onClick={toggleSound}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </button>
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="font-semibold">{score}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-gray-300 text-sm">Question</p>
                  <p className="text-2xl font-bold">
                    {currentQuestionIndex + 1} / {questionsLength}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-300 text-sm">Category</p>
                  <p className="font-semibold">{currentQuestion?.category}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-300 text-sm">Points</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {currentQuestion?.points}
                  </p>
                </div>
              </div>

              <ProgressBar 
                current={currentQuestionIndex + 1} 
                total={questionsLength}
                className="mb-4"
              />
              
              <Timer timeLeft={timeLeft} total={30} />
            </div>

            {/* Question Card */}
            <motion.div
              key={currentQuestionIndex}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-8">
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                  currentQuestion?.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
                  currentQuestion?.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  {currentQuestion?.difficulty?.toUpperCase()}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6 leading-relaxed">
                  {currentQuestion?.question}
                </h2>
              </div>

              <div className="grid gap-4">
                {allAnswers.map((answer, index) => {
                  const isSelected = selectedAnswer === answer;
                  const isCorrect = answer === currentQuestion?.correct_answer;
                  const showResult = selectedAnswer !== null;
                  
                  let buttonClass = "w-full p-6 rounded-xl text-left font-semibold transition-all duration-300 border-2 ";
                  
                  if (showResult) {
                    if (isCorrect) {
                      buttonClass += "bg-green-500/20 border-green-500 text-green-300";
                    } else if (isSelected) {
                      buttonClass += "bg-red-500/20 border-red-500 text-red-300";
                    } else {
                      buttonClass += "bg-gray-500/10 border-gray-600 text-gray-400";
                    }
                  } else {
                    buttonClass += "bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/40 hover:scale-102";
                  }

                  return (
                    <motion.button
                      key={index}
                      className={buttonClass}
                      onClick={() => selectAnswer(answer)}
                      disabled={selectedAnswer !== null || !isActive}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                      whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg">{answer}</span>
                        {showResult && (
                          <div className="flex items-center">
                            {isCorrect ? (
                              <Check className="w-6 h-6 text-green-400" />
                            ) : isSelected ? (
                              <X className="w-6 h-6 text-red-400" />
                            ) : null}
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 gap-4">
              <Button
                onClick={onPrev}
                variant="secondary"
                disabled={currentQuestionIndex === 0}
              >Previous</Button>
              <Button
                onClick={onNext}
                variant="secondary"
                disabled={selectedAnswer === null || currentQuestionIndex === questionsLength - 1}
              >Next</Button>
              <Button
                onClick={onSkip}
                variant="danger"
                disabled={selectedAnswer !== null}
              >Skip</Button>
              <Button
                onClick={onSubmit}
                variant="success"
                disabled={questionsLength === 0}
              >Submit</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;