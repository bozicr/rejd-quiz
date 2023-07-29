import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';

/**
 * Hook to enable direct data from context, without need to useContext every time when we need data
 */
const useGlobalStateHook = () => {
  const contextObject = useContext(QuizContext);

  return { ...contextObject };
};

export default useGlobalStateHook;
