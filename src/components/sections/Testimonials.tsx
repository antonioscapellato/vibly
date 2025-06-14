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

export const Testimonials = () => {
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
            className="text-4xl font-bold text-black mb-12 text-center"
          >
            What our learners are saying
          </motion.h2>
          <motion.div 
            variants={fadeIn}
            className="grid md:grid-cols-3 gap-8"
          >
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="bg-fuchsia-50 rounded-2xl p-6">
                <p className="text-gray-600 italic mb-4">
                  "Vibly transformed how I learn languages. The conversations feel natural and engaging."
                </p>
                <p className="font-semibold text-black">- Testimonial {index + 1}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}; 