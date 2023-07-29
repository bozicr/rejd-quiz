import React, { useState } from 'react';
import LoadingSpinner from 'components/LoadingSpinner';
import { QUIZ_TABLE_COLUMN_NAMES } from '../constants';
import useAxiosFunction from '../hooks/useAxiosFunction';
import useGlobalStateHook from '../hooks/useGlobalStateHook';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { TableProps } from 'types/ComponentTypes';
import style from 'styles/components/Table.module.scss';
import TrashBinIco from './icons/TrashBinIco';
import PlayIco from './icons/PlayIco';
import SortIco from './icons/SortIco';
import { successToastStyle, errorToastStyle } from '../styles/ToastStyles';

/**
 * Table from Home page for quizzes display, it has basic data about quizes
 * @param {QuizData} quizData - all quizzes fetched from server
 * @param {boolean} isLoading - if quizData is loading
 * @param {boolean} error - if quizData has error with fetching
 * @constructor
 */
function Table({ quizData, isLoading, error }: TableProps) {
  // Items on user clicked for deleting, we use this for spinner
  const [idOfItemInDeletingProcess, setIdOfItemInDeletingProcess] = useState<number[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { removeQuiz } = useGlobalStateHook();

  const { isLoading: deleteLoading, axiosFetch } = useAxiosFunction();

  const deleteQuiz = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number) => {
    e.stopPropagation();
    setIdOfItemInDeletingProcess((prev) => [...prev, id]);

    await axiosFetch({
      url: `quizzes/${id}`,
      method: 'delete',
      executeOnSuccess: () => {
        removeQuiz(id);
        toast(`Success!`, { style: successToastStyle });
      },
      executeOnFinish: () => {
        setIdOfItemInDeletingProcess((prev) => prev.filter((el) => el !== id));
      },
      executeOnError: () => {
        toast(`Error!`, { style: errorToastStyle });
      },
    });
  };

  const sortTableData = (columnName: string) => {
    // It supports multiple field sorting
    // Get current sorting and order fields as array
    const sortingFieldsArray: string[] = searchParams.get('_sort')?.split(',') || [];
    const sortingOrderArray: string[] = searchParams.get('_order')?.split(',') || [];

    // Forming new sorting fields and order arrays that will be pushed into url
    let newSortFields,
      newOrderFields: string[] = [];

    // If there is selected field in url, then change its order, or if it does not exist, add it and give 'asc' order
    if (sortingFieldsArray.includes(columnName)) {
      newSortFields = [...sortingFieldsArray];
      newOrderFields = [...sortingOrderArray];
      const index: number = sortingFieldsArray.indexOf(columnName);
      newOrderFields[index] = newOrderFields[index] === 'asc' ? 'desc' : 'asc';
    } else {
      newSortFields = [...sortingFieldsArray, columnName];
      newOrderFields = [...sortingOrderArray, 'asc'];
    }

    // Setting new sorting fields
    searchParams.set('_sort', newSortFields?.join(','));
    searchParams.set('_order', newOrderFields?.join(','));

    searchParams.set('_page', '1');
    setSearchParams(searchParams);
  };

  const onRowClick = (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>, id: number) => {
    navigate(`/edit-quiz/${id}`);
  };

  const playQuiz = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number) => {
    e.stopPropagation();
    navigate(`/play-quiz/${id}`);
  };

  return (
    <>
      <table className={style.table}>
        <thead>
          <tr>
            {QUIZ_TABLE_COLUMN_NAMES?.map((column) => {
              return (
                <th key={column?.name}>
                  <div className={style.tableHeaderWrapper}>
                    {column?.name}
                    {column?.sortable ? (
                      <button
                        onClick={() => sortTableData(column?.name?.toLowerCase())}
                        className={style.sortButton}
                      >
                        <SortIco />
                      </button>
                    ) : null}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {/*quiz?.id.toString() in map below is used to resolve TS  error Type 'Number' is not assignable to type 'ReactNode'.*/}
          {isLoading ? (
            <tr className={style.messageTr}>
              <td style={{ justifyContent: 'left' }}>Loading...</td>
            </tr>
          ) : error ? (
            <tr className={style.messageTr}>
              {/*checking if error text is canceled and display Loading... instead if candeled. */}
              {/*Canceled is cast from axios interceptor*/}
              <td style={{ justifyContent: 'left' }}>
                {error === 'canceled' ? 'Loading...' : error}
              </td>
            </tr>
          ) : quizData?.length === 0 ? (
            <tr className={style.messageTr}>
              <td style={{ justifyContent: 'left' }}>
                No data found! Change terms or refresh page.
              </td>
            </tr>
          ) : (
            quizData?.map((quiz) => {
              return (
                <tr
                  key={quiz?.id}
                  title={`Edit "${quiz?.name}" quiz`}
                  onClick={(e) => quiz?.id && onRowClick(e, quiz?.id)}
                >
                  <td>{quiz?.id?.toString()}</td>
                  <td>{quiz?.name}</td>
                  <td>
                    <button
                      title={'Play quiz'}
                      className={style.actionButton}
                      onClick={(e) => quiz?.id && playQuiz(e, quiz?.id)}
                    >
                      <PlayIco />
                    </button>
                    {deleteLoading && quiz?.id && idOfItemInDeletingProcess?.includes(quiz?.id) ? (
                      <LoadingSpinner />
                    ) : (
                      <>
                        <button
                          onClick={(e) => {
                            if (quiz?.id) deleteQuiz(e, quiz?.id);
                          }}
                          title={'Delete quiz'}
                          className={style.actionButton}
                        >
                          <TrashBinIco />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </>
  );
}

export default Table;
