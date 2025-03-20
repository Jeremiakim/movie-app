import { motion } from "framer-motion";
import { Skeleton } from "./ui/Skeletons";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
}

const fetchRecommendations = async (movieId: string | undefined) => {
  if (!movieId) return [];
  const { data } = await axios.get(
    `${BASE_URL}/movie/${movieId}/recommendations`,
    {
      params: { api_key: API_KEY },
    }
  );
  return data.results;
};

export const RecommendationColumn = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const {
    data: recommendations = [],
    isLoading: isRecLoading,
    error: recError,
  } = useQuery({
    queryKey: ["movieRecommendations", movieId],
    queryFn: () => fetchRecommendations(movieId),
    enabled: !!movieId,
  });

  return (
    <section className="relative">
      {/* Loading State */}
      {isRecLoading && (
        <div className="flex space-x-4 overflow-hidden pb-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-48 space-y-2">
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {recError && (
        <div className="text-center py-8 bg-gray-50 dark:text-white rounded-xl">
          <p className="text-red-500">Your Connection Is Lost</p>
        </div>
      )}

      {/* Success State */}
      {!isRecLoading && !recError && (
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {recommendations.length > 0 ? (
            recommendations.map((rec: Movie) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="group relative cursor-pointer flex-shrink-0 w-48"
                onClick={() => navigate(`/moviedetail/${rec.id}`)}
              >
                <div className="aspect-[2/3] relative overflow-hidden rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105">
                  <img
                    src={
                      rec.poster_path
                        ? `https://image.tmdb.org/t/p/w500${rec.poster_path}`
                        : "/no-poster.png"
                    }
                    alt={rec.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <h3 className="text-white font-semibold text-sm text-center">
                      {rec.title}
                    </h3>
                    <div className="flex items-center justify-center mt-2">
                      <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full flex items-center">
                        <HeartSolidIcon className="w-3 h-3 mr-1" />
                        {rec.vote_average.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 bg-gray-50 dark:text-gray-800 rounded-xl w-full">
              <p className="text-black-500 font-bold text-xl text-bold">
                No Recommendations Available
              </p>
            </div>
          )}
        </div>
      )}

      {/* Scroll Gradient Overlay */}
      <div className="absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none" />
    </section>
  );
};
