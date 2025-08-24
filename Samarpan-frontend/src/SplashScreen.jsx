import { motion } from "framer-motion";
import logo from "./assets/logo.png"

const SplashScreen = () => {
  return (
    <div className="flex flex-col justify-center items-center h-auto bg-gradient-to-b from-red-50 to-white">
      {/* Logo with smooth animation */}
      <motion.img
        src={logo} // 👈 put your Samarpan logo here
        alt="Samarpan Logo"
        className="w-32 h-32 rounded-full shadow-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />

      {/* App Name */}
      <motion.h1
        className="mt-4 text-2xl font-bold text-gray-900 tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Samarpan
      </motion.h1>

      {/* Tagline (optional) */}
      <motion.p
        className="mt-1 text-sm text-gray-600 italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        Empowering Change Together
      </motion.p>
    </div>
  );
};

export default SplashScreen;
