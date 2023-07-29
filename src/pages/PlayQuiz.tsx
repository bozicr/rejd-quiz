import React, { useEffect } from 'react';
import QuestionSlide from 'components/QuestionSlide';
import { Carousel } from 'react-responsive-carousel';
import useAxiosFunction from '../hooks/useAxiosFunction';
import { useParams } from 'react-router-dom';
import { QuizQuestion } from 'types/ComponentTypes';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

function PlayQuiz() {
  const { isLoading, error, data, axiosFetch } = useAxiosFunction();

  // id from params for fetching quiz
  const { id } = useParams();

  useEffect(() => {
    axiosFetch({
      url: `/quizzes/${id}`,
      method: 'get',
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/*if there is error or loading state*/}
      {isLoading ? <p style={{ color: 'white', fontSize: '30px' }}>Loading...</p> : null}
      {error ? <p style={{ color: 'white', fontSize: '30px' }}>{error}</p> : null}

      <Carousel showThumbs={false} useKeyboardArrows={true} autoPlay={false}>
        {data?.questions?.map((question: QuizQuestion) => {
          return (
            <QuestionSlide
              key={question?.id}
              question={question?.question}
              answer={question?.answer}
            />
          );
        })}

        {/*Shows end slide except when we have error or we are in loading proccess*/}
        {!error && !isLoading ? <QuestionSlide endSlide={true} /> : null}
      </Carousel>
    </>
  );
}

export default PlayQuiz;
