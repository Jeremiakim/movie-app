import { Link } from "react-router-dom";
import { useState } from "react";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ui/ThemeToggle";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#0A1A2B] text-white p-4 shadow-md">
      <div className="max-w-9xl mx-auto flex justify-between items-center">
        <div className="flex flex-col">
          <Link to="/" className="flex flex-col items-start space-y-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl font-extrabold tracking-wide">🎬</h1>
              <h1 className="text-2xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Movie Finder
              </h1>
            </div>
            <p className="text-gray-400 text-sm hidden md:block">
              Find your favorite movies effortlessly
            </p>
          </Link>
        </div>

        <div className="hidden md:block w-1/2">
          <SearchBar />
        </div>

        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-300 hover:text-white">
            Home
          </Link>
          <Link to="/about" className="text-gray-300 hover:text-white">
            About
          </Link>
          <Link to="/favmovie" className="text-gray-300 hover:text-white">
            My Favorites
          </Link>
          <ThemeToggle />
        </div>

        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      <div
        className={`md:hidden bg-[#0A1A2B] text-white transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="py-4 space-y-4 flex flex-col items-center">
          <p className="text-gray-400 text-sm">
            Find your favorite movies effortlessly
          </p>
          <div className="w-11/12">
            <SearchBar />
          </div>
          <Link
            to="/"
            className="text-gray-300 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-gray-300 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            to="/favmovie"
            className="text-gray-300 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            My Favorites
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
