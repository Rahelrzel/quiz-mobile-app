export const normalizeQuestionOptions = (options: unknown): string[] => {
  if (Array.isArray(options)) {
    return options.map((option) => String(option));
  }

  if (typeof options === "string") {
    try {
      const parsed = JSON.parse(options);
      return Array.isArray(parsed) ? parsed.map((option) => String(option)) : [];
    } catch {
      return [];
    }
  }

  return [];
};

export const mapApiQuestion = (question: any) => ({
  id: question.id,
  question: question.questionText?.trim() || "",
  options: normalizeQuestionOptions(question.options),
  correctAnswer: question.correctAnswerIndex,
  explanation: question.explanation,
  locked: Boolean(question.locked),
});

export const isQuestionLoadable = (question?: {
  locked?: boolean;
  question?: string;
  options?: string[];
}) =>
  Boolean(
    question &&
      !question.locked &&
      question.question &&
      Array.isArray(question.options) &&
      question.options.length > 0,
  );
