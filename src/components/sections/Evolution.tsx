import { motion } from "framer-motion";

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

export const Evolution = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h2 
            variants={fadeIn}
            className="text-4xl font-bold text-gray-900 mb-6"
          >
            We evolved by talking, not testing.
          </motion.h2>
          <motion.p 
            variants={fadeIn}
            className="text-xl text-gray-600 mb-12"
          >
            Language made us human. And it still connects us more than anything else.
          </motion.p>
          <motion.div 
            variants={fadeIn}
            className="relative h-64 bg-white rounded-2xl shadow-lg"
          >
            {/* Timeline visualization placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-500">Timeline visualization coming soon</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}; 