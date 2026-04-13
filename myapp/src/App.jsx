import React, { useState } from 'react'; // Fixed: Added { useState }
import { Header } from './components/index.js';
import { Ingredient, Categories, Cuisine, Random } from './pages/index.js';

function App() {
  const [selected, setSelected] = useState("Ingredient");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Radio Buttons Container */}
      <div className="flex flex-wrap justify-center gap-3 p-4 md:px-8 max-w-7xl mx-auto">
        {["Ingredient", "Categories", "Cuisine", "Random"].map((item) => (
          <button
            key={item}
            onClick={() => setSelected(item)}
            className={`px-5 py-2 rounded-xl font-medium border transition-all duration-200 ${
              selected === item
                ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                : "bg-white text-gray-600 border-gray-200 hover:border-indigo-400"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <main className="pb-10">
        {selected === "Ingredient" && <Ingredient />}
        {selected === "Categories" && <Categories />}
        {selected === "Cuisine" && <Cuisine />}
        {selected === "Random" && <Random />}
      </main>
    </div>
  );
}

export default App;