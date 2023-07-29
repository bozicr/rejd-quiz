import { createContext, useReducer } from 'react';
import { QuizData } from '../types/ComponentTypes';
import { QuizContextProviderProps, quizReducerActions } from '../types/ContextTypes';

const QuizReducer = (state: QuizData[], action: quizReducerActions): QuizData[] => {
  switch (action?.type) {
    case 'SET_QUIZ_DATA':
      if (!action.payload) throw new Error('Action payload is missing!');
      return Array.isArray(action?.payload) ? action?.payload : [];
    case 'REMOVE_QUIZ':
      if (!action.payload || typeof action.payload !== 'number')
        throw new Error('Action payload is missing or it is not a number!');
      return state.filter((quiz) => quiz?.id !== action?.payload);
    case 'ADD_NEW_QUIZ':
      if (!action.payload) throw new Error('Action payload is missing!');
      return typeof action?.payload !== 'number' && !Array.isArray(action?.payload)
        ? [...state, action?.payload]
        : state;
    default:
      return state;
  }
};
const initialQuizData: QuizData[] = []; // Set your initial data here if needed

// CREATE ACTIONS AND STATE HERE TO USE IN CONTEXT

export const QuizContext = createContext<{
  quizData: QuizData[];
  setQuizData: (fetchedQuizData: QuizData[]) => void;
  removeQuiz: (quizId: number) => void;
  addNewQuiz: (newQuizData: QuizData) => void;
}>({
  quizData: initialQuizData,
  setQuizData: () => {},
  removeQuiz: () => {},
  addNewQuiz: () => {},
});

export const QuizContextProvider = ({ children }: QuizContextProviderProps) => {
  const [quizData, dispatchQuiz] = useReducer(QuizReducer, [
    {
      id: 16,
      name: 'Enterwell Quiz',
      questions: [
        {
          id: 1,
          question:
            "Who was the English mathematician and writer widely considered as the world's first computer programmer for her work on Charles Babbage's proposed mechanical general-purpose computer, the Analytical Engine?",
          answer: 'Ada Lovelace',
        },
      ],
    },
  ]);

  const setQuizData = (fetchedQuizData: QuizData[]) => {
    dispatchQuiz({
      type: 'SET_QUIZ_DATA',
      payload: fetchedQuizData,
    });
  };
  const removeQuiz = (quizId: number) => {
    dispatchQuiz({
      type: 'REMOVE_QUIZ',
      payload: quizId,
    });
  };
  const addNewQuiz = (newQuizData: QuizData) => {
    dispatchQuiz({
      type: 'ADD_NEW_QUIZ',
      payload: newQuizData,
    });
  };

  const value = {
    quizData,
    setQuizData,
    removeQuiz,
    addNewQuiz,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
