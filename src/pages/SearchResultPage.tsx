import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3/search/multi";

interface Movie {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string;
  media_type?: "movie" | "tv" | "person";
}

const fetchSearchResults = async (query: string) => {
  if (!query) return { results: [] };
  const { data } = await axios.get(BASE_URL, {
    params: { query, api_key: API_KEY, language: "id-ID" },
  });
  return data;
};

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("query") || "";

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ["search", query],
    queryFn: () => fetchSearchResults(query),
    enabled: !!query,
  });

  // Hitung kategori hasil pencarian
  const categories = {
    Film:
      data?.results?.filter((item: Movie) => item.media_type === "movie")
        .length || 0,
    "Series TV":
      data?.results?.filter((item: Movie) => item.media_type === "tv").length ||
      0,
    Poeple:
      data?.results?.filter((item: Movie) => item.media_type === "person")
        .length || 0,
  };

  // Pagination Logic
  const totalResults = data?.results?.length || 0;
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const paginatedResults = data?.results?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex min-h-screen p-4">
      {/* Sidebar Kategori */}
      <aside className="w-1/4 bg-gray-900 dark:bg-slate-100 dark:text-black text-white p-4 rounded-lg h-fit sticky top-4 shadow-md">
        <h2 className="text-lg font-bold mb-2">Search Results</h2>
        <ul>
          {Object.entries(categories).map(([key, count]) => (
            <li key={key} className="mb-2">
              <span className="font-medium">{key}</span>: {count}
            </li>
          ))}
        </ul>
      </aside>

      {/* Hasil Pencarian */}
      <div className="w-3/4 pl-4">
        <h2 className="text-2xl font-bold mb-4">Searching Result: {query}</h2>
        {isLoading && <p className="text-gray-500">Loading...</p>}
        {error && (
          <p className="text-red-500 font-bold">Error Or Maybe You Offline</p>
        )}

        <div className="space-y-4 h-[600px] overflow-y-auto">
          {paginatedResults?.length > 0 ? (
            paginatedResults.map((item: Movie) => (
              <motion.div
                key={item.id}
                className="flex bg-gray-200 dark:text-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-300 transition"
                whileHover={{ scale: 0.99 }}
                onClick={() => navigate(`/moviedetail/${item.id}`)}
              >
                <img
                  src={
                    item.poster_path
                      ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                      : "https://via.placeholder.com/200x300?text=No+Image"
                  }
                  alt={item.title || item.name}
                  className="w-16 h-24 object-cover rounded-lg"
                />
                <div className="ml-4">
                  <h3 className="text-lg font-bold">
                    {item.title || item.name}
                  </h3>
                  <p className="text-sm text-gray-700">
                    {item.overview || "Description is not available"}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-600 dark:text-white">
              Dont Have Any Result.
            </p>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            <button
              className={`px-4 py-2 rounded-md ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 text-white"
              }`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {/* Pilihan Halaman */}
            {[...Array(Math.min(8, totalPages))].map((_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === pageNumber
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              className={`px-4 py-2 rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 text-white"
              }`}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
