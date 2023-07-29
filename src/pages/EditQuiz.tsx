import React, { useEffect } from 'react';
import QuizForm from 'components/QuizForm';
import { useParams } from 'react-router-dom';
import useAxiosFunction from 'hooks/useAxiosFunction';

export default function EditQuiz() {
  const { id } = useParams();
  const { data, axiosFetch, error } = useAxiosFunction();

  useEffect(() => {
    axiosFetch({
      url: `quizzes/${id}`,
      method: 'get',
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <QuizForm id={Number(id)} data={data} />
      {error}
    </div>
  );
}
