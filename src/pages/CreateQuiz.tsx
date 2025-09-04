import React, { useState } from 'react';

export const CreateQuiz: React.FC<{ onCreate: (quiz: any) => void }> = ({ onCreate }) => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [questionText, setQuestionText] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [incorrectAnswers, setIncorrectAnswers] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');

  const addQuestion = () => {
    if (!questionText || !correctAnswer || !incorrectAnswers) return;
    const incorrects = incorrectAnswers.split(',').map(a => a.trim()).filter(a => a);
    if (incorrects.length < 1) return; // Require at least one incorrect answer
    setQuestions([...questions, {
      question: questionText,
      correct_answer: correctAnswer,
      incorrect_answers: incorrects,
      type: 'multiple',
      points: 10
    }]);
    setQuestionText('');
    setCorrectAnswer('');
    setIncorrectAnswers('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || questions.length === 0) return;
    onCreate({ title, questions, scheduleDate });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 to-yellow-200">
      <form className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-center">Create a Quiz</h2>
        <input
          type="text"
          placeholder="Quiz Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <div className="mb-6">
          <h3 className="font-bold mb-2">Add Question</h3>
          <input
            type="text"
            placeholder="Question text"
            value={questionText}
            onChange={e => setQuestionText(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="text"
            placeholder="Correct answer"
            value={correctAnswer}
            onChange={e => setCorrectAnswer(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="text"
            placeholder="Incorrect answers (comma separated)"
            value={incorrectAnswers}
            onChange={e => setIncorrectAnswers(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <button type="button" className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600" onClick={addQuestion}>Add Question</button>
        </div>
        <div className="mb-4">
          <h4 className="font-bold">Questions:</h4>
          <ul className="list-disc ml-6">
            {questions.map((q, idx) => (
              <li key={idx}>{q.question}</li>
            ))}
          </ul>
        </div>
        <input
          type="datetime-local"
          value={scheduleDate}
          onChange={e => setScheduleDate(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          placeholder="Schedule Date"
        />
        <button type="submit" className="w-full bg-yellow-500 text-white py-3 rounded-lg font-bold hover:bg-yellow-600 transition">Create Quiz</button>
      </form>
    </div>
  );
};
