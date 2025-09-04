import React, { useState, useEffect } from 'react';
import { useTimer } from '../hooks/useTimer';
import Quiz from '../pages/Quiz';
import { Results } from '../pages/Results';
import questionsDataRaw from '../data/questions.json';
import { Question } from '../types/quiz';

const questionsData = questionsDataRaw as Question[];

interface QuizRouterProps {
  onSubmit: (userAnswers: { [key: number]: string }, score: number) => void;
}

export const QuizRouter: React.FC<QuizRouterProps> = ({ onSubmit }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { timeLeft, isActive, start, pause, reset } = useTimer(30, () => {
    setCurrentQuestionIndex((prev) => prev + 1);
    reset(30);
    start();
  });

  useEffect(() => {
    fetch('https://opentdb.com/api.php?amount=10&type=multiple')
      .then(res => res.json())
      .then(data => {
        if (data.results && data.results.length) {
          setQuestions(data.results.map((q: any, idx: number) => ({
            id: idx + 1,
            category: q.category,
            difficulty: q.difficulty,
            question: q.question,
            correct_answer: q.correct_answer,
            incorrect_answers: q.incorrect_answers,
            type: q.type,
            points: 10
          })));
        } else {
          setQuestions(questionsData.slice(0, 10));
        }
        setLoading(false);
      })
      .catch(() => {
        setQuestions(questionsData.slice(0, 10));
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!loading && questions.length > 0) {
      reset(30);
      start();
    }
  }, [loading, questions.length, reset, start]);

  const handleAnswer = (answer: string) => {
    setUserAnswers({ ...userAnswers, [questions[currentQuestionIndex].id]: answer });
    if (questions[currentQuestionIndex].correct_answer === answer) {
      setScore(score + 1);
    }
    pause();
  };

  const handleNext = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    reset(30);
    start();
  };

  const handlePrev = () => {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
    reset(30);
    start();
  };

  const handleSkip = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    reset(30);
    start();
  };

  const handleRestart = () => {
    setUserAnswers({});
    setScore(0);
    setCurrentQuestionIndex(0);
    reset(30);
    start();
  };

  const handleSubmit = () => {
    pause();
    onSubmit(userAnswers, score);
  };

  return (
    <Quiz
      loading={loading}
      currentQuestionIndex={currentQuestionIndex}
      questionsLength={questions.length}
      currentQuestion={questions[currentQuestionIndex]}
      allAnswers={questions[currentQuestionIndex]?.incorrect_answers.concat(questions[currentQuestionIndex]?.correct_answer) || []}
      selectedAnswer={userAnswers[questions[currentQuestionIndex]?.id] || null}
      score={score}
      timeLeft={timeLeft}
      isActive={isActive}
      soundEnabled={true}
      goHome={handleRestart}
      toggleSound={() => {}}
      selectAnswer={handleAnswer}
      onNext={handleNext}
      onPrev={handlePrev}
      onSkip={handleSkip}
      onSubmit={handleSubmit}
    />
  );
};
