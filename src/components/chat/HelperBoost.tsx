interface HelperBoostProps {
  submitQuery?: (query: string) => void;
}

const questions = [
  "What did you build at Highmark Health?",
  "How does Conductor recover failed workflows?",
  "How does Engram evaluate memory retrieval?",
];

export default function HelperBoost({ submitQuery }: HelperBoostProps) {
  if (!submitQuery) return null;

  return (
    <div
      className="quiet-helper-boost"
      aria-label="Suggested follow-up questions"
    >
      {questions.map((question) => (
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
