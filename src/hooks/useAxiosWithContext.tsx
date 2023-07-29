import { useState, useEffect } from 'react';
import { AxiosMethods } from '../types/ComponentTypes';
import quizInstance from '../axios_instances/quizInstance';
import useGlobalStateHook from './useGlobalStateHook';

/**
 * This hook updates context data, we are keeping quizzes data from Home page in context. When we delete question, if request was successfully
 * we update context and then we don't need to fetch data again to get fresh one
 * @param {string} url - request string
 * @param {string} method - request method
 * @param {object} requestConfig - config object for request
 * @param {number} returnTotal - total for pagination
 */
function useAxiosWithContext(
  url: string,
  method: AxiosMethods,
  requestConfig: {},
  returnTotal: boolean = false,
) {
  const [error, setError] = useState<string | null | boolean>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number | null | undefined>(null);

  const { setQuizData } = useGlobalStateHook();

  useEffect(() => {
    // Using abort controller for canceling request if we unmount component
    const controller = new AbortController();

    const fetchData = async (url: string, method: AxiosMethods) => {
      try {
        // @ts-ignore
        const res = await quizInstance[method?.toLowerCase()](url, {
          ...requestConfig,
          signal: controller.signal,
        });
        setQuizData(res?.data);
        setTotal(res?.headers?.['x-total-count']);
        setError(null);
      } catch (error: any | unknown) {
        setError(error?.message);
        setQuizData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData(url, method);

    return () => {
      controller.abort();
    };
  }, [url]); // eslint-disable-line react-hooks/exhaustive-deps

  if (returnTotal) return { error, isLoading, total };
  return { error, isLoading };
}

export default useAxiosWithContext;
