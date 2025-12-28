import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import UsersContainer from './Components/User/UsersContainer'
import './App.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <UsersContainer />,
  },
]);





function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
