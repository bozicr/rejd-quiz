import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import useAxiosFunction from '../hooks/useAxiosFunction';
import SearchIco from 'components/icons/SearchIco';
import { ExistingQuestionsModalProps, QuizData, QuizQuestion } from 'types/ComponentTypes';
import style from 'styles/components/ExistingQuestionsModal.module.scss';

/**
 *
 * @param {boolean} show - used for displaying and hiding modal
 * @param {function} handleClose - for closing modal
 * @param {QuizData} quizData - current data from quiz (questions, name ...)
 * @param {set function} setQuizData - changes current data from quiz
 * @constructor
 */
function ExistingQuestionsModal({
  show,
  handleClose,
  quizData,
  setQuizData,
}: ExistingQuestionsModalProps) {
  const { data, axiosFetch, error: fetchingError, isLoading } = useAxiosFunction();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string>('');

  /**
   * @param {QuizData} existingQuizData - current quiz data, looping through them to check if selected question from database already
   * exist in quiz data
   */

  useEffect(() => {
    if (show) {
      axiosFetch({
        url: `questions?q=${inputRef?.current?.value}`,
        method: 'get',
      });
    }
  }, [show]); // eslint-disable-line react-hooks/exhaustive-deps

  const insertExistingQuestion = (existingQuizData: QuizQuestion) => {
    setError('');

    // Custom type guard
    const isQuizData = (obj: any): obj is QuizData => {
      return obj && obj.questions && Array.isArray(obj.questions);
    };

    if (
      isQuizData(quizData) &&
      quizData?.questions?.some((obj) => obj.question === existingQuizData?.question)
    ) {
      setError('This question exist in this quiz!');
      return;
    }

    setQuizData((prev) => {
      return { ...prev, questions: [...prev.questions, existingQuizData] };
    });
  };

  // Sends request with parameter from URL
  const searchByTheTerm = () => {
    axiosFetch({
      url: `questions?q=${inputRef?.current?.value}`,
      method: 'get',
    });
  };

  const searchQuizOnEnterPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e?.key === 'Enter') {
      searchByTheTerm();
    }
  };

  return (
    <div className={style.wrapper}>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop='static'
        keyboard={false}
        className={style.modal}
      >
        <Modal.Header
          closeButton
          onClick={() => {
            handleClose();
            setError('');
          }}
        >
          <Modal.Title>Just click on question to add it!</Modal.Title>
        </Modal.Header>

        <div className={style.inputWrapper}>
          <input ref={inputRef} type={'text'} onKeyDown={searchQuizOnEnterPress} />
          <button onClick={searchByTheTerm}>
            <SearchIco />
          </button>
        </div>
        {isLoading ? <p style={{ margin: 'auto' }}>Loading...</p> : null}
        {fetchingError && !isLoading ? (
          <p className={style.error}>Error happened! Can't load questions.</p>
        ) : null}
        {error ? <p className={style.error}>{error}</p> : null}

        <Modal.Body>
          {data?.map((question: QuizQuestion) => (
            <div
              key={question?.id}
              className={style.question}
              onClick={() =>
                insertExistingQuestion({ question: question?.question, answer: question?.answer })
              }
            >
              {question?.question}
            </div>
          ))}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => {
              handleClose();
              setError('');
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ExistingQuestionsModal;
