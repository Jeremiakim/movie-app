// MovieDetailPage.tsx
import { motion } from "framer-motion";
import MovieDetail from "../components/MovieDetail";
import { MostWatchedMovies } from "../components/MostPopularColumn";
import { FamiliarColumn } from "../components/FamiliarColumn";
import { FilmIcon, PuzzlePieceIcon, FireIcon } from "@heroicons/react/24/solid";

// import { Skeleton } from "../components/ui/skeleton";
import { RecommendationColumn } from "../components/RecommendColumn";

export const MovieDetailPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 max-w-7xl mx-auto"
    >
      {/* Movie Detail Section */}
      <MovieDetail />

      {/* Recommendations Section */}
      <section className="mt-12">
        <motion.h2
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3"
        >
          <FilmIcon className="w-8 h-8 text-black dark:text-white animate-pulse" />
          <span className="bg-black bg-clip-text text-transparent dark:text-white">
            Recommended For You
          </span>
        </motion.h2>
        <RecommendationColumn />
      </section>

      {/* Similar Movies Section */}
      <section className="mt-12">
        <motion.h2
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3"
        >
          <PuzzlePieceIcon className="w-8 h-8 text-blue-500 rotate-45" />
          <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Similar Movies
          </span>
        </motion.h2>
        <FamiliarColumn />
      </section>

      {/* Most Popular Section */}
      <section className="mt-12">
        <motion.h2
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3"
        >
          <FireIcon className="w-8 h-8 text-orange-500 animate-bounce" />
          <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Most Popular
          </span>
        </motion.h2>
        <MostWatchedMovies />
      </section>
    </motion.div>
  );
};
