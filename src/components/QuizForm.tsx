import React, { useState, useEffect } from 'react';
import { QuizData, QuizFormProps } from 'types/ComponentTypes';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { successToastStyle, errorToastStyle } from '../styles/ToastStyles';
import QuestionInput from './QuestionInput';
import ExistingQuestionsModal from './ExistingQuestionsModal';
import PrimaryButton from './PrimaryButton';
import useAxiosFunction from '../hooks/useAxiosFunction';
import AddIco from './icons/AddIco';
import SaveIco from './icons/SaveIco';
import DatabaseIco from './icons/DatabaseIco';
import EditIco from './icons/EditIco';
import TrashBinIco from './icons/TrashBinIco';
import BackIco from './icons/BackIco';
import style from 'styles/components/QuizForm.module.scss';

/**
 * This component is used for quiz making and editing, if it is in editing it needs those props below
 * @param {number} id - if we are editing quiz, we need to pass it's id
 * @param {QuizData} data - if we are editing quiz we need to pass it's data
 * @constructor
 */
export default function QuizForm({ id, data }: QuizFormProps) {
  const [quizData, setQuizData] = useState<QuizData>({ name: '', questions: [] });

  // controls QuestionInput, if it is showed or not
  const [addNewQuestion, setAddNewQuestion] = useState<boolean>(true);

  // validation errors
  const [error, setError] = useState<string>('');

  // array of indexes of questions that we are currently editing
  const [editQuestions, setEditQuestions] = useState<number[]>([]);

  // for showing existingQuestionsModal - modal for adding questions from database
  const [show, setShow] = useState<boolean>(false);

  const { isLoading, axiosFetch } = useAxiosFunction();
  const navigate = useNavigate();

  useEffect(() => {
    data && setQuizData(data);
  }, [data]);

  const disabledSave: boolean =
    !quizData?.name || quizData?.questions?.length === 0 || addNewQuestion;

  // Show input fields for new questions
  const showQuestionInput = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setAddNewQuestion(true);
  };

  const saveQuiz = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setError('');

    // Check if there is quiz name
    if (!quizData?.name) {
      setError('No quiz name!');
      return;
    }

    // Check if there are any questions
    if (quizData?.questions?.length === 0) {
      setError('No quiz questions!');
      return;
    }

    // Check if question modal is opened
    if (addNewQuestion) {
      setError('Finish your question!');
    }

    axiosFetch({
      url: data ? `/quizzes/${id}` : '/quizzes',
      method: data ? 'patch' : 'post',
      requestConfig: quizData,
      executeOnSuccess: () => {
        toast(`Successful saved quiz!`, { style: successToastStyle });
        navigate('/');
      },
      executeOnError: () =>
        toast(`Error, quiz is not saved! Some error happened`, { style: errorToastStyle }),
    });
  };

  // Change array which contains indexes of currently editing questions
  const editQuestionHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number,
  ) => {
    e.preventDefault();
    setEditQuestions((prev) => [...prev, index]);
  };

  // Remove question from quiz
  const removeQuestion = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, idx: number) => {
    e.preventDefault();
    setQuizData((prev) => {
      const newArray = [...prev?.questions];
      newArray.splice(idx, 1);
      return { ...prev, questions: newArray };
    });
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Show modal for adding existing questions in database
  const addExistingQuestion = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    handleShow();
  };

  return (
    <div className={style.wrapper}>
      <button onClick={() => navigate(-1)} className={style.backButton}>
        <BackIco />
      </button>

      <h3>{data ? 'EDIT' : 'ADD NEW'} QUIZ</h3>

      <form style={{ display: 'flex', flexDirection: 'column' }}>
        {/*Quiz name controlled input field*/}
        <label className={style.wrapper}>
          Quiz name:
          <input
            type='text'
            id='name'
            value={quizData?.name}
            onChange={(e) => {
              setQuizData((prev) => {
                return { ...prev, name: e.target.value };
              });
            }}
          ></input>
        </label>

        {/*Map through quizData questions and renders them with edit button, if edit is clicked,*/}
        {/*question data fills QuestionInput component*/}

        {quizData?.questions?.length > 0 ? <p>Questions:</p> : null}
        {quizData?.questions?.length > 0 &&
          quizData?.questions?.map((question, idx) => (
            <div key={question?.id || question?.question}>
              {/* If editQuestions array has index of current question, opens it in QuestionInput form or just renders it as normal saved question*/}
              {editQuestions?.includes(idx) ? (
                <QuestionInput
                  quizData={quizData}
                  setQuizData={setQuizData}
                  setAddNewQuestion={setAddNewQuestion}
                  currentQuestion={quizData?.questions[idx].question}
                  currentAnswer={quizData?.questions[idx].answer}
                  currentIndex={idx}
                  setEditQuestions={setEditQuestions}
                />
              ) : (
                <div className={style.quizQuestion}>
                  {question?.question} - {question?.answer}
                  <div className={style.questionButtons}>
                    <PrimaryButton onClick={(e) => editQuestionHandler(e, idx)}>
                      <EditIco />
                    </PrimaryButton>
                    <PrimaryButton onClick={(e) => removeQuestion(e, idx)}>
                      <TrashBinIco />
                    </PrimaryButton>
                  </div>
                </div>
              )}
            </div>
          ))}

        {/*If addNewQuestion is true, show QuestionInput component*/}
        {addNewQuestion ? (
          <QuestionInput
            quizData={quizData}
            setQuizData={setQuizData}
            setAddNewQuestion={setAddNewQuestion}
          />
        ) : null}

        {error}

        {/*Buttons in bottom of page*/}
        <div className={style.buttonsWrapper}>
          <PrimaryButton onClick={showQuestionInput}>
            Add new question <AddIco />{' '}
          </PrimaryButton>
          <PrimaryButton onClick={addExistingQuestion}>
            Add existing question <DatabaseIco />{' '}
          </PrimaryButton>
          <PrimaryButton onClick={saveQuiz} disabled={disabledSave || isLoading}>
            {data ? 'Update Quiz' : 'Save Quiz '}
            <SaveIco fill={disabledSave ? '#1010104D' : '#000000'} />
          </PrimaryButton>
        </div>

        <ExistingQuestionsModal
          show={show}
          handleClose={handleClose}
          quizData={quizData}
          setQuizData={setQuizData}
        />
      </form>
    </div>
  );
}
