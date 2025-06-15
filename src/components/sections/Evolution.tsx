import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const slideIn = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
};

export const Evolution = () => {
  return (
    <div className="relative">
      {/* Section 1: Learning is Broken */}
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center px-8"
        >
          <motion.h2 
            variants={fadeIn}
            className="text-7xl font-bold text-black mb-8 leading-tight"
          >
            Learning today is broken.
          </motion.h2>
          <motion.p 
            variants={fadeIn}
            className="text-3xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Workbooks. Memorization. Silence. We don't learn like this — and we never did.
          </motion.p>
        </motion.div>
      </div>

      {/* Section 2: Medieval Times */}
      <div className="min-h-screen relative bg-black">
        <div className="relative w-full h-full">
          <img 
            src="/assets/landing/medieval.png" 
            alt="Medieval times" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center text-white px-8 max-w-4xl mx-auto"
            >
              <motion.h2 
                variants={slideIn}
                className="text-6xl font-bold mb-6 leading-tight"
              >
                The Old Way
              </motion.h2>
              <motion.p 
                variants={slideIn}
                className="text-2xl text-gray-200 max-w-2xl mx-auto leading-relaxed"
              >
                Isolated learning through books and memorization
              </motion.p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Section 3: School of Athens */}
      <div className="min-h-screen relative bg-black">
        <div className="relative w-full h-full">
          <img 
            src="/assets/landing/athens.png" 
            alt="The School of Athens" 
            className="w-full h-full object-cover opacity-20 grayscale"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center text-white px-8 max-w-4xl mx-auto"
            >
              <motion.h2 
                variants={slideIn}
                className="text-6xl font-bold mb-6 leading-tight"
              >
                The Right Way
              </motion.h2>
              <motion.p 
                variants={slideIn}
                className="text-2xl text-gray-200 max-w-2xl mx-auto leading-relaxed"
              >
                Collaborative learning through discussion and debate
              </motion.p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Section 4: Vibly's Revolution */}
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-5xl mx-auto text-center px-8"
        >
          <motion.h2 
            variants={fadeIn}
            className="text-7xl font-bold text-black mb-8 leading-tight"
          >
            Vibly is here to revolutionize learning
          </motion.h2>
          <motion.p 
            variants={fadeIn}
            className="text-3xl text-gray-600 mb-16 max-w-3xl mx-auto leading-relaxed"
          >
            From traditional to transformative
          </motion.p>
          <motion.div 
            variants={fadeIn}
            className="grid md:grid-cols-2 gap-12 items-center max-w-4xl mx-auto"
          >
            <div className="bg-default-50 rounded-3xl p-10 transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-3xl font-semibold mb-6 text-black">Traditional Learning</h3>
              <p className="text-xl text-gray-600 leading-relaxed">Static textbooks and repetitive exercises</p>
            </div>
            <div className="border border-default-500 rounded-3xl p-10 transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-3xl font-semibold mb-6 text-black">Vibly's Approach</h3>
              <p className="text-xl text-gray-600 leading-relaxed">Dynamic conversations with real people</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}; 