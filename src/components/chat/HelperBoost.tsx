import { getConfig } from "@/lib/config-loader";

interface HelperBoostProps {
  submitQuery?: (query: string) => void;
  questionOffset?: number;
}

const questions = getConfig().aiProfile.followUpQuestions;

export default function HelperBoost({
  submitQuery,
  questionOffset = 0,
}: HelperBoostProps) {
  if (!submitQuery || !questions.length) return null;

  const visibleQuestions = Array.from(
    { length: Math.min(3, questions.length) },
    (_, index) => questions[(questionOffset + index) % questions.length],
  );

  return (
    <div
      className="quiet-helper-boost"
      aria-label="Suggested follow-up questions"
    >
      {visibleQuestions.map((question) => (
        <button
          key={question}
          type="button"
          onClick={() => submitQuery(question)}
        >
          {question}
        </button>
      ))}
    </div>
  );
}
