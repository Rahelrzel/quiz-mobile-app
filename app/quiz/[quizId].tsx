import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuizById, useSubmitQuiz } from "../../hooks/useQuizzes";
import { SubmitAnswer } from "../../api/quiz";
import { Alert } from "react-native";
import { PaymentModal } from "../../src/components/organisms/PaymentModal";
import { useGlobalPayment } from "../../hooks/usePayment";
import { usePaymentStatus } from "../../src/context/PaymentContext";
import {
  getQuizSession,
  saveQuizSession,
} from "../../src/services/quizSession";

export default function QuizPlayerScreen() {
  const params = useLocalSearchParams<{
    quizId: string;
    lang?: string;
    restore?: string;
    currentIndex?: string;
    answers?: string;
    questionOrder?: string;
  }>();
  const { quizId, lang: langParam } = params;

  const lang = langParam || "en";
  const router = useRouter();

  const {
    data: quiz,
    isLoading: isQuizLoading,
    isError,
  } = useQuizById(quizId, lang);
  const { mutate: submit, isPending: isSubmitting } = useSubmitQuiz();
  const { getSavedQuizProgress, clearSavedQuizProgress } = useGlobalPayment();
  const { hasPaid, setHasPaid } = usePaymentStatus();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(-1);
  const [userAnswers, setUserAnswers] = useState<SubmitAnswer[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);
  const [questionOrder, setQuestionOrder] = useState<string[]>([]);
  const [isPaymentProcessed, setIsPaymentProcessed] = useState(false);

  const shuffleQuestions = (questions: any[]) => {
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.map((q) => String(q.id));
  };

  // Check for saved payment progress or existing session on mount
  useEffect(() => {
    if (quizId) {
      checkSavedProgress();
    }
  }, [quizId]);

  const checkSavedProgress = async () => {
    try {
      // 1. Check for restoration from payment success screen
      if (params.restore === "true") {
        // This is handled by a separate useEffect below for cleaner state management
        return;
      }

      // 2. Check AsyncStorage for pending payment progress
      const savedProgress = await getSavedQuizProgress();
      if (savedProgress && savedProgress.quizId === quizId) {
        console.log("[QuizPlayer] Restoring from local payment progress");
        setCurrentIndex(savedProgress.currentQuestionIndex);
        if (savedProgress.shuffledQuestionIds) {
          setQuestionOrder(savedProgress.shuffledQuestionIds.map(String));
        }
        // Map back to our userAnswers format
        const recoveredAnswers: SubmitAnswer[] = Object.entries(
          savedProgress.selectedAnswers,
        ).map(([qId, ansIndex]) => ({
          questionId: parseInt(qId),
          selectedIndex: ansIndex as number,
        }));
        setUserAnswers(recoveredAnswers);
        await clearSavedQuizProgress();
      } else {
        // 3. Check backend for existing session
        const session = await getQuizSession(quizId as string);
        if (session && !session.isCompleted) {
          console.log("[QuizPlayer] Restoring from existing backend session");
          setCurrentIndex(session.currentQuestionIndex);
          if (session.questionOrder) {
            setQuestionOrder(session.questionOrder.map(String));
          }
          const recoveredAnswers: SubmitAnswer[] = Object.entries(
            session.answers || {},
          ).map(([qId, ansIndex]) => ({
            questionId: parseInt(qId),
            selectedIndex: ansIndex as number,
          }));
          setUserAnswers(recoveredAnswers);
        } else {
          console.log("[QuizPlayer] No existing session found, starting fresh");
          setCurrentIndex(0);
          setUserAnswers([]);
          // Shuffle will happen in useEffect when quiz data is available
        }
      }
    } catch (error) {
      console.error("[QuizPlayer] Unexpected error during restoration:", error);
    } finally {
      setIsRestoring(false);
    }
  };

  // Handle restoration from payment success route params
  useEffect(() => {
    if (params.restore === "true") {
      console.log(
        "[QuizPlayer] Handling payment success restoration from route params",
      );
      setHasPaid(true);
      setIsPaymentProcessed(true);
      setShowPaymentModal(false);

      if (params.currentIndex) {
        setCurrentIndex(parseInt(params.currentIndex as string));
      }
      if (params.answers) {
        try {
          const recoveredAnswers: SubmitAnswer[] = Object.entries(
            JSON.parse(params.answers as string),
          ).map(([qId, ansIndex]) => ({
            questionId: parseInt(qId),
            selectedIndex: ansIndex as number,
          }));
          setUserAnswers(recoveredAnswers);
        } catch (e) {
          console.error("Failed to parse restored answers:", e);
        }
      }
      if (params.questionOrder) {
        try {
          setQuestionOrder(JSON.parse(params.questionOrder as string));
        } catch (e) {
          console.error("Failed to parse restored order:", e);
        }
      }

      // Clear params from URL to prevent re-restoration on reload
      router.setParams({ restore: undefined });
    }
  }, [quizId, params.restore]);

  useEffect(() => {
    const initFreshSession = async () => {
      if (
        quiz &&
        quiz.questions &&
        !isRestoring &&
        questionOrder.length === 0
      ) {
        console.log("[QuizPlayer] Initializing new shuffled question order");
        const newOrder = shuffleQuestions(quiz.questions);
        setQuestionOrder(newOrder);

        try {
          // Save initial session with web app's payload structure
          await saveQuizSession({
            quizId: Number(quizId),
            currentQuestionIndex: 0,
            answers: {},
            questionOrder: newOrder,
            remainingTime: 0, // Initial session starts at 0 or full time, web app starts at 0 or quiz.timeLimit * 60
            language: "en",
            isCompleted: false,
          });
          console.log("[QuizPlayer] Initial session saved successfully");
        } catch (error) {
          console.error("[QuizPlayer] Failed to save initial session:", error);
        }
      }
    };

    initFreshSession();
  }, [quiz, isRestoring]);

  // Timer logic
  useEffect(() => {
    let timer: any;
    if (quiz && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && quiz) {
      handleFinish();
    }
    return () => clearInterval(timer);
  }, [quiz, timeLeft]);

  // Initializing timer when quiz loads
  useEffect(() => {
    if (quiz && timeLeft === -1) {
      setTimeLeft(quiz.timeLimit * 60);
    }
  }, [quiz, timeLeft]);

  // Trigger payment modal on question 3 (index 2) if not paid
  useEffect(() => {
    console.log("[Quiz] State update:", {
      isQuizLoading,
      isRestoring,
      hasPaid,
      currentIndex,
      shouldShowModal:
        !isQuizLoading && !isRestoring && !hasPaid && currentIndex === 2,
    });

    if (
      currentIndex === 2 &&
      !hasPaid &&
      !isPaymentProcessed &&
      quiz &&
      quiz.questions &&
      quiz.questions.length > 3
    ) {
      console.log("[Quiz] 🚨 TRIGGERING PAYMENT MODAL");
      setShowPaymentModal(true);
    } else {
      setShowPaymentModal(false);
    }
  }, [
    currentIndex,
    hasPaid,
    isPaymentProcessed,
    quiz,
    isQuizLoading,
    isRestoring,
  ]);

  const transformedQuestions = React.useMemo(() => {
    const questions = quiz?.questions;
    if (!questions) return [];

    if (questionOrder.length > 0) {
      return questionOrder
        .map((id) => questions.find((q: any) => String(q.id) === id))
        .filter((q): q is any => q !== undefined)
        .map((q) => ({
          id: q.id,
          question: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswerIndex,
          explanation: q.explanation,
        }));
    }

    return questions.map((q) => ({
      id: q.id,
      question: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswerIndex,
      explanation: q.explanation,
    }));
  }, [quiz, questionOrder]);

  const handleFinish = () => {
    if (isSubmitting) return;

    // Filter out any duplicates if they exist, keeping the latest for each question
    const uniqueAnswers = Array.from(
      new Map(userAnswers.map((a) => [a.questionId, a])).values(),
    );

    submit(
      {
        quizId: quizId,
        payload: { answers: uniqueAnswers },
      },
      {
        onSuccess: (data) => {
          router.replace({
            pathname: "/quiz/result",
            params: {
              score: data.score.toString(),
              passed: data.passed.toString(),
              certificateId: data.certificateId || "",
              quizId: quizId,
              total: transformedQuestions.length.toString(),
              answers: JSON.stringify(data.answers),
            },
          });
        },
        onError: (error: any) => {
          Alert.alert(
            "Submission Failed",
            error.message || "Please try again.",
          );
        },
      },
    );
  };

  const currentQuestion = transformedQuestions[currentIndex];

  const handleSelectAnswer = (index: number) => {
    // Don't allow answering beyond question 3 if not paid
    if (currentIndex === 2 && !hasPaid && !isPaymentProcessed) {
      console.log("[Quiz] 🚨 Blocking answer selection - payment required");
      setShowPaymentModal(true);
      return;
    }

    if (isAnswered) return;

    setSelectedAnswer(index);
    setIsAnswered(true);

    const questionId = currentQuestion.id;
    setUserAnswers((prev) => {
      const existingIndex = prev.findIndex((a) => a.questionId === questionId);
      if (existingIndex !== -1) {
        const newAnswers = [...prev];
        newAnswers[existingIndex] = { questionId, selectedIndex: index };
        return newAnswers;
      }
      return [...prev, { questionId, selectedIndex: index }];
    });

    if (index === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const saveCurrentSession = async (nextIndex: number) => {
    try {
      if (!quizId) return;

      const answersMap: Record<string, number> = {};
      userAnswers.forEach((a) => {
        if (a.questionId && a.selectedIndex !== null) {
          answersMap[String(a.questionId)] = a.selectedIndex;
        }
      });

      console.log(
        `[QuizPlayer] Saving session for quiz ${quizId} at index ${nextIndex}`,
      );

      await saveQuizSession({
        quizId: Number(quizId),
        currentQuestionIndex: nextIndex,
        answers: answersMap,
        questionOrder: questionOrder, // Use state questionOrder
        remainingTime: timeLeft > 0 ? timeLeft : 0, // Always number
        language: "en",
        isCompleted: false,
      });
    } catch (error: any) {
      console.error(
        "[QuizPlayer] Failed to save quiz session:",
        error.message || error,
      );
    }
  };

  const handleNext = () => {
    if (
      currentIndex === 2 &&
      !hasPaid &&
      !isPaymentProcessed &&
      quiz &&
      quiz.questions &&
      quiz.questions.length > 3
    ) {
      setShowPaymentModal(true);
      return;
    }

    const nextIndex = currentIndex + 1;
    if (currentIndex < transformedQuestions.length - 1) {
      setCurrentIndex(nextIndex);
      setSelectedAnswer(null);
      setIsAnswered(false);
      saveCurrentSession(nextIndex);
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswer(null); // In a real app we might want to preserve the answer, but let's stick to the prompt's flow
      setIsAnswered(false);
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds < 0) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getOptionStyle = (index: number) => {
    if (!isAnswered) {
      return selectedAnswer === index
        ? "border-sky-500 bg-sky-50"
        : "border-gray-100 bg-white";
    }

    if (index === currentQuestion.correctAnswer) {
      return "border-green-500 bg-green-50";
    }

    if (
      selectedAnswer === index &&
      selectedAnswer !== currentQuestion.correctAnswer
    ) {
      return "border-red-500 bg-red-50";
    }

    return "border-gray-100 bg-gray-50 opacity-50";
  };

  const getOptionTextColor = (index: number) => {
    if (!isAnswered) {
      return selectedAnswer === index ? "text-sky-600" : "text-gray-700";
    }
    if (index === currentQuestion.correctAnswer) return "text-green-700";
    if (selectedAnswer === index) return "text-red-700";
    return "text-gray-400";
  };

  // Skeleton Loader for Quiz Screen
  if (isQuizLoading || isRestoring) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
        <View className="px-6 py-4 border-b border-gray-50">
          <View className="w-48 h-8 bg-gray-200 rounded-lg animate-pulse" />
        </View>
        <View className="flex-1 px-6 pt-10">
          <View className="w-full h-8 bg-gray-100 rounded-lg mb-4 animate-pulse" />
          <View className="w-3/4 h-8 bg-gray-100 rounded-lg mb-8 animate-pulse" />
          <View className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <View
                key={i}
                className="h-20 bg-gray-50 rounded-2xl mb-4 animate-pulse"
              />
            ))}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (
    isError ||
    !quiz ||
    (transformedQuestions.length === 0 && !isQuizLoading)
  ) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-8">
        <Ionicons name="alert-circle-outline" size={80} color="#EF4444" />
        <Text className="text-2xl font-bold text-gray-900 mt-6 mb-2">
          {isError || !quiz ? "Quiz Not Found" : "No Questions Available"}
        </Text>
        <Text className="text-gray-500 text-center mb-10">
          {isError || !quiz
            ? "The quiz you're looking for might have been moved or deleted."
            : "This quiz doesn't have any questions yet."}
        </Text>
        <TouchableOpacity
          onPress={() => router.replace("/home")}
          className="bg-sky-500 w-full py-4 rounded-2xl items-center"
        >
          <Text className="text-white font-bold text-lg">Back to Home</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: quiz.title,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="ml-4">
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View className="mr-4 bg-sky-50 px-3 py-1.5 rounded-xl flex-row items-center border border-sky-100">
              <Ionicons name="time-outline" size={16} color="#0EA5E9" />
              <Text className="text-sky-600 font-bold ml-1.5">
                {formatTime(timeLeft)}
              </Text>
            </View>
          ),
        }}
      />

      <View className="flex-row px-6 py-4 items-center justify-between border-b border-gray-50">
        <View className="flex-1 h-2 bg-gray-100 rounded-full mr-4">
          <View
            className="h-2 bg-sky-500 rounded-full"
            style={{
              width: `${((currentIndex + 1) / transformedQuestions.length) * 100}%`,
            }}
          />
        </View>
        <Text className="text-gray-400 font-bold">
          {currentIndex + 1}/{transformedQuestions.length}
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-8">
        <Text className="text-2xl font-bold text-gray-900 mb-8">
          {currentQuestion.question}
        </Text>

        <View>
          {currentQuestion.options.map((option: string, index: number) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelectAnswer(index)}
              className={`border-2 rounded-2xl p-5 flex-row items-center mb-4 ${getOptionStyle(index)}`}
              activeOpacity={0.7}
            >
              <View
                className={`w-8 h-8 rounded-full border-2 items-center justify-center mr-4 
                ${
                  isAnswered && index === currentQuestion.correctAnswer
                    ? "border-green-500 bg-green-500"
                    : isAnswered && selectedAnswer === index
                      ? "border-red-500 bg-red-500"
                      : selectedAnswer === index
                        ? "border-sky-500"
                        : "border-gray-200"
                }`}
              >
                {isAnswered &&
                (index === currentQuestion.correctAnswer ||
                  selectedAnswer === index) ? (
                  <Ionicons
                    name={
                      index === currentQuestion.correctAnswer
                        ? "checkmark"
                        : "close"
                    }
                    size={20}
                    color="white"
                  />
                ) : (
                  <Text
                    className={`font-bold ${selectedAnswer === index ? "text-sky-500" : "text-gray-400"}`}
                  >
                    {String.fromCharCode(65 + index)}
                  </Text>
                )}
              </View>
              <Text
                className={`flex-1 text-lg font-semibold ${getOptionTextColor(index)}`}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {isAnswered && (
          <View className="mt-8 bg-gray-50 rounded-3xl p-6 mb-10 border border-gray-100">
            <View className="flex-row items-center mb-3">
              <Ionicons name="information-circle" size={20} color="#0EA5E9" />
              <Text className="text-sky-600 font-bold ml-2">Explanation</Text>
            </View>
            <Text className="text-gray-600 leading-6 italic">
              {currentQuestion.explanation}
            </Text>
          </View>
        )}
      </ScrollView>

      <View className="px-6 py-6 border-t border-gray-50 flex-row">
        <TouchableOpacity
          onPress={handlePrevious}
          disabled={currentIndex === 0}
          className={`rounded-2xl py-4 flex-1 mr-3 items-center border-2 border-gray-100
            ${currentIndex === 0 ? "opacity-30" : "opacity-100"}`}
        >
          <Text className="text-gray-600 font-bold text-lg">Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          disabled={!isAnswered || isSubmitting}
          className={`rounded-2xl py-4 flex-[2] items-center shadow-lg shadow-sky-100 
            ${isAnswered && !isSubmitting ? "bg-sky-500" : "bg-gray-200 shadow-none"}`}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className={`text-white font-bold text-lg`}>
              {currentIndex < transformedQuestions.length - 1
                ? "Next Question"
                : "Finish Quiz"}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <PaymentModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        quizId={quizId as string}
        quizTitle={quiz.title || "Quiz"}
        totalQuestions={transformedQuestions.length}
        currentQuestionIndex={currentIndex}
        selectedAnswers={Object.fromEntries(
          userAnswers.map((a) => [String(a.questionId), a.selectedIndex]),
        )}
        shuffledQuestionIds={transformedQuestions.map((q) => q.id)}
        onCancel={() => router.back()}
        onPaymentComplete={() => {
          setHasPaid(true);
          setIsPaymentProcessed(true);
        }}
      />
    </SafeAreaView>
  );
}
