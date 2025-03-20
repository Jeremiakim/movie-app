import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

type FavoriteButtonProps = {
  movieId: number;
  title: string;
  posterPath: string;
};

export const FavoriteButton = ({
  movieId,
  title,
  posterPath,
}: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.some((movie: any) => movie.id === movieId));
  }, [movieId]);

  const toggleFavorite = () => {
    let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (isFavorite) {
      favorites = favorites.filter((movie: any) => movie.id !== movieId);
    } else {
      favorites.push({ id: movieId, title, posterPath });
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  return (
    <button
      onClick={toggleFavorite}
      className="p-2 rounded-full backdrop-blur-sm shadow-md hover:scale-105 transition-transform"
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {isFavorite ? (
        <HeartSolidIcon className="w-8 h-8 text-red-500" />
      ) : (
        <HeartOutlineIcon className="w-8 h-8 text-red-500" />
      )}
    </button>
  );
};
