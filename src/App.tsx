import React from 'react';
import Home from './pages/Home';
import 'styles/globals.scss';
import { Route, Routes } from 'react-router-dom';
import { QuizContextProvider } from './context/QuizContext';
import { ToastContainer } from 'react-toastify';
import AddQuiz from 'pages/AddQuiz';
import PlayQuiz from './pages/PlayQuiz';
import EditQuiz from 'pages/EditQuiz';
import ErrorPage from './pages/ErrorPage';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route
          path={'/'}
          element={
            <QuizContextProvider>
              <Home />
            </QuizContextProvider>
          }
        ></Route>
        <Route path={'/add-quiz'} element={<AddQuiz />}></Route>
        <Route path={'/play-quiz/:id'} element={<PlayQuiz />}></Route>
        <Route path={'/edit-quiz/:id'} element={<EditQuiz />}></Route>
        <Route path={'*'} element={<ErrorPage />}></Route>
      </Routes>
      <ToastContainer
        position='bottom-right'
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
