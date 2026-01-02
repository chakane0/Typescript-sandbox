import './App.css';
import * as React from 'react';
import { FadeLoader } from 'react-spinners';
// import MyPage from './Components/MyPage';
const MyPage = React.lazy(() => import("./Components/MyPage"));
function App() {
  
  return (
    <React.Suspense fallback={<FadeLoader color={'#00bcd4'} />}>
      
      <MyPage />
    </React.Suspense>
  )
}

export default App
