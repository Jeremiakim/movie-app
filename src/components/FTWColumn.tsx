import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const FTWMovies = () => {
  // Fetch trending movies
  const fetchFreeMovies = async () => {
    const response = await axios.get(
      `${BASE_URL}/discover/movie
`,
      {
        params: {
          api_key: API_KEY,
        },
      }
    );
    return response.data.results;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["free-to-watch-movies"],
    queryFn: fetchFreeMovies,
  });

  return (
    <div>
      {isLoading && <p className="text-center">Loading movies...</p>}
      {error && (
        <p className="text-center text-red-500">Error loading movies</p>
      )}
      {data && data.length > 0 ? (
        <div className="overflow-x-auto whitespace-nowrap scrollbar-hide p-4">
          <div className="inline-flex space-x-3">
            {data.map((movie: any) => (
              <a
                href={`/moviedetail/${movie.id}`}
                key={movie.id}
                className="bg-gray-800 dark:bg-slate-100 rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 w-48 flex-shrink-0 cursor-pointer"
              >
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "/placeholder-poster.jpg"
                  }
                  alt={movie.title}
                  className="w-full h-64 object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <h3 className="text-lg dark:text-black font-bold truncate">
                    {movie.title}
                  </h3>
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-sm dark:text-black">
                      {movie.vote_average.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 dark:text-black *:mt-2">
                    {new Date(movie.release_date).toLocaleDateString()}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center">No movies found</p>
      )}
    </div>
  );
};
