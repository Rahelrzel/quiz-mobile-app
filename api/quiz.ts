import api from "../lib/axios";

export interface QuizTranslation {
  title: string;
  description: string;
  language: string;
}

export interface Question {
  id: number;
  questionText: string;
  options: string[];
  explanation: string;
  correctAnswerIndex: number;
}

export interface Quiz {
  id: number;
  title: string;
  description?: string;
  categoryId: number;
  totalPoints: number;
  timeLimit: number;
  passingScore: number;
  translations: QuizTranslation[];
  questions?: Question[];
}

export interface TestCategory {
  id: number;
  name: string;
  description: string;
}

export interface QuizCategory {
  id: number;
  name: string;
  quizCount: number;
}

export interface SubmitAnswer {
  questionId: string | number;
  selectedIndex: number;
}

export interface SubmitPayload {
  answers: SubmitAnswer[];
}

export interface SubmitResponse {
  passed: boolean;
  score: number;
  certificateId?: string;
  answers: {
    questionId: number;
    selectedIndex: number;
    isCorrect: boolean;
  }[];
}

export interface Certificate {
  id: number;
  user: { name: string };
  category: { name: string };
  quiz: { title: string };
  score: number;
  certificateID: string;
  issueDate: string;
}

export const getCategories = async (): Promise<TestCategory[]> => {
  const response = await api.get<TestCategory[]>("categories");
  return response.data;
};

export const getQuizzes = async (): Promise<Quiz[]> => {
  const response = await api.get<Quiz[]>("quizzes");
  return response.data;
};

export const getQuizById = async (
  id: string | number,
  lang: string = "en",
): Promise<Quiz> => {
  const response = await api.get<Quiz>(`quizzes/${id}`, {
    params: { lang },
  });
  return response.data;
};

export const submitQuiz = async (
  quizId: string | number,
  payload: SubmitPayload,
): Promise<SubmitResponse> => {
  const response = await api.post<SubmitResponse>(
    `quizzes/${quizId}/submit`,
    payload,
  );
  return response.data;
};

export const getCertificate = async (
  id: string | number,
): Promise<Certificate> => {
  const response = await api.get<Certificate>(`certificates/${id}`);
  return response.data;
};

export const createCategory = async (data: {
  name: string;
  description: string;
}): Promise<TestCategory> => {
  const response = await api.post<TestCategory>("categories", data);
  return response.data;
};

export interface QuestionTranslation {
  language: string;
  questionText: string;
  options: string[];
  explanation: string;
}

export interface NewQuestion {
  correctAnswerIndex: number;
  translations: QuestionTranslation[];
}

export interface NewQuiz {
  categoryId: number;
  passingScore: number;
  totalPoints: number;
  timeLimit: number;
  translations: QuizTranslation[];
  questions: NewQuestion[];
}

export const createQuiz = async (data: NewQuiz): Promise<Quiz> => {
  const response = await api.post<Quiz>("quizzes", data);
  return response.data;
};
