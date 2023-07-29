import React from 'react';
import useAxios from '../hooks/useAxiosWithContext';
import { useSearchParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { NUMBER_OF_ITEMS_PER_PAGE_ARRAY } from '../constants';
import ReactPaginate from 'react-paginate';
import useGlobalStateHook from '../hooks/useGlobalStateHook';
import SearchInput from '../components/SearchInput';
import PrimaryButton from '../components/PrimaryButton';
import Table from '../components/Table';
import 'react-toastify/dist/ReactToastify.css';
import style from '../styles/pages/Home.module.scss';

function Home() {
  // On initial page render, when we don't have any _limit params in url, default will be 5
  // That is achieved by giving useSearchParams initial value

  const { quizData } = useGlobalStateHook();

  const [searchParams, setSearchParams] = useSearchParams(
    `_limit=${NUMBER_OF_ITEMS_PER_PAGE_ARRAY[0]}`,
  );

  // Replacing %2C with "," before activating API URL, json server accepts "," for separating parameter multiple values
  const fetchQuizDataUrl = `quizzes?${searchParams?.toString().replaceAll('%2C', ',')}`;

  const pageLimitSize: string | number =
    searchParams?.get('_limit') || NUMBER_OF_ITEMS_PER_PAGE_ARRAY[0];

  // Resets page to first after changing items per page
  const changeNumberOfItemsPerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    searchParams.set('_limit', e?.target?.value);
    searchParams.set('_page', '1');
    setSearchParams(searchParams);
  };

  // Paginate starts from 0 and fetching with JSON server starts with 1, that is the reason for +1 and -1 configuration
  const handlePaginationClick = (selectedNumber: number) => {
    searchParams.set('_page', (selectedNumber + 1)?.toString());
    setSearchParams(searchParams);
  };

  const { error, isLoading, total } = useAxios(fetchQuizDataUrl, 'get', {}, true);

  return (
    <div className={style.pageWrapper}>
      <div className={style.tableInfoRow}>
        <div className={style.logoText}>Rejd-quiz</div>
        <SearchInput />
        <div className={style.tableButtons}>
          <select
            defaultValue={pageLimitSize}
            className={style.select}
            name='cars'
            id='cars'
            onChange={changeNumberOfItemsPerPage}
          >
            {NUMBER_OF_ITEMS_PER_PAGE_ARRAY?.map((itemsLimit) => {
              return (
                <option key={itemsLimit} value={itemsLimit}>
                  {itemsLimit}
                </option>
              );
            })}
          </select>
          <NavLink className={style.link} to={'/add-quiz'}>
            <PrimaryButton>Create New Quiz</PrimaryButton>
          </NavLink>
        </div>
      </div>

      <Table quizData={quizData} isLoading={isLoading} error={error} />

      <ReactPaginate
        breakLabel='...'
        nextLabel='>'
        onPageChange={(selectedValue) => handlePaginationClick(selectedValue.selected)}
        pageRangeDisplayed={2}
        pageCount={Math.ceil(Number(total) / Number(pageLimitSize))}
        previousLabel='<'
        renderOnZeroPageCount={null}
        className={style.pagination}
        activeClassName={style.active}
        forcePage={
          Number(searchParams.get('_page')) - 1 < 0 ? 0 : Number(searchParams.get('_page')) - 1
        }
      />
    </div>
  );
}

export default Home;
