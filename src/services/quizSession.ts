import api from "../../lib/axios";

interface SaveSessionParams {
  quizId: string | number;
  currentQuestionIndex: number;
  answers: Record<string, number | null>;
  questionOrder: string[];
  remainingTime: number;
  language?: string;
  isCompleted?: boolean;
}

export const saveQuizSession = async (params: SaveSessionParams) => {
  try {
    // IMPORTANT: Match web app's payload structure exactly
    const payload = {
      quizId: Number(params.quizId),
      currentQuestionIndex: Number(params.currentQuestionIndex),
      answers: params.answers || {},
      questionOrder: params.questionOrder || [],
      remainingTime:
        params.remainingTime !== undefined && params.remainingTime !== null
          ? Number(params.remainingTime)
          : 0, // Always number, never null
      language: params.language || "en",
      isCompleted: params.isCompleted || false,
    };

    console.log(
      "[quizSession.service] Saving session payload:",
      JSON.stringify(payload, null, 2),
    );

    const response = await api.post("/quiz-sessions/save", payload);
    return response.data;
  } catch (error: any) {
    console.error(
      "[quizSession.service] Failed to save quiz session:",
      error.message || error,
    );
    throw error;
  }
};

export const getQuizSession = async (quizId: string | number) => {
  try {
    const response = await api.get(`/quiz-sessions/${Number(quizId)}`);
    return response.data;
  } catch (error: any) {
    // Handle both normalized and raw Axios errors
    const status = error.status || error.response?.status;
    if (status === 404) {
      console.log(
        `[getQuizSession] No existing session found for quiz ${quizId}, starting fresh`,
      );
      return null;
    }
    console.error("[getQuizSession] Unexpected error:", error.message || error);
    throw error;
  }
};

export const completeQuizSession = async (quizId: string) => {
  try {
    const response = await api.post("/quiz-sessions/complete", {
      quizId: parseInt(quizId),
    });
    return response.data;
  } catch (error) {
    console.error("Failed to complete quiz session:", error);
    throw error;
  }
};
