import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HeartIcon } from "@heroicons/react/24/solid";

type Movie = {
  id: number;
  title: string;
  posterPath: string;
  vote_average: number;
};

export const FavoritePage = () => {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setFavorites(storedFavorites);
  }, []);

  const removeFromFavorites = (movieId: number) => {
    const updatedFavorites = favorites.filter((movie) => movie.id !== movieId);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };

  return (
    <div className="p-4 min-h-screen bg-white dark:bg-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center gap-4 mb-12">
          <HeartIcon className="w-12 h-12 text-rose-500" />
          <motion.h1
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent"
          >
            Your Favorite Movies
          </motion.h1>
        </div>

        {favorites.length === 0 ? (
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center justify-center h-96"
          >
            <HeartIcon className="w-24 h-24 text-rose-500/30 mb-6" />
            <p className="text-2xl text-slate-400 mb-4">
              Your heart is empty... 💔
            </p>
            <Link
              to="/"
              className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-full transition-all"
            >
              Explore Movies
            </Link>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
          >
            {favorites.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <Link to={`/moviedetail/${movie.id}`}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                    alt={movie.title}
                    className="rounded-xl shadow-2xl aspect-[2/3] object-cover transform transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <h3 className="text-white font-bold text-lg drop-shadow-lg">
                      {movie.title}
                    </h3>
                    <div className="mt-2 flex justify-center">
                      <span className="px-3 py-1 bg-rose-500 text-white text-sm rounded-full">
                        ★ {movie.vote_average?.toFixed(1) || "N/A"}
                      </span>
                    </div>
                  </div>
                </Link>
                {/* Tombol Hapus dari Favorites */}
                <button
                  onClick={() => removeFromFavorites(movie.id)}
                  className="absolute top-2 right-2 p-2  hover:bg-black/20 rounded-full"
                  title="Remove from favorites"
                >
                  <HeartIcon className="w-8 h-8 text-red-500" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
