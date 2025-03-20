import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import { ThemeProvider } from "./context/ThemeContext";

const Layout = () => {
  return (
    <ThemeProvider>
      <div className="bg-white dark:bg-gray-800 dark:text-white min-h-screen">
        <NavBar />
        <main className="max-w-8xl mx-auto">
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Layout;
