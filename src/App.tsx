import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTimer } from './hooks/useTimer';
import { Home } from './pages/Home';
import { QuizRouter } from './routes/QuizRouter';
import { Results } from './pages/Results';
import { Dashboard } from './pages/Dashboard';
import { UpgradeModal } from './components/premium/UpgradeModal';
import questionsDataRaw from './data/questions.json';
import achievementsData from './data/achievements.json';
import { Question } from './types/quiz';
import { UserStats } from './types/user';
import { Achievement } from './types/achievements';
import { Leaderboard } from './components/leaderboard/Leaderboard';
import { Login } from './pages/Login';
import { CreateQuiz } from './pages/CreateQuiz';
import Quiz from './pages/Quiz';

const questionsData = questionsDataRaw as Question[];

export default function App() {
  // State
  const [currentPage, setCurrentPage] = useState<'home' | 'quiz' | 'results' | 'dashboard' | 'createQuiz' | 'scheduledQuiz' | 'createdQuiz' | 'createdQuizResult'>('home');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isPremium] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [user, setUser] = useState<string | null>(localStorage.getItem('quizUser'));
  const [createdQuizzes, setCreatedQuizzes] = useState<any[]>(JSON.parse(localStorage.getItem('createdQuizzes') || '[]'));
  const [activeQuiz, setActiveQuiz] = useState<any | null>(null);
  const [quizUserAnswers, setQuizUserAnswers] = useState<{ [key: number]: string }>({});
  const [quizScore, setQuizScore] = useState(0);

  // User Stats
  const [userStats, setUserStats] = useLocalStorage<UserStats>('quizUserStats', {
    totalQuizzes: 0,
    totalCorrect: 0,
    streak: 0,
    bestStreak: 0,
    level: 1,
    xp: 0,
    coins: 100,
    energy: 5,
    achievements: [],
    lastPlayed: ''
  });

  // Timer
  const { timeLeft, isActive, start, pause, reset } = useTimer(30, () => {
    handleAnswerSubmit();
  });

  // Load questions
  const loadQuestions = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const selectedQuestions = [...questionsData]
        .sort(() => Math.random() - 0.5)
        .slice(0, isPremium ? 10 : 5);
      setQuestions(selectedQuestions);
    } catch {
      setQuestions(questionsData.slice(0, 5));
    }
    setLoading(false);
  }, [isPremium]);

  // Start Quiz
  const startQuiz = useCallback(async () => {
    if (!isPremium && userStats.energy <= 0) {
      setIsPremiumModalOpen(true);
      return;
    }
    setCurrentPage('quiz');
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setUserAnswers({});
    setScore(0);
    setQuizCompleted(false);
    await loadQuestions();
    start();
    if (!isPremium) {
      setUserStats({ ...userStats, energy: Math.max(0, userStats.energy - 1) });
    }
  }, [isPremium, userStats.energy, loadQuestions, start, setUserStats]);

  // Select Answer
  const selectAnswer = useCallback((answer: string) => {
    if (selectedAnswer || !isActive) return;
    setSelectedAnswer(answer);
    pause();
    setTimeout(() => {
      handleAnswerSubmit(answer);
    }, 1000);
  }, [selectedAnswer, isActive, pause]);

  // Handle Answer Submit
  const handleAnswerSubmit = useCallback((answer?: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    const finalAnswer = answer || selectedAnswer;
    if (finalAnswer) {
      setUserAnswers((prev: { [key: number]: string }) => ({ ...prev, [currentQuestion.id]: finalAnswer }));
      if (finalAnswer === currentQuestion.correct_answer) {
        setScore(prev => prev + currentQuestion.points);
      }
    }
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        reset(30);
        start();
      }, 1500);
    } else {
      setTimeout(() => {
        completeQuiz();
      }, 1500);
    }
  }, [currentQuestionIndex, questions, selectedAnswer, reset, start]);

  // Complete Quiz
  const completeQuiz = useCallback(() => {
    setQuizCompleted(true);
    setQuizStarted(false);
    pause();
    const correctAnswersCount = questions.filter(q => userAnswers[q.id] === q.correct_answer).length;
    const today = new Date().toDateString();
    const isNewDay = userStats.lastPlayed !== today;
    const isPerfectScore = correctAnswersCount === questions.length;
    setUserStats({
      ...userStats,
      streak: isNewDay ? userStats.streak + 1 : userStats.streak,
      xp: userStats.xp + score + (correctAnswersCount * 10),
      coins: userStats.coins + Math.floor(score / 10) + (isPerfectScore ? 50 : 0),
      lastPlayed: today,
      bestStreak: Math.max(userStats.bestStreak, isNewDay ? userStats.streak + 1 : userStats.streak),
      energy: userStats.energy,
      achievements: userStats.achievements
    });
    setCurrentPage('results');
  }, [pause, questions, userAnswers, score, userStats.lastPlayed, setUserStats]);

  // Restart Quiz
  const restartQuiz = useCallback(() => {
    startQuiz();
  }, [startQuiz]);

  // Go Home
  const goHome = useCallback(() => {
    setCurrentPage('home');
    setQuizStarted(false);
    setQuizCompleted(false);
    reset();
  }, [reset]);

  // Energy refill (demo)
  useEffect(() => {
    const interval = setInterval(() => {
      setUserStats({ ...userStats, energy: Math.min(5, userStats.energy + 1) });
    }, 60000);
    return () => clearInterval(interval);
  }, [setUserStats]);

  // Current Question and answers
  const currentQuestion = questions[currentQuestionIndex];
  const allAnswers = currentQuestion
    ? [...currentQuestion.incorrect_answers, currentQuestion.correct_answer].sort(() => Math.random() - 0.5)
    : [];

  // Results data
  const totalQuestions = questions.length;
  const correctAnswers = questions.filter(q => userAnswers[q.id] === q.correct_answer).length;
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  // Handlers for premium modal and sound toggle
  const openPremiumModal = () => setIsPremiumModalOpen(true);
  const closePremiumModal = () => setIsPremiumModalOpen(false);
  const toggleSound = () => setSoundEnabled(prev => !prev);
  const goToDashboard = () => setCurrentPage('dashboard');

  const handleCreateQuiz = (quiz: any) => {
    const updatedQuizzes = [...createdQuizzes, quiz];
    setCreatedQuizzes(updatedQuizzes);
    localStorage.setItem('createdQuizzes', JSON.stringify(updatedQuizzes));
  };

  const updateLeaderboard = (score: number) => {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    const existing = leaderboard.find((entry: any) => entry.name === user);
    if (existing) {
      existing.score = Math.max(existing.score, score);
    } else {
      leaderboard.push({ name: user, score });
    }
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  };

  const handleLogout = () => {
    localStorage.removeItem('quizUser');
    setUser(null);
  };

  // Track completed quizzes
  const [completedQuizIds, setCompletedQuizIds] = useState<string[]>(JSON.parse(localStorage.getItem('completedQuizIds') || '[]'));

  // When quiz is completed, add to completedQuizIds and update localStorage
  const handleCreatedQuizComplete = (quizId: string) => {
    const updated = [...completedQuizIds, quizId];
    setCompletedQuizIds(updated);
    localStorage.setItem('completedQuizIds', JSON.stringify(updated));
    setActiveQuiz(null);
    setCurrentPage('createdQuizResult');
  };

  // Filter out completed quizzes from createdQuizzes list
  const visibleCreatedQuizzes = createdQuizzes.filter(q => !completedQuizIds.includes(q.title));

  // Notification for scheduled quizzes
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const upcomingQuiz = createdQuizzes.find(q => {
        if (!q.scheduleDate) return false;
        const quizTime = new Date(q.scheduleDate).getTime();
        return quizTime > now && quizTime - now < 60000;
      });
      if (upcomingQuiz) {
        setShowQuizNotification(true);
        setQuizToStart(upcomingQuiz);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [createdQuizzes]);

  const [showQuizNotification, setShowQuizNotification] = useState(false);
  const [quizToStart, setQuizToStart] = useState<any | null>(null);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  // Calculate correct answers and score for created quiz
  const correctAnswersCount = activeQuiz ? Object.values(userAnswers).filter((ans, idx) => ans === activeQuiz.questions[idx]?.correct_answer).length : 0;
  const totalQuestionsCount = activeQuiz ? Math.min(activeQuiz.questions.length, 10) : 0;
  const pointsPerQuestion = 10;
  const finalScore = correctAnswersCount * pointsPerQuestion;
  const finalAccuracy = totalQuestionsCount > 0 ? Math.round((correctAnswersCount / totalQuestionsCount) * 100) : 0;

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white shadow-lg">
        <div className="font-bold text-2xl">QuizMaster</div>
        <div className="flex gap-4">
          <button className="hover:underline" onClick={() => setCurrentPage('home')}>Home</button>
          <button className="hover:underline" onClick={() => setShowLeaderboard(true)}>Leaderboard</button>
          <button className="hover:underline" onClick={() => setCurrentPage('dashboard')}>Dashboard</button>
          <button className="hover:underline" onClick={() => setCurrentPage('createQuiz')}>Create/Schedule Quiz</button>
        </div>
      </nav>
      {/* Main Content */}
      <AnimatePresence>
        {showDemo ? (
          <Quiz
            loading={false}
            currentQuestionIndex={0}
            questionsLength={3}
            currentQuestion={questionsData[0]}
            allAnswers={questionsData[0].incorrect_answers.concat(questionsData[0].correct_answer)}
            selectedAnswer={null}
            score={0}
            timeLeft={30}
            isActive={false}
            soundEnabled={false}
            goHome={() => setShowDemo(false)}
            toggleSound={() => {}}
            selectAnswer={() => {}}
            onNext={() => {}}
            onPrev={() => {}}
            onSkip={() => {}}
          />
        ) : showLeaderboard ? (
          <Leaderboard user={user} />
        ) : currentPage === 'home' ? (
          <Home
            userStats={userStats}
            isPremium={isPremium}
            startQuiz={startQuiz}
            openPremiumModal={() => setIsPremiumModalOpen(true)}
            goToDashboard={() => setCurrentPage('dashboard')}
          />
        ) : currentPage === 'quiz' ? (
          <QuizRouter
            onSubmit={(userAnswers, score) => {
              setQuizUserAnswers(userAnswers);
              setQuizScore(score);
              setCurrentPage('results');
            }}
          />
        ) : currentPage === 'results' ? (
          <Results
            score={quizScore * 10}
            accuracy={Object.keys(quizUserAnswers).length > 0 ? Math.round((quizScore / Object.keys(quizUserAnswers).length) * 100) : 0}
            correctAnswers={quizScore}
            totalQuestions={Object.keys(quizUserAnswers).length}
            questions={questions}
            userAnswers={quizUserAnswers}
            restartQuiz={startQuiz}
            goHome={() => { updateLeaderboard(quizScore * 10); setCurrentPage('home'); }}
            openPremiumModal={() => setIsPremiumModalOpen(true)}
            setUserStats={fn => setUserStats(fn)}
          />
        ) : currentPage === 'dashboard' ? (
          <Dashboard
            userStats={userStats}
            achievements={achievementsData}
            openPremiumModal={() => setIsPremiumModalOpen(true)}
            goHome={() => setCurrentPage('home')}
            user={user!}
            onLogout={handleLogout}
          />
        ) : currentPage === 'createQuiz' ? (
          <CreateQuiz
            onCreate={quiz => {
              const updatedQuizzes = [...createdQuizzes, quiz];
              setCreatedQuizzes(updatedQuizzes);
              localStorage.setItem('createdQuizzes', JSON.stringify(updatedQuizzes));
              setCurrentPage('home');
            }}
          />
        ) : null}
      </AnimatePresence>
      {/* Premium Modal */}
      <UpgradeModal isOpen={isPremiumModalOpen} onClose={() => setIsPremiumModalOpen(false)} />
      {/* Active Quiz Section */}
      {currentPage === 'scheduledQuiz' && activeQuiz && (
        <Quiz
          loading={false}
          currentQuestionIndex={0}
          questionsLength={activeQuiz.questions.length}
          currentQuestion={activeQuiz.questions[0]}
          allAnswers={activeQuiz.questions[0].incorrect_answers.concat(activeQuiz.questions[0].correct_answer)}
          selectedAnswer={null}
          score={0}
          timeLeft={30}
          isActive={true}
          soundEnabled={true}
          goHome={() => { setActiveQuiz(null); setCurrentPage('home'); }}
          toggleSound={() => {}}
          selectAnswer={() => {}}
          onNext={() => {}}
          onPrev={() => {}}
          onSkip={() => {}}
        />
      )}
      {/* Render created quiz when currentPage is 'createdQuiz' */}
      {currentPage === 'createdQuiz' && activeQuiz && (
        <Quiz
          loading={false}
          currentQuestionIndex={currentQuestionIndex}
          questionsLength={Math.min(activeQuiz.questions.length, 10)}
          currentQuestion={activeQuiz.questions[currentQuestionIndex]}
          allAnswers={activeQuiz.questions[currentQuestionIndex]?.incorrect_answers.concat(activeQuiz.questions[currentQuestionIndex]?.correct_answer) || []}
          selectedAnswer={userAnswers[activeQuiz.questions[currentQuestionIndex]?.id] || null}
          score={score}
          timeLeft={timeLeft}
          isActive={isActive}
          soundEnabled={soundEnabled}
          goHome={() => { setActiveQuiz(null); setCurrentPage('home'); }}
          toggleSound={() => setSoundEnabled(!soundEnabled)}
          selectAnswer={answer => {
            setUserAnswers({ ...userAnswers, [activeQuiz.questions[currentQuestionIndex].id]: answer });
            if (answer === activeQuiz.questions[currentQuestionIndex].correct_answer) {
              setScore(prev => prev + activeQuiz.questions[currentQuestionIndex].points);
            }
            pause();
          }}
          onNext={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
          onPrev={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
          onSkip={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
          onSubmit={() => {
            setCurrentPage('createdQuizResult');
          }}
        />
      )}
      {/* Show results after created quiz is completed */}
      {currentPage === 'createdQuizResult' && (
        <Results
          score={finalScore}
          accuracy={finalAccuracy}
          correctAnswers={correctAnswersCount}
          totalQuestions={totalQuestionsCount}
          questions={activeQuiz ? activeQuiz.questions : []}
          userAnswers={userAnswers}
          restartQuiz={() => setCurrentPage('home')}
          goHome={() => setCurrentPage('home')}
          openPremiumModal={() => setIsPremiumModalOpen(true)}
          setUserStats={fn => setUserStats(fn)}
        />
      )}
      {/* Scheduled Quiz Notification */}
      {showQuizNotification && quizToStart && (
        <div className="fixed bottom-6 right-6 bg-yellow-500 text-white px-6 py-4 rounded-xl shadow-lg z-50 flex items-center gap-4">
          <span>Scheduled Quiz "{quizToStart.title}" is starting soon!</span>
          <button
            className="bg-white text-yellow-600 px-4 py-2 rounded font-bold"
            onClick={() => {
              setActiveQuiz(quizToStart);
              setCurrentPage('createdQuiz');
              setShowQuizNotification(false);
            }}
          >Start Quiz</button>
          <button
            className="ml-2 text-white/80 hover:text-white"
            onClick={() => setShowQuizNotification(false)}
          >Dismiss</button>
        </div>
      )}
    </div>
  );
}