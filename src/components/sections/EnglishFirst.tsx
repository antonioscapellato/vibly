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

export const EnglishFirst = () => {
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
            className="text-4xl font-bold text-gray-900 mb-6 text-center"
          >
            Why start with English?
          </motion.h2>
          <motion.div 
            variants={fadeIn}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-coral-500 mr-2">•</span>
                  <p className="text-gray-600">English is the global language of opportunity</p>
                </li>
                <li className="flex items-start">
                  <span className="text-coral-500 mr-2">•</span>
                  <p className="text-gray-600">It's the #1 factor in social mobility, income, and career access</p>
                </li>
                <li className="flex items-start">
                  <span className="text-coral-500 mr-2">•</span>
                  <p className="text-gray-600">But it's still being taught like a dead language</p>
                </li>
              </ul>
            </div>
            <div className="bg-gray-100 rounded-2xl p-8">
              {/* Graph placeholder */}
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-500">Global English usage map coming soon</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}; 