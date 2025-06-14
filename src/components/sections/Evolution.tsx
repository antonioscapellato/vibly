import { Image } from "@heroui/react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const slideIn = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
};

export const Evolution = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity1 = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const opacity2 = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
  const opacity3 = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  const opacity4 = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);

  return (
    <div ref={containerRef} className="h-[400vh] relative">
      {/* Slide 1: Learning is Broken */}
      <motion.div 
        style={{ opacity: opacity1 }}
        className="h-screen sticky top-0 flex items-center justify-center"
      >
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
      </motion.div>

      {/* Slide 2: Medieval Times */}
      <motion.div 
        style={{ opacity: opacity2 }}
        className="h-screen sticky bg-black top-0 flex items-center justify-center"
      >
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
      </motion.div>

      {/* Slide 3: School of Athens */}
      <motion.div 
        style={{ opacity: opacity3 }}
        className="h-screen sticky top-0 flex items-center justify-center bg-black"
      >
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
      </motion.div>

      {/* Slide 4: Vibly's Revolution */}
      <motion.div 
        style={{ opacity: opacity4 }}
        className="h-screen bg-white sticky top-0 flex items-center justify-center"
      >
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
      </motion.div>
    </div>
  );
}; 