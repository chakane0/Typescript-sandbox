import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom';
import Echo from './Components/Echo.tsx';


  const router = createBrowserRouter([
    {
      path: '/',
      element: <App />
    },
    {
      path: '/echo',
      element: <Echo />,
    },
    {
      path: '/echo/:msg',
      element: <Echo />
    }
  ])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <RouterProvider router={router} />
  </StrictMode>,
)
