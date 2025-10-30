import React from 'react';
import { Header } from './components/index.js';
import { Ingredient, Categories, Cuisine, Random } from './pages/index.js';

function App() {
  return (
    <>
      <Header />
      <Ingredient />
      <Categories />
      <Cuisine />
      <Random />
    </>
  );
}

export default App;