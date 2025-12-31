import * as React from 'react';

import './App.css'

function App() {
  const [MyComponent, setMyComponent] = React.useState<() => React.ReactNode>(
    () => () => null
  );

  React.useEffect(() => {
    import('./Components/MyComponent').then((module) => {
      setMyComponent(() => module.default);
    })
  }, []);

  return (
    <MyComponent />
  )
}

export default App
