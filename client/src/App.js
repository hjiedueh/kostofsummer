import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from './comps/header'
import Main from './comps/main'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Main />
      </div>
    </BrowserRouter>
  );
}

export default App;
