import { useQRBeastState } from "@/store/store";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import QRcode from "react-qr-code";

type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
};

const quizQuestions: Question[] = [
  {
    question: "Who is the founder of Telegram?",
    options: ["Pavel Durov", "Mark Zuckerberg", "Elon Musk", "Jack Dorsey"],
    correctAnswer: "Pavel Durov",
  },
  {
    question: "Which blockchain is actively used in Telegram?",
    options: ["Ethereum", "Bitcoin", "TON", "Solana"],
    correctAnswer: "TON",
  },
];

let treasureLink =
  "https://t.me/qrBeastBot/start?startapp=treasure-BN7iv6H6JZmChV9ZL8Ix";

const Quiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);
  const changeLink = useQRBeastState((state) => state.changeLink);
  const navigate = useNavigate();

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
      if (currentQuestionIndex + 1 < quizQuestions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    } else {
      setHasErrors(true);
      setShowResult(true);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setHasErrors(false);
  };

  if (showResult) {
    return (
      <div className="p-4 max-w-md mx-auto rounded-xl shadow-md space-y-4">
        {hasErrors ? (
          <>
            <h1 className="text-2xl font-bold">Incorrect Answer</h1>
            <p>Try again!</p>
            <button
              className="mt-4 w-full p-2 bg-blue-500 text-white rounded-md"
              onClick={handleRetry}
            >
              Retry
            </button>
          </>
        ) : (
          <>
            <QRcode
              onClick={() => {
                changeLink(treasureLink);
                navigate("/");
              }}
              fgColor="#3EB489"
              bgColor="#000000"
              value={treasureLink}
            />
            <h1 className="text-2xl font-bold">Congratulations!</h1>
            <p>
              You answered correctly on {score} out of {quizQuestions.length}{" "}
              questions.
            </p>
          </>
        )}
      </div>
    );
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];

  return (
    <div className="p-4 max-w-md mx-auto rounded-xl shadow-md space-y-4">
      <h1 className="text-xl font-bold">{currentQuestion.question}</h1>
      <div className="space-y-2">
        {currentQuestion.options.map((option) => (
          <button
            key={option}
            className={`w-full p-2 border rounded-md text-left ${selectedAnswer === option ? "bg-blue-500 text-white" : "bg-gray-600 text-white"}`}
            onClick={() => handleAnswerSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <button
        className="mt-4 w-full p-2 bg-green-500 text-white rounded-md"
        onClick={handleSubmit}
        disabled={!selectedAnswer}
      >
        Submit Answer
      </button>
    </div>
  );
};

export default Quiz;
