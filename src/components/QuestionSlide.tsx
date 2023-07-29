import React, { useState } from 'react';
import style from 'styles/components/QuestionSlide.module.scss';
import { QuestionSlideProps } from 'types/ComponentTypes';
import HomeIco from './icons/HomeIco';
import { useNavigate } from 'react-router-dom';
import blackImage from 'assets/images/black-background.png';

/**
 * Slider for playing quiz
 * @param {string} question - question text
 * @param {string} answer - answer text
 * @param {boolean} endSlide - if set to true, last slide with goodbye message is shown
 * @constructor
 */
export default function QuestionSlide({ question, answer, endSlide }: QuestionSlideProps) {
  // showAnswer is simple state for displaying answer, controlled by button
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <>
      <div className={style.carouselItem}>
        <button onClick={() => navigate('/')} title={'Home page'} className={style.homeButton}>
          <HomeIco />
        </button>
        <img alt={'black'} src={blackImage} />
        <div className='legend'>
          {endSlide ? <p>End of quiz! Thanks for playing</p> : <p>{question}</p>}

          <section className={style.buttonSection}>
            {endSlide ? (
              <button onClick={() => navigate('/')}>Play more</button>
            ) : (
              <button onClick={() => setShowAnswer((prev) => !prev)}>
                {showAnswer ? 'Hide' : 'Show'} answer
              </button>
            )}
          </section>
          {showAnswer ? <p className={style.answer}>{answer}</p> : null}
        </div>
      </div>
    </>
  );
}
