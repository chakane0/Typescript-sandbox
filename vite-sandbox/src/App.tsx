import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import UsersContainer from './Components/Users/UsersContainer';
import UserContainer from './Components/Users/UserContainer';
import { fetchUser } from './API/api';

import './App.css'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <UsersContainer />,
      errorElement: <p>Route not found</p>,
    },
    {
      path: 'users/:id',
      element: <UserContainer />,
      errorElement: <p>User not found</p>,
      loader: async ({ params }) => {
        const user = await fetchUser(Number(params.id));
        return { user };
      },
    },
  ]);

  return (
    <>
      return <RouterProvider router={router} />;
    </>
  )
}

export default App
