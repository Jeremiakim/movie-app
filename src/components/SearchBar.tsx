import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const fetchSearchResults = async (query: string) => {
  if (!query) return { results: [] };
  const { data } = await axios.get(`${BASE_URL}/search/multi`, {
    params: { api_key: API_KEY, query },
  });
  return data;
};

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data, isLoading } = useQuery({
    queryKey: ["search", debouncedTerm],
    queryFn: () => fetchSearchResults(debouncedTerm),
    enabled: !!debouncedTerm,
  });

  const handleSearch = (e: any) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${searchTerm}`);
      setSearchTerm("");
      setShowDropdown(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative max-w-lg mx-auto">
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="Search movies, TV shows, people..."
          className="bg-white md:w-[600px] lg:w-[700px] text-black w-full p-4 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition"
        >
          🔍
        </button>
      </div>

      {/* Dropdown Suggestions */}
      {showDropdown && data?.results?.length > 0 && (
        <ul className="absolute w-full bg-white text-black shadow-lg rounded-md mt-2 max-h-60 overflow-y-auto z-50 border">
          {data.results.map((item: any) => (
            <li
              key={item.id}
              className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
              onMouseDown={() => {
                navigate(`/search?query=${item.title || item.name}`);
                setSearchTerm("");
                setShowDropdown(false);
              }}
            >
              {/* Poster Image */}
              {item.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                  alt={item.title || item.name}
                  className="w-10 h-14 object-cover rounded-md"
                />
              )}
              <div>
                {/* Highlighted Text */}
                <span className="font-semibold">{item.title || item.name}</span>
                {/* Release Year */}
                {item.release_date && (
                  <span className="text-gray-500 text-sm ml-2">
                    ({new Date(item.release_date).getFullYear()})
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {isLoading && (
        <p className="text-gray-500 mt-2 text-center">Loading...</p>
      )}
    </form>
  );
};

export default SearchBar;
