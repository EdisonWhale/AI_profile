"use client";

interface ChatLandingProps {
  submitQuery: (message: string) => void;
}

const suggestedQuestions = [
  "What did you build at Highmark Health?",
  "How does Conductor recover failed workflows?",
  "How does Engram evaluate memory retrieval?",
];

export default function ChatLanding({ submitQuery }: ChatLandingProps) {
  return (
    <section className="quiet-chat-landing" aria-labelledby="chat-title">
      <h1 id="chat-title">Ask about my work</h1>
      <p>Questions are answered from my experience, projects, and resume.</p>
      <div className="quiet-chat-suggestions" aria-label="Suggested questions">
        {suggestedQuestions.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => submitQuery(question)}
          >
            {question}
          </button>
        ))}
      </div>
    </section>
  );
}
