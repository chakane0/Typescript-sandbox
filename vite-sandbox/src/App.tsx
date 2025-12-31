import './App.css';
import * as React from 'react';

function App() {
  const MyComponent = React.lazy(()=> import('./Components/MyComponent'));
  return (
    <>
      <MyComponent />;
    </>
  )
}

export default App
