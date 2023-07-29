import { useState, useEffect } from 'react';
import { AxiosFetchFunctionParams } from '../types/ComponentTypes';
import quizInstance from '../axios_instances/quizInstance';

const useAxiosFunction = () => {
  const [data, setData] = useState<any>();
  const [error, setError] = useState<string | null | boolean>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [controller, setController] = useState<AbortController>();

  /**
   * Wr use axios instance in this fetch custom hook
   * @param {string} url - request url
   * @param {string} method - request method
   * @param {object} requestConfig - request config object
   * @param {function} executeOnSuccess - function that executes on success
   * @param {function} executeOnFinish - function that executes on finally block
   * @param {function} executeOnError - function that executes on error
   */
  const axiosFetch = async ({
    url,
    method,
    requestConfig,
    executeOnSuccess,
    executeOnFinish,
    executeOnError,
  }: AxiosFetchFunctionParams): Promise<void> => {
    try {
      setIsLoading(true);
      const ctrl: AbortController = new AbortController();
      setController(ctrl);
      // @ts-ignore
      const res = await quizInstance[method?.toLowerCase()](url, {
        ...requestConfig,
        signal: ctrl.signal,
      });
      setData(res?.data);
      setError(null);
      executeOnSuccess && executeOnSuccess();
    } catch (error: any | unknown) {
      setError(error?.message);
      setData(undefined);
      executeOnError && executeOnError();
    } finally {
      setIsLoading(false);
      executeOnFinish && executeOnFinish();
    }
  };

  useEffect(() => {
    return () => controller && controller.abort();
  }, [controller]);

  return { data, error, isLoading, axiosFetch };
};

export default useAxiosFunction;
