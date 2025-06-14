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
        className="h-screen sticky top-0 flex items-center justify-center bg-white"
      >
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center px-4"
        >
          <motion.h2 
            variants={fadeIn}
            className="text-6xl font-bold text-black mb-6"
          >
            Learning today is broken.
          </motion.h2>
          <motion.p 
            variants={fadeIn}
            className="text-2xl text-gray-600"
          >
            Workbooks. Memorization. Silence. We don't learn like this — and we never did.
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Slide 2: Medieval Times */}
      <motion.div 
        style={{ opacity: opacity2 }}
        className="h-screen sticky top-0 flex items-center justify-center bg-gray-50"
      >
        <div className="relative w-full h-full">
          <Image 
            src="/assets/landing/medieval.png" 
            alt="Medieval times" 
            radius={"none"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center text-white px-4"
            >
              <motion.h2 
                variants={slideIn}
                className="text-5xl font-bold mb-4"
              >
                The Old Way
              </motion.h2>
              <motion.p 
                variants={slideIn}
                className="text-xl"
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
        className="h-screen sticky top-0 flex items-center justify-center bg-gray-50"
      >
        <div className="relative w-full h-full">
          <Image 
            src="/assets/landing/athens.webp" 
            alt="The School of Athens" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center text-white px-4"
            >
              <motion.h2 
                variants={slideIn}
                className="text-5xl font-bold mb-4"
              >
                The Right Way
              </motion.h2>
              <motion.p 
                variants={slideIn}
                className="text-xl"
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
        className="h-screen sticky top-0 flex items-center justify-center"
      >
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center px-4"
        >
          <motion.h2 
            variants={fadeIn}
            className="text-6xl font-bold text-black mb-6"
          >
            Vibly is here to revolutionize learning
          </motion.h2>
          <motion.p 
            variants={fadeIn}
            className="text-2xl text-gray-600 mb-8"
          >
            From traditional to transformative
          </motion.p>
          <motion.div 
            variants={fadeIn}
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-semibold mb-4 text-black">Traditional Learning</h3>
              <p className="text-gray-600">Static textbooks and repetitive exercises</p>
            </div>
            <div className="bg-fuchsia-100 rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-semibold mb-4 text-black">Vibly's Approach</h3>
              <p className="text-gray-600">Dynamic conversations with real people</p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}; 