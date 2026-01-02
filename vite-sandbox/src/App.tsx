import './App.css';
import * as React from 'react';
import MyPage from './Components/MyPage';

function App() {
  return (
    <React.Suspense fallback={'...loading'}>
      <MyPage />
    </React.Suspense>
  )
}

export default App
