import { motion } from "framer-motion";
import { Button } from "@heroui/react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export const Hero = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center">
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h1 
            variants={fadeIn}
            className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
          >
            Learn with AI Friends<br />Speak your world.
          </motion.h1>
          <motion.p 
            variants={fadeIn}
            className="text-xl md:text-2xl text-gray-600 mb-8"
          >
            Vibly is the future of language learning — social, immersive, and built around real conversations.
          </motion.p>
          <motion.div variants={fadeIn}>
            <Button className="bg-coral-500 hover:bg-coral-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
              Try it free
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}; 