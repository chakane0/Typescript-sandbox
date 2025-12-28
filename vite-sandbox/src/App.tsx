import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './Components/Layout';
import First from './Components/First';
import Second from './Components/Second';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '/first',
          element: <First />,
        },
        {
          path: '/second',
          element: <Second />,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router}/>;
    </>
  )
}

export default App
