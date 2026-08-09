interface PresetReplyProps {
  question: string;
  reply: string;
  tool: string;
  onGetAIResponse: (question: string) => void;
  onClose: () => void;
}

export function PresetReply({
  question,
  reply,
  onGetAIResponse,
  onClose,
}: PresetReplyProps) {
  return (
    <section className="quiet-preset-reply" aria-label="Saved answer">
      <p className="quiet-meta">{question}</p>
      <p>{reply}</p>
      <div>
        <button type="button" onClick={() => onGetAIResponse(question)}>
          Ask for more detail
        </button>
        <button type="button" onClick={onClose}>
          Dismiss
        </button>
      </div>
    </section>
  );
}

export default PresetReply;
