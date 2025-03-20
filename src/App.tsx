import { Route, Routes } from "react-router";
import { HomePage } from "./pages/HomePage";
import { MovieDetailPage } from "./pages/MovieDetailPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { AboutPage } from "./pages/AboutPage";
import SearchResultsPage from "./pages/SearchResultPage";
import { FavoritePage } from "./pages/FavPage";
import Layout from "./Layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="search" element={<SearchResultsPage />} />
        <Route path="moviedetail/:movieId" element={<MovieDetailPage />} />
        <Route path="favmovie" element={<FavoritePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
