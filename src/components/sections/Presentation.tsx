import { Image } from "@heroui/react";
import { motion } from "framer-motion";
import { FC } from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const slideIn = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
};

export const Presentation: FC = () => {
  return (
    <div className="">

      {/* Section 1: The Problem with Learning */}
      <div className="h-screen min-h-screen flex items-center justify-center bg-white">
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
            The Problem with Learning
          </motion.h2>
          <motion.div 
            variants={fadeIn}
            className="grid md:grid-cols-2 gap-12 items-center max-w-4xl mx-auto"
          >
            <div className="rounded-3xl p-10 transform hover:scale-105 transition-transform duration-300">
              <Image isBlurred src="/assets/landing/before.png" alt="Before" className="mb-6"/>
              <h3 className="text-3xl font-semibold mb-6 text-black">How It Has Been</h3>
              <p className="text-xl text-default-600 leading-relaxed">
                Static textbooks, memorization, and passive learning methods that don't engage our natural learning abilities
              </p>
            </div>
            <div className="rounded-3xl p-10 transform hover:scale-105 transition-transform duration-300">
              <Image isBlurred src="/assets/landing/after.png" alt="After" className="mb-6"/>
              <h3 className="text-3xl font-semibold mb-6 text-black">How It Should Be</h3>
              <p className="text-xl text-default-600 leading-relaxed">
                Interactive, engaging, and natural learning through conversation and real-world application
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>


      {/* Section 2: The Solution - Vibly */}
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
            Introducing Vibly
          </motion.h2>
          <motion.p 
            variants={fadeIn}
            className="text-3xl text-default-600 mb-16 max-w-3xl mx-auto leading-relaxed"
          >
            The first vibe learning app that makes learning feel natural
          </motion.p>
          <motion.div 
            variants={fadeIn}
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="bg-default-50 rounded-3xl p-8 transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl font-semibold mb-4 text-black">Learn Like Humans</h3>
              <p className="text-lg text-default-600 leading-relaxed">
                Natural conversations and discussions that make learning feel effortless
              </p>
            </div>
            <div className="bg-default-50 rounded-3xl p-8 transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl font-semibold mb-4 text-black">Instant Feedback</h3>
              <p className="text-lg text-default-600 leading-relaxed">
                Get immediate responses and guidance to improve your learning journey
              </p>
            </div>
            <div className="bg-default-50 rounded-3xl p-8 transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl font-semibold mb-4 text-black">Track Progress</h3>
              <p className="text-lg text-default-600 leading-relaxed">
                Set goals and monitor your improvement with detailed analytics
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}; 