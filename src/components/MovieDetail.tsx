import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Fragment, useState } from "react";
import { FavoriteButton } from "./FavButton";
import { Dialog, Transition } from "@headlessui/react";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

interface Genre {
  id: number;
  name: string;
}

interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
}

interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

interface Video {
  id: string;
  key: string;
  site: string;
  type: string;
}

interface CrewMember {
  id: number;
  name: string;
  job: string;
}

interface Actor {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface Provider {
  id: number;
  provider_name: string;
  logo_path?: string; // '?' berarti optional
}

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  runtime: number;
  genres: Genre[];
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  videos?: { results: Video[] };
  credits?: { cast: Actor[]; crew: CrewMember[] };
  ["watch/providers"]?: { results?: { US?: { flatrate?: Provider[] } } };
}

const fetchMovieDetail = async (
  movieId: string | undefined
): Promise<Movie> => {
  const { data } = await axios.get(`${BASE_URL}/movie/${movieId}`, {
    params: {
      api_key: API_KEY,
      append_to_response: "videos,credits,watch/providers",
    },
  });
  return data;
};

const MovieDetail = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [showTrailer, setShowTrailer] = useState(false);

  const {
    data: movie,
    isLoading,
    error,
  } = useQuery<Movie>({
    queryKey: ["movieDetail", movieId],
    queryFn: () => fetchMovieDetail(movieId),
    enabled: !!movieId,
  });

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  if (error || !movie) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-red-500 text-lg font-bold">
            Film tidak ditemukan!
          </p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={() => navigate("/")}
          >
            Kembali ke Home
          </button>
        </div>
      </div>
    );
  }

  const trailer = movie.videos?.results.find(
    (video: Video) => video.type === "Trailer" && video.site === "YouTube"
  );

  const cast = movie.credits?.cast.slice(0, 5);
  const director = movie.credits?.crew.find(
    (crew: CrewMember) => crew.job === "Director"
  );
  const watchProviders = movie["watch/providers"]?.results?.US?.flatrate;

  return (
    <motion.div className="max-w-7xl mx-auto px-4">
      <motion.div className="bg-white shadow-lg rounded-lg p-6 w-full">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            <motion.img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "https://via.placeholder.com/500x750?text=No+Image"
              }
              alt={movie.title}
              className="w-full md:w-80 h-auto md:h-135 rounded-lg shadow-md"
            />
            <div className="absolute top-2 right-2">
              <FavoriteButton
                movieId={movie.id}
                title={movie.title}
                posterPath={movie.poster_path}
              />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl font-bold text-gray-900">{movie.title}</h2>
            <p className="text-gray-700 mt-3 leading-relaxed">
              {movie.overview}
            </p>
            <p className="mt-3 text-gray-600">
              <strong>Release Date:</strong> {movie.release_date}
            </p>
            <p className="mt-1 text-gray-600">
              <strong>Duration:</strong> {movie.runtime} min
            </p>
            <div className="mt-4">
              <span className="bg-green-500 text-white px-3 py-1 rounded-lg">
                ⭐ {movie.vote_average.toFixed(1)}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {movie.genres.map((genre: Genre) => (
                <span
                  key={genre.id}
                  className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
            <div className="mt-6">
              <h3 className="text-lg dark:text-black font-semibold">
                Director:
              </h3>
              <p className="text-sm text-gray-700">
                {director?.name || "Unknown"}
              </p>
              <h3 className="text-lg dark:text-black font-semibold mt-4">
                Cast:
              </h3>
              <p className="text-sm text-gray-700">
                {cast?.map((actor: Actor) => actor.name).join(", ") ||
                  "Unknown"}
              </p>
            </div>
            <div className="mt-6">
              <h3 className="text-lg dark:text-black font-semibold">
                Where to Watch:
              </h3>
              <p className="text-sm text-gray-700">
                {watchProviders
                  ?.map((provider: Provider) => provider.provider_name)
                  .join(", ") || "Not Available"}
              </p>
            </div>
            <div className="mt-6">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md transition-all duration-300 hover:bg-red-700 hover:scale-105 cursor-pointer"
                onClick={() => setShowTrailer(true)}
              >
                Watch Trailer
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      <Transition appear show={showTrailer} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setShowTrailer(false)}
        >
          <div className="fixed inset-0 bg-opacity-50 backdrop-blur-md" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
              <Dialog.Title className="text-lg font-bold">
                Watch Trailer
              </Dialog.Title>

              {trailer ? (
                <div className="mt-4 aspect-w-16 aspect-h-9">
                  <iframe
                    width="100%"
                    height="315"
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    frameBorder="0"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                </div>
              ) : (
                <p className="text-gray-500">Trailer not available.</p>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md cursor-pointer transition-all"
                  onClick={() => setShowTrailer(false)}
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </motion.div>
  );
};

export default MovieDetail;
