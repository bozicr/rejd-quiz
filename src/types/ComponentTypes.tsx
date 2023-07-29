import React from 'react';

export type PrimaryButtonProps = {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
};

export type QuizTableColumnNames = {
  name: string;
  sortable: boolean;
};

export type QuizQuestion = {
  id?: number;
  question: string;
  answer: string;
};

export type QuizData = {
  id?: number;
  name: string;
  questions: QuizQuestion[];
};

export type TableProps = {
  quizData: QuizData[] | [];
  isLoading: boolean;
  error: string | boolean | null;
};

export type AxiosMethods = 'post' | 'get' | 'delete' | 'patch' | 'put';

export type Toast = {
  backgroundColor: string;
  color: string;
};

export type AxiosFetchFunctionParams = {
  url: string;
  method: AxiosMethods;
  requestConfig?: {};
  executeOnSuccess?: () => void;
  executeOnFinish?: () => void;
  executeOnError?: () => void;
  total?: boolean;
};

export type QuestionInputProps = {
  quizData: {} | QuizData;
  setQuizData: React.Dispatch<React.SetStateAction<QuizData>>;
  setAddNewQuestion: React.Dispatch<React.SetStateAction<boolean>>;
  currentQuestion?: string;
  currentAnswer?: string;
  currentIndex?: number;
  setEditQuestions?: React.Dispatch<React.SetStateAction<number[]>>;
};

export type ExistingQuestionsModalProps = {
  show: boolean;
  handleClose: () => void;
  quizData: QuizData;
  setQuizData: React.Dispatch<React.SetStateAction<QuizData>>;
};

export type QuestionSlideProps = {
  question?: string;
  answer?: string;
  endSlide?: boolean;
};

export type QuizFormProps = {
  id?: number;
  data?: QuizData;
};

export type ModalDialogProps = {
  title?: string;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  question: string;
  confirmText?: string;
  declineText?: string;
  executeOnConfirm: () => void;
  executeOnDecline?: () => void;
};
