export interface Question {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  category: string;
  passingScore: number;
  questions: Question[];
}

export interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
  count: number;
}

export const categories: Category[] = [
  {
    id: "aptitude",
    title: "Aptitude",
    description: "Test your logical and reasoning skills",
    icon: "brain",
    count: 12,
  },
  {
    id: "programming",
    title: "Programming",
    description: "Coding and software development quizzes",
    icon: "code",
    count: 15,
  },
  {
    id: "math",
    title: "Math",
    description: "Arithmetic, Algebra and Geometry",
    icon: "plus-minus",
    count: 8,
  },
  {
    id: "english",
    title: "English",
    description: "Grammar, vocabulary and comprehension",
    icon: "languages",
    count: 10,
  },
];

export const mockQuizzes: Quiz[] = [
  {
    id: "prog-1",
    title: "React Native Basics",
    category: "programming",
    passingScore: 70,
    questions: [
      {
        question: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        correctAnswerIndex: 1,
        explanation: "2 + 2 equals 4 because addition combines numbers.",
      },
      {
        question: "What command is used to start an Expo project?",
        options: [
          "npx expo start",
          "npm run start",
          "expo start",
          "All of above",
        ],
        correctAnswerIndex: 0,
        explanation:
          "npx expo start is the modern command to start the Expo CLI development server.",
      },
    ],
  },
  {
    id: "math-1",
    title: "Basic Algebra",
    category: "math",
    passingScore: 60,
    questions: [
      {
        question: "Solve for x: 2x = 10",
        options: ["2", "5", "8", "20"],
        correctAnswerIndex: 1,
        explanation: "Divide both sides by 2: x = 10 / 2 = 5.",
      },
    ],
  },
  {
    id: "apt-1",
    title: "Logical Reasoning",
    category: "aptitude",
    passingScore: 75,
    questions: [
      {
        question: "Which number comes next in the sequence: 2, 4, 8, 16, ...?",
        options: ["20", "24", "32", "64"],
        correctAnswerIndex: 2,
        explanation: "Each number is multiplied by 2 to get the next one.",
      },
    ],
  },
  {
    id: "eng-1",
    title: "Grammar Essentials",
    category: "english",
    passingScore: 80,
    questions: [
      {
        question: "Which of these is a noun?",
        options: ["Run", "Blue", "Apple", "Fast"],
        correctAnswerIndex: 2,
        explanation:
          "Apple is a person, place, or thing, which defines a noun.",
      },
    ],
  },
];
