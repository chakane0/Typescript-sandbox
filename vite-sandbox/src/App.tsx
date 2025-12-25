import Layout from './Components/Layout'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css';
import routeOne from './Components/One';
import routeTwo from './Components/Two';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <h1>Nesting Routes</h1>,
      },
      routeOne,
      routeTwo,
    ]
  },
])


function App() {

  return (
    <>
    <RouterProvider router={router} />
    </>
  )
}

export default App
