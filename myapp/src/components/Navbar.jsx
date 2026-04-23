export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-md sticky top-0 z-50">
      <h1 className="text-2xl font-bold text-red-600">
        QuickChef
      </h1>

      <div className="space-x-6 font-medium">
        <button className="hover:text-red-500">Home</button>
        <button className="hover:text-red-500">Categories</button>
        <button className="hover:text-red-500">Random</button>
      </div>
    </nav>
  );
}