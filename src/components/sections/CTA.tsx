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

export const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-coral-500 to-orange-500">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center text-white"
        >
          <motion.h2 
            variants={fadeIn}
            className="text-4xl font-bold mb-6"
          >
            Join the movement. Speak your future.
          </motion.h2>
          <motion.div variants={fadeIn}>
            <Button className="bg-white text-coral-500 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
              Get Started Free
            </Button>
          </motion.div>
          <motion.p 
            variants={fadeIn}
            className="mt-6 text-white/80"
          >
            Available now on iOS and Android
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}; 