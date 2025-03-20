import { WelcomeBanner } from "../components/Banner";
import { FTWMovies } from "../components/FTWColumn";
import { MostWatchedMovies } from "../components/MostPopularColumn";
import { TrendingMovies } from "../components/TrendingColumn";
import { motion } from "framer-motion";
import { fadeInLeft, fadeInRight, fadeInUp } from "../motion/FadeMotion";

export const HomePage = () => {
  return (
    <div className="p-2 min-h-screen rounded-xl text-white">
      {/* Banner */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        <WelcomeBanner />
      </motion.div>

      {/* Most Popular */}
      <motion.nav
        variants={fadeInLeft}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        className="pl-2 pt-4"
      >
        <div className="container mx-auto">
          <h1 className="text-2xl text-gray-800 font-bold dark:text-white text-center md:text-left">
            Most Popular
          </h1>
        </div>
      </motion.nav>
      <motion.div
        variants={fadeInLeft}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        className="max-w-8xl mx-auto p-1"
      >
        <MostWatchedMovies />
      </motion.div>

      {/* Trending Movies This Week */}
      <motion.nav
        variants={fadeInRight}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        className="pl-2 pt-4"
      >
        <div className="container mx-auto">
          <h1 className="text-2xl text-gray-800 font-bold dark:text-white text-center md:text-left">
            Trending Movies This Week
          </h1>
        </div>
      </motion.nav>
      <motion.div
        variants={fadeInRight}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        className="max-w-8xl mx-auto p-1"
      >
        <TrendingMovies />
      </motion.div>

      {/* Free To Watch */}
      <motion.nav
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        className="pl-2 pt-4"
      >
        <div className="container mx-auto">
          <h1 className="text-2xl text-gray-800 dark:text-white font-bold text-center md:text-left">
            Free To Watch
          </h1>
        </div>
      </motion.nav>
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        className="max-w-8xl mx-auto p-1"
      >
        <FTWMovies />
      </motion.div>
    </div>
  );
};
