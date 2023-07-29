import React, { useRef } from 'react';
import style from 'styles/components/SearchInput.module.scss';
import SearchIco from './icons/SearchIco';
import { useSearchParams } from 'react-router-dom';

/**
 * This component is for search field in the top of Home page table
 */
function SearchInput() {
  const [searchParams, setSearchParams] = useSearchParams();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const searchQuiz = () => {
    if (inputRef?.current?.value || inputRef?.current?.value === '') {
      // If there is no value in input box and no parameter q in URL, don't make request
      if (!inputRef?.current?.value && !searchParams.get('q')) return;

      searchParams.set('q', inputRef?.current?.value);
      searchParams.set('_page', '1');
      setSearchParams(searchParams);

      // Clear input box after search
      inputRef.current.value = '';
    }
  };

  const searchQuizOnEnterPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e?.key === 'Enter') {
      searchQuiz();
    }
  };

  return (
    <div className={style.inputWrapper}>
      <input
        ref={inputRef}
        className={style.inputField}
        type={'text'}
        onKeyDown={searchQuizOnEnterPress}
      />
      <div onClick={searchQuiz} className={style.icoWrapper}>
        <SearchIco />
      </div>
    </div>
  );
}

export default SearchInput;
