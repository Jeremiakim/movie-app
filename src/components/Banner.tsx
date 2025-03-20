import SearchBar from "./SearchBar";

export const WelcomeBanner = () => {
  // const [search, setSearch] = useState("");

  return (
    <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-700">
      {/* Background Overlay */}
      <div className="absolute inset-0 rounded-2xl bg-black dark:bg-slate-50 bg-opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 md:px-12">
        <h1 className="text-3xl md:text-5xl font-bold text-white dark:text-black animate-fadeIn">
          Selamat Datang!
        </h1>
        <p className="text-lg md:text-xl text-gray-200 dark:text-black mt-2 animate-fadeIn delay-200">
          Temukan jutaan film, serial TV, dan aktor favoritmu!
        </p>

        {/* Search Bar */}
        <div className="mt-6 flex justify-center">
          <SearchBar />
        </div>
      </div>
    </div>
  );
};
