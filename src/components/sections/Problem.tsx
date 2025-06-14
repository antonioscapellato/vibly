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

export const Problem = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          <motion.h2 
            variants={fadeIn}
            className="text-4xl font-bold text-black mb-6 text-center"
          >
            Learning today is broken.
          </motion.h2>
          <motion.p 
            variants={fadeIn}
            className="text-xl text-gray-600 mb-12 text-center"
          >
            Workbooks. Memorization. Silence. We don't learn like this — and we never did.
          </motion.p>
          <motion.div 
            variants={fadeIn}
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            <div className="bg-gray-100 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold mb-4 text-black">Traditional Learning</h3>
              <p className="text-gray-600">Static textbooks and repetitive exercises</p>
            </div>
            <div className="bg-fuchsia-50 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold mb-4 text-black">Vibly's Approach</h3>
              <p className="text-gray-600">Dynamic conversations with real people</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}; 