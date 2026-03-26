import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getQuizzes,
  getCategories,
  getQuizById,
  submitQuiz,
  getCertificate,
  createCategory,
  createQuiz,
  Quiz,
  NewQuiz,
  TestCategory,
  QuizCategory,
  SubmitPayload,
  SubmitResponse,
  Certificate,
} from "../api/quiz";

const getCategoryId = (quiz: Quiz): number => {
  return typeof quiz.categoryId === "string"
    ? parseInt(quiz.categoryId)
    : quiz.categoryId;
};

export const useQuizzes = (lang: string = "en") => {
  return useQuery<Quiz[]>({
    queryKey: ["quizzes", lang],
    queryFn: getQuizzes,
  });
};

export const useCategories = () => {
  return useQuery<TestCategory[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
};

export const useQuizzesByCategory = (
  categoryId: string | number,
  lang: string = "en",
) => {
  return useQuery<Quiz[]>({
    queryKey: ["quizzes", "category", categoryId, lang],
    queryFn: async () => {
      const quizzes = await getQuizzes();
      const id =
        typeof categoryId === "string" ? parseInt(categoryId) : categoryId;
      return quizzes.filter((quiz) => getCategoryId(quiz) === id);
    },
    enabled: !!categoryId,
  });
};

export const useQuizById = (
  quizId: string | number,
  language: string = "en",
) => {
  return useQuery<Quiz>({
    queryKey: ["quiz", quizId, language],
    queryFn: () => getQuizById(quizId, language),
    enabled: !!quizId,
  });
};

export const useQuizCategories = (lang: string = "en") => {
  return useQuery<QuizCategory[]>({
    queryKey: ["quizCategories", lang],
    queryFn: async () => {
      const [categories, quizzes] = await Promise.all([
        getCategories(),
        getQuizzes(),
      ]);

      return categories.map((category: TestCategory) => ({
        id: category.id,
        name: category.name,
        quizCount: quizzes.filter(
          (quiz: Quiz) => getCategoryId(quiz) === category.id,
        ).length,
      }));
    },
  });
};

export const useSubmitQuiz = () => {
  return useMutation<
    SubmitResponse,
    Error,
    { quizId: string | number; payload: SubmitPayload }
  >({
    mutationFn: ({ quizId, payload }) => submitQuiz(quizId, payload),
  });
};

export const useCertificate = (certificateId: string | number) => {
  return useQuery<Certificate>({
    queryKey: ["certificate", certificateId],
    queryFn: () => getCertificate(certificateId),
    enabled: !!certificateId,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizCategories"] });
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
};

export const useCreateQuiz = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: NewQuiz) => createQuiz(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
  });
};
