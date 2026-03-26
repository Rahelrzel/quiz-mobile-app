import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuizzes, useCategories, useCreateQuiz } from "@/hooks/useQuizzes";

const LANGUAGES = ["en", "fr", "es", "de", "it"] as const;
type Language = (typeof LANGUAGES)[number];

// Uses Pressable + StyleSheet to avoid NativeWind dynamic className
// causing navigation context errors during re-renders
function LanguageToggle({
  currentLang,
  onSwitch,
}: {
  currentLang: Language;
  onSwitch: (lang: Language) => void;
}) {
  return (
    <View style={toggleStyles.container}>
      {LANGUAGES.map((lang) => (
        <Pressable
          key={lang}
          onPress={() => onSwitch(lang)}
          style={[
            toggleStyles.button,
            currentLang === lang && toggleStyles.activeButton,
          ]}
        >
          <Text
            style={[
              toggleStyles.label,
              currentLang === lang && toggleStyles.activeLabel,
            ]}
          >
            {lang}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const toggleStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
    backgroundColor: "white",
    padding: 4,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  activeButton: {
    backgroundColor: "#10b981",
  },
  label: {
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#9CA3AF",
    fontSize: 12,
  },
  activeLabel: {
    color: "white",
  },
});

export default function ManageQuizzes() {
  const router = useRouter();
  const { data: quizzes, isLoading: loadingQuizzes } = useQuizzes("en");
  const {
    data: categories,
    isLoading: loadingCategories,
    isError,
  } = useCategories();
  const { mutate: createQuiz, isPending } = useCreateQuiz();

  const [showForm, setShowForm] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>("en");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [passingScore, setPassingScore] = useState("70");
  const [totalPoints, setTotalPoints] = useState("100");
  const [timeLimit, setTimeLimit] = useState("10");

  const [quizTranslations, setQuizTranslations] = useState<
    Record<Language, { title: string; description: string }>
  >({
    en: { title: "", description: "" },
    fr: { title: "", description: "" },
    es: { title: "", description: "" },
    de: { title: "", description: "" },
    it: { title: "", description: "" },
  });

  const [questions, setQuestions] = useState<
    {
      correctAnswerIndex: number;
      translations: Record<
        Language,
        { questionText: string; options: string[]; explanation: string }
      >;
    }[]
  >([
    {
      correctAnswerIndex: 0,
      translations: {
        en: { questionText: "", options: ["", "", "", ""], explanation: "" },
        fr: { questionText: "", options: ["", "", "", ""], explanation: "" },
        es: { questionText: "", options: ["", "", "", ""], explanation: "" },
        de: { questionText: "", options: ["", "", "", ""], explanation: "" },
        it: { questionText: "", options: ["", "", "", ""], explanation: "" },
      },
    },
  ]);

  const [showCategoryList, setShowCategoryList] = useState(false);

  const updateQuizTranslation = useCallback(
    (lang: Language, field: "title" | "description", value: string) => {
      setQuizTranslations((prev) => ({
        ...prev,
        [lang]: { ...prev[lang], [field]: value },
      }));
    },
    [],
  );

  const updateQuestionTranslation = useCallback(
    (
      qIndex: number,
      lang: Language,
      field: "questionText" | "explanation",
      value: string,
    ) => {
      setQuestions((prev) => {
        const newQuestions = [...prev];
        newQuestions[qIndex].translations[lang][field] = value;
        return newQuestions;
      });
    },
    [],
  );

  const updateOption = useCallback(
    (qIndex: number, lang: Language, oIndex: number, value: string) => {
      setQuestions((prev) => {
        const newQuestions = [...prev];
        newQuestions[qIndex].translations[lang].options[oIndex] = value;
        return newQuestions;
      });
    },
    [],
  );

  const setCorrectAnswer = useCallback((qIndex: number, oIndex: number) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      newQuestions[qIndex].correctAnswerIndex = oIndex;
      return newQuestions;
    });
  }, []);

  const addQuestion = useCallback(() => {
    setQuestions((prev) => [
      ...prev,
      {
        correctAnswerIndex: 0,
        translations: {
          en: { questionText: "", options: ["", "", "", ""], explanation: "" },
          fr: { questionText: "", options: ["", "", "", ""], explanation: "" },
          es: { questionText: "", options: ["", "", "", ""], explanation: "" },
          de: { questionText: "", options: ["", "", "", ""], explanation: "" },
          it: { questionText: "", options: ["", "", "", ""], explanation: "" },
        },
      },
    ]);
  }, []);

  const removeQuestion = useCallback((index: number) => {
    setQuestions((prev) => {
      if (prev.length > 1) {
        return prev.filter((_, i) => i !== index);
      }
      return prev;
    });
  }, []);

  const handleCreate = useCallback(() => {
    const enTitle = quizTranslations.en.title.trim();
    if (!enTitle) {
      Alert.alert("Error", "Quiz Title in English is required.");
      return;
    }

    if (!categoryId) {
      Alert.alert("Error", "Category is required.");
      return;
    }

    const enQuestions = questions.filter(
      (q) => q.translations.en.questionText.trim() !== "",
    );
    if (enQuestions.length === 0) {
      Alert.alert("Error", "At least one question in English is required.");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const enQ = questions[i].translations.en;
      if (enQ.questionText.trim() !== "") {
        if (enQ.options.some((opt) => !opt.trim())) {
          Alert.alert(
            "Error",
            `English Question ${i + 1} must have all 4 options filled.`,
          );
          return;
        }
      }
    }

    const filteredQuizTranslations = Object.entries(quizTranslations)
      .filter(([_, data]) => data.title.trim() !== "")
      .map(([lang, data]) => ({
        language: lang,
        title: data.title.trim(),
        description: data.description.trim(),
      }));

    const filteredQuestions = questions
      .filter((q) => q.translations.en.questionText.trim() !== "")
      .map((q) => ({
        correctAnswerIndex: q.correctAnswerIndex,
        translations: Object.entries(q.translations)
          .filter(([_, data]) => data.questionText.trim() !== "")
          .map(([lang, data]) => ({
            language: lang,
            questionText: data.questionText.trim(),
            options: data.options.map((o) => o.trim()),
            explanation: data.explanation.trim(),
          })),
      }));

    const payload = {
      categoryId: categoryId,
      passingScore: parseInt(passingScore),
      totalPoints: parseInt(totalPoints),
      timeLimit: parseInt(timeLimit) * 60,
      translations: filteredQuizTranslations,
      questions: filteredQuestions,
    };

    // Log payload for debugging
    console.log(
      "[Mobile] Sending quiz payload:",
      JSON.stringify(payload, null, 2),
    );
    console.log(
      "[Mobile] Languages in translations:",
      payload.translations.map((t) => t.language),
    );
    console.log("[Mobile] Questions count:", payload.questions.length);

    createQuiz(payload, {
      onSuccess: () => {
        Alert.alert("Success", "Quiz created successfully");
        setShowForm(false);
        setTimeout(() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace("/admin/quizzes");
          }
        }, 100);
      },
      onError: (error: any) => {
        console.error("[Mobile] Create quiz error:", error);
        console.error("[Mobile] Error response:", error.response?.data);

        // Extract detailed error messages
        let errorMessage = "Failed to create quiz.";

        if (error.response?.data?.errors) {
          // Handle Zod validation errors
          const zodErrors = error.response.data.errors;
          if (Array.isArray(zodErrors)) {
            errorMessage = zodErrors
              .map((e: any) => `${e.field}: ${e.message}`)
              .join("\n");
          } else if (typeof zodErrors === "object") {
            errorMessage = Object.values(zodErrors).flat().join("\n");
          }
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        Alert.alert("Error", errorMessage);
      },
    });
  }, [
    quizTranslations,
    categoryId,
    questions,
    passingScore,
    totalPoints,
    timeLimit,
    createQuiz,
    router,
  ]);

  // Safe language switch with error handling
  const handleLanguageSwitch = useCallback((lang: Language) => {
    try {
      setCurrentLang(lang);
    } catch (error) {
      console.log("Language switch error:", error);
    }
  }, []);

  // Safe back navigation
  const handleBack = useCallback(() => {
    try {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/admin");
      }
    } catch (error) {
      console.log("Back navigation error:", error);
      router.replace("/admin");
    }
  }, [router]);

  const renderSkeletons = () => (
    <View>
      {[1, 2, 3, 4, 5].map((i) => (
        <View
          key={i}
          className="flex-row items-center p-4 border border-gray-100 rounded-2xl mb-4 bg-gray-50 h-24 animate-pulse"
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="px-6 py-4 flex-row items-center justify-between border-b border-gray-50">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={handleBack} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">
            Manage Quizzes
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-6"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row justify-between items-center mb-8">
          <Text className="text-2xl font-bold text-gray-900">Quizzes</Text>
          <TouchableOpacity
            onPress={() => setShowForm(!showForm)}
            className="bg-emerald-500 p-2 rounded-full"
            disabled={isPending}
          >
            <Ionicons
              name={showForm ? "close" : "add"}
              size={32}
              color="white"
            />
          </TouchableOpacity>
        </View>

        {showForm && (
          <View className="bg-gray-50 p-6 rounded-3xl mb-8 border border-gray-100">
            {/* Language Toggle */}
            <LanguageToggle
              currentLang={currentLang}
              onSwitch={setCurrentLang}
            />

            <Text className="text-gray-900 font-bold mb-2">
              Quiz Title ({currentLang.toUpperCase()})
            </Text>
            <TextInput
              value={quizTranslations[currentLang].title}
              onChangeText={(v) =>
                updateQuizTranslation(currentLang, "title", v)
              }
              placeholder="e.g. JavaScript Advanced"
              className="bg-white p-4 rounded-xl mb-4 border border-gray-200"
              editable={!isPending}
            />
            <Text className="text-gray-900 font-bold mb-2">
              Description ({currentLang.toUpperCase()})
            </Text>
            <TextInput
              value={quizTranslations[currentLang].description}
              onChangeText={(v) =>
                updateQuizTranslation(currentLang, "description", v)
              }
              placeholder="Basic technology questions"
              className="bg-white p-4 rounded-xl mb-4 border border-gray-200"
              editable={!isPending}
            />

            <Text className="text-gray-900 font-bold mb-2">Category</Text>
            <TouchableOpacity
              onPress={() => setShowCategoryList(!showCategoryList)}
              className="bg-white p-4 rounded-xl mb-2 border border-gray-200 flex-row justify-between items-center"
              activeOpacity={0.7}
            >
              <Text className={categoryId ? "text-gray-900" : "text-gray-400"}>
                {categoryId
                  ? categories?.find((c) => c.id === categoryId)?.name
                  : "Select Category"}
              </Text>
              <Ionicons
                name={showCategoryList ? "chevron-up" : "chevron-down"}
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>

            {showCategoryList && (
              <View className="bg-white border border-gray-100 rounded-xl mb-4 overflow-hidden">
                {categories?.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => {
                      setCategoryId(cat.id);
                      setShowCategoryList(false);
                    }}
                    className={`p-4 border-b border-gray-50 ${categoryId === cat.id ? "bg-emerald-50" : ""}`}
                  >
                    <Text
                      className={
                        categoryId === cat.id
                          ? "text-emerald-600 font-bold"
                          : "text-gray-700"
                      }
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View className="flex-row justify-between mb-6">
              <View className="w-[48%]">
                <Text className="text-gray-900 font-bold mb-2">Passing %</Text>
                <TextInput
                  value={passingScore}
                  onChangeText={setPassingScore}
                  keyboardType="number-pad"
                  className="bg-white p-4 rounded-xl border border-gray-200"
                  editable={!isPending}
                />
              </View>
              <View className="w-[48%]">
                <Text className="text-gray-900 font-bold mb-2">
                  Time Limit (minutes)
                </Text>
                <TextInput
                  value={timeLimit}
                  onChangeText={setTimeLimit}
                  keyboardType="number-pad"
                  className="bg-white p-4 rounded-xl border border-gray-200"
                  editable={!isPending}
                />
              </View>
            </View>

            <View className="border-t border-gray-200 pt-6 mt-4">
              <Text className="text-xl font-bold text-gray-900 mb-6">
                Questions
              </Text>
              {questions.map((q, qIndex) => (
                <View
                  key={qIndex}
                  className="bg-white p-4 rounded-2xl mb-6 border border-gray-100 shadow-sm"
                >
                  <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-emerald-600 font-bold">
                      Question {qIndex + 1}
                    </Text>
                    {questions.length > 1 && (
                      <TouchableOpacity onPress={() => removeQuestion(qIndex)}>
                        <Ionicons
                          name="trash-outline"
                          size={20}
                          color="#EF4444"
                        />
                      </TouchableOpacity>
                    )}
                  </View>

                  <Text className="text-gray-700 font-semibold mb-2">
                    Text ({currentLang.toUpperCase()})
                  </Text>
                  <TextInput
                    value={q.translations[currentLang].questionText}
                    onChangeText={(v) =>
                      updateQuestionTranslation(
                        qIndex,
                        currentLang,
                        "questionText",
                        v,
                      )
                    }
                    placeholder="Enter question"
                    className="bg-gray-50 p-3 rounded-xl mb-4 border border-gray-100"
                    editable={!isPending}
                  />

                  {q.translations[currentLang].options.map((opt, oIndex) => (
                    <View key={oIndex} className="flex-row items-center mb-3">
                      <TextInput
                        value={opt}
                        onChangeText={(v) =>
                          updateOption(qIndex, currentLang, oIndex, v)
                        }
                        placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                        className="flex-1 bg-gray-50 p-3 rounded-xl border border-gray-100 mr-2"
                        editable={!isPending}
                      />
                      <TouchableOpacity
                        onPress={() => setCorrectAnswer(qIndex, oIndex)}
                        className={`w-8 h-8 rounded-full items-center justify-center border ${q.correctAnswerIndex === oIndex ? "bg-emerald-500 border-emerald-500" : "bg-white border-gray-200"}`}
                      >
                        <Ionicons
                          name="checkmark"
                          size={18}
                          color={
                            q.correctAnswerIndex === oIndex
                              ? "white"
                              : "#E5E7EB"
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  ))}

                  <Text className="text-gray-700 font-semibold mt-2 mb-2">
                    Explanation ({currentLang.toUpperCase()})
                  </Text>
                  <TextInput
                    value={q.translations[currentLang].explanation}
                    onChangeText={(v) =>
                      updateQuestionTranslation(
                        qIndex,
                        currentLang,
                        "explanation",
                        v,
                      )
                    }
                    placeholder="Why is it correct?"
                    className="bg-gray-50 p-3 rounded-xl border border-gray-100"
                    editable={!isPending}
                  />
                </View>
              ))}

              <TouchableOpacity
                onPress={addQuestion}
                className="flex-row items-center justify-center p-3 border-2 border-dashed border-emerald-300 rounded-xl mb-6"
                disabled={isPending}
              >
                <Ionicons name="add-circle-outline" size={24} color="#10b981" />
                <Text className="text-emerald-600 font-bold ml-2">
                  Add Question
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleCreate}
              className={`py-4 rounded-xl items-center ${isPending ? "bg-gray-300" : "bg-emerald-500"}`}
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">
                  Create Quiz
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {loadingQuizzes || loadingCategories ? (
          renderSkeletons()
        ) : isError ? (
          <View className="py-10 items-center">
            <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
            <Text className="text-gray-500 mt-4 text-center">
              Failed to load data. Please try again.
            </Text>
          </View>
        ) : (
          quizzes?.map((quiz) => {
            const translation =
              quiz.translations?.find((t) => t.language === "en") ||
              quiz.translations?.[0];
            const categoryName = categories?.find(
              (c) => c.id === quiz.categoryId,
            )?.name;
            return (
              <View
                key={quiz.id}
                className="flex-row items-center p-4 border border-gray-100 rounded-2xl mb-4 shadow-sm bg-white"
              >
                <View className="bg-emerald-50 p-3 rounded-xl mr-4">
                  <Ionicons name="journal" size={24} color="#10b981" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-bold text-lg leading-6">
                    {translation?.title || quiz.title}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Text className="text-emerald-600 text-xs font-bold uppercase">
                      {categoryName}
                    </Text>
                    <Text className="text-gray-300 mx-2">•</Text>
                    <Text className="text-gray-400 text-sm">
                      {quiz.questions?.length || 0} questions
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
