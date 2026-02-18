import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@apollo/client/react";
import { GET_QUESTIONS } from "@/lib/graphql/queries";
import { CheckCircle2, ChevronRight, RefreshCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface LessonQuizProps {
  courseId: string;
  lessonId: string;
  onComplete: () => void;
}

export function LessonQuiz({ courseId, lessonId, onComplete }: LessonQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const { data, loading, error } = useQuery(GET_QUESTIONS, {
    variables: { courseId, lessonId },
    skip: !courseId || !lessonId
  });

  const questions = (data as any)?.questions || [];

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>;
  if (error) return <div className="text-destructive p-4">Error loading quiz questions.</div>;
  if (questions.length === 0) return <div className="text-muted-foreground p-8 text-center border rounded-xl border-dashed">No questions found for this quiz.</div>;

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);
    if (selectedOption === currentQuestion.correctOptionIndex) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    const passed = score / questions.length >= 0.7;
    return (
      <div className="text-center p-8 space-y-6">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${passed ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"}`}>
          {passed ? <CheckCircle2 className="w-12 h-12" /> : <RefreshCcw className="w-12 h-12" />}
        </div>
        <div>
          <h3 className="text-2xl font-bold">{passed ? "Quiz Completed!" : "Try Again"}</h3>
          <p className="text-muted-foreground">You scored {score} out of {questions.length} ({Math.round(score / questions.length * 100)}%)</p>
        </div>
        <div className="flex gap-4 justify-center">
          {passed ? (
            <Button variant="gold" onClick={onComplete}>
              Continue to Next Lesson <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button variant="outline" onClick={handleRestart}>
              <RefreshCcw className="w-4 h-4 mr-2" /> Restart Quiz
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
        <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
        <span className="font-medium text-accent">Score: {score}</span>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-medium leading-tight">{currentQuestion.questionText}</h4>

        <div className="grid gap-3">
          {currentQuestion.options.map((option: string, i: number) => {
            let variant = "outline";
            if (isAnswered) {
              if (i === currentQuestion.correctOptionIndex) variant = "gold";
              else if (i === selectedOption) variant = "destructive";
            } else if (selectedOption === i) {
              variant = "secondary";
            }

            return (
              <button
                key={i}
                onClick={() => handleOptionSelect(i)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${isAnswered
                    ? (i === currentQuestion.correctOptionIndex
                      ? "bg-green-500/10 border-green-500/40 text-green-400"
                      : (i === selectedOption ? "bg-red-500/10 border-red-500/40 text-red-500" : "bg-muted/10 border-border/30 text-muted-foreground opacity-50"))
                    : (selectedOption === i ? "bg-accent/10 border-accent text-accent" : "bg-card border-border hover:border-accent/50")
                  }`}
              >
                <span>{option}</span>
                {isAnswered && i === currentQuestion.correctOptionIndex && <CheckCircle2 className="w-5 h-5" />}
              </button>
            );
          })}
        </div>
      </div>

      {isAnswered && currentQuestion.explanation && (
        <div className="p-4 bg-accent/5 rounded-lg border border-accent/20 text-sm">
          <p className="font-medium text-accent mb-1">Explanation:</p>
          <p className="text-muted-foreground italic">{currentQuestion.explanation}</p>
        </div>
      )}

      <div className="flex justify-end pt-4 border-t border-border/50">
        {!isAnswered ? (
          <Button variant="gold" onClick={handleSubmitAnswer} disabled={selectedOption === null}>
            Submit Answer
          </Button>
        ) : (
          <Button variant="gold" onClick={handleNext}>
            {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
