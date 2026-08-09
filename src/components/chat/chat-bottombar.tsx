"use client";

import { ChatRequestOptions } from "ai";
import { ArrowRight, Square } from "lucide-react";
import React, { useEffect, useRef } from "react";

interface ChatBottombarProps {
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (
    event: React.FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions,
  ) => void;
  isLoading: boolean;
  stop: () => void;
  input: string;
  isToolInProgress: boolean;
}

export default function ChatBottombar({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  stop,
  isToolInProgress,
}: ChatBottombarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="quiet-chat-form">
      <label className="sr-only" htmlFor="chat-question">
        Ask about experience or projects
      </label>
      <input
        id="chat-question"
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder={isToolInProgress ? "Preparing a response" : "Ask about experience or projects"}
        disabled={isToolInProgress || isLoading}
      />
      <button
        type={isLoading ? "button" : "submit"}
        disabled={!isLoading && (!input.trim() || isToolInProgress)}
        aria-label={isLoading ? "Stop response" : "Send question"}
        onClick={(event) => {
          if (!isLoading) return;
          event.preventDefault();
          stop();
        }}
      >
        {isLoading ? <Square aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
      </button>
    </form>
  );
}
