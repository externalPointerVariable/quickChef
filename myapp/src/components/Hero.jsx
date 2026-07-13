export default function Hero() {
  return (
    <div
      id="home"
      className="relative text-white flex flex-col md:flex-row items-center justify-between px-12 py-20 rounded-b-3xl shadow-xl overflow-hidden"
    >
      

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80')",
        }}
      ></div>


      <div className="absolute inset-0 bg-black/60"></div>


      <div className="relative z-10 max-w-xl">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
          Discover Your Next Meal 🍽️
        </h1>

        <p className="text-lg md:text-xl opacity-90">
          Smart recipe finder based on what you already have
        </p>
      </div>

    </div>
  );
}