import React, { useState } from 'react';
import PrimaryButton from './PrimaryButton';
import { QuestionInputProps } from 'types/ComponentTypes';
import { QuizData } from 'types/ComponentTypes';
import style from 'styles/components/QuestionInput.module.scss';
import SaveIco from './icons/SaveIco';

/**
 * This component is for adding or editing questions (question and answer)
 * @param {QuizData} quizData - current quiz data (questions and answers, name)
 * @param {setState function} setQuizData - setting quizData
 * @param {setState function} setAddNewQuestion -
 * @param {string} currentQuestion - if question is being edited, initial data will be current question
 * @param {string} currentAnswer - if question is being edited, initial data will be current answer
 * @param {number} currentIndex - question index from quizData.questions array
 * @param {setState function} setEditQuestions - sets array editQuestios which holds indexes of questions which are currently in editin proccess
 * @constructor
 */
export default function QuestionInput({
  quizData,
  setQuizData,
  setAddNewQuestion,
  currentQuestion,
  currentAnswer,
  currentIndex,
  setEditQuestions,
}: QuestionInputProps) {
  const [question, setQuestion] = useState<string>(currentQuestion || '');
  const [answer, setAnswer] = useState<string>(currentAnswer || '');
  const [error, setError] = useState<string>('');

  const saveQuestion = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    // Check if there is question
    if (!question) {
      setError('There is no question!');
      return;
    }

    // Check if there is answer
    if (!answer) {
      setError('There is no answer on question!');
      return;
    }

    // Custom type guard
    const isQuizData = (obj: any): obj is QuizData => {
      return obj && obj.questions && Array.isArray(obj.questions);
    };

    // Check if this question exist in quiz and its new one
    // if (isQuizData(quizData) && quizData?.questions?.some((obj) => obj.question === question)) {
    //     setError('This question exist in this quiz!');
    //     return;
    //   }

    //check if edited question exist in database
    if (
      isQuizData(quizData) &&
      quizData?.questions?.some((obj) => obj.question === question) &&
      !currentQuestion
    ) {
      setError('This question exist in this quiz!');
      return;
    }

    //check if edited question is after edit same as some old in database
    if (
      currentQuestion !== question &&
      isQuizData(quizData) &&
      quizData?.questions?.some((obj) => obj.question === question)
    ) {
      setError('This question exist in this quiz!');
      return;
    }

    // Check if we are editing and current question and answers are the same
    if (currentQuestion && currentAnswer) {
      if (currentQuestion === question && currentAnswer === answer) {
        setError('Your question and answer are same as old, you cant save it.');
        return;
      }
    }

    // !currentQuestion and !currentAnswer - check if this form is used in editing or for new question,
    // if question does not exist - adds it, else replace old question with new one
    if (!currentQuestion && !currentAnswer) {
      setQuizData((prev) => {
        return { ...prev, questions: [...prev.questions, { question, answer }] };
      });
    } else {
      setQuizData((prev) => {
        const newArray = [...prev?.questions];
        if (currentIndex || currentIndex === 0) {
          newArray[currentIndex] = { question, answer };
        }
        return { ...prev, questions: newArray };
      });
    }

    // Change setEditQuestions array to close currently active editing
    if (currentIndex || currentIndex === 0) {
      if (setEditQuestions) {
        setEditQuestions((prev) => prev.filter((el) => el !== currentIndex));
      }
    }

    // Close QuestionInput component
    setAddNewQuestion(false);
  };

  const cancelQuestion = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    // remove modal for editing questions
    if (currentIndex || currentIndex === 0) {
      if (setEditQuestions) {
        setEditQuestions((prev) => prev.filter((el) => el !== currentIndex));
      }
    } else {
      setAddNewQuestion(false);
    }
  };

  return (
    <div className={style.wrapper}>
      <label>
        Question:
        <input
          name='question'
          type='text'
          value={question}
          onChange={(e) => {
            setError('');
            setQuestion(e.target.value);
          }}
        ></input>
      </label>
      <label>
        Answer:
        <input
          name='answer'
          type='text'
          value={answer}
          onChange={(e) => {
            setError('');
            setAnswer(e.target.value);
          }}
        ></input>
      </label>
      <div className={style.buttonsWrapper}>
        <PrimaryButton
          onClick={saveQuestion}
          // button is disabled if current question and answer are the same as old ones
          disabled={
            !question || !answer || (currentQuestion === question && currentAnswer === answer)
          }
        >
          Save Question <SaveIco fill={!question || !answer ? '#1010104D' : '#000000'} />
        </PrimaryButton>
        <PrimaryButton onClick={cancelQuestion}>Cancel</PrimaryButton>
      </div>
      {error ? <p className={style.error}>{error}</p> : null}
    </div>
  );
}
