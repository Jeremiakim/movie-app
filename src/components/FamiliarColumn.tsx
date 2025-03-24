// FamiliarColumn.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Skeleton } from "./ui/Skeletons";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
};

export const FamiliarColumn = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolledLeft, setIsScrolledLeft] = useState(true);
  const [isScrolledRight, setIsScrolledRight] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const BASE_URL = "https://api.themoviedb.org/3";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}`
        );
        setSimilarMovies(data.results);
        setErrorMessage(null);
        console.log(data);
        console.log(errorMessage);
      } catch (error) {
        setErrorMessage("Film Not Found");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [movieId, API_KEY]);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setIsScrolledLeft(scrollLeft === 0);
      setIsScrolledRight(scrollLeft + clientWidth >= scrollWidth);
    }
  };

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener("scroll", handleScroll);
      return () => currentContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  if (isLoading)
    return (
      <div className="flex space-x-4 overflow-hidden py-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-64 w-48 rounded-xl" />
        ))}
      </div>
    );

  if (errorMessage)
    return (
      <div className="text-center py-8 bg-gray-50 dark:text-white rounded-xl">
        <p className="text-red-500">{errorMessage}</p>
      </div>
    );

  if (!similarMovies.length)
    return (
      <div className="text-center py-8 bg-gray-50 dark:text-white rounded-xl">
        <p className="text-red-500">Film Not Found</p>
      </div>
    );

  return (
    <div className="relative">
      {!isScrolledLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      )}
      {!isScrolledRight && (
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      )}

      <div
        ref={containerRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide pb-6"
      >
        {similarMovies.map((movie) => (
          <a
            href={`/moviedetail/${movie.id}`}
            key={movie.id}
            className="group flex-shrink-0 w-48 transform hover:scale-105 transition-transform duration-300"
          >
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg">
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "/no-poster.png"
                }
                alt={movie.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <h3 className="text-white font-semibold text-sm text-center">
                  {movie.title}
                </h3>
                <div className="flex items-center justify-center mt-2">
                  <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full flex items-center">
                    <HeartSolidIcon className="w-3 h-3 mr-1" />
                    {movie.vote_average.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
