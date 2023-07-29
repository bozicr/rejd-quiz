import React from 'react';
import { QuizData } from './ComponentTypes';

export type QuizContextProviderProps = {
  children: React.ReactNode;
};

export type quizReducerActions = {
  type: 'SET_QUIZ_DATA' | 'REMOVE_QUIZ' | 'ADD_NEW_QUIZ';
  payload: QuizData | number | QuizData[];
};
