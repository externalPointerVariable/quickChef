import React, { useState } from 'react';
import { Header } from './components/index.js';
import { Ingredient, Categories, Cuisine, Random } from './pages/index.js';
import Hero from "./components/Hero";


function App() {
  const [activeSearch, setActiveSearch] = useState(null);

  return (
<div className="bg-gradient-to-b from-pink-50 via-gray-50 to-yellow-50 min-h-screen font-sans">
      <Header setActiveSearch={setActiveSearch} />
      <Hero/>
      <Ingredient activeSearch={activeSearch} />
      <Categories activeSearch={activeSearch} />
      <Cuisine activeSearch={activeSearch} />
      <Random />
    </div>
  );
}

export default App;