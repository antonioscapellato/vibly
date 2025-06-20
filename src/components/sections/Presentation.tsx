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
          className="w-full h-full relative"
        >
          <div className="grid md:grid-cols-2 h-full">
            {/* Left side */}
            <div className="relative h-full">
              <Image 
                src="/assets/landing/before.png" 
                alt="Before" 
                radius={"none"}
                className="w-full h-full object-cover grayscale"
              />
              <div className="absolute z-40 bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent flex flex-col items-center justify-end text-white p-8 min-h-[50%]">
                <h3 className="text-5xl text-left font-semibold mb-6">How It Has Been</h3>
                <p className="text-xl text-left leading-relaxed text-center">
                  Static textbooks, memorization, and passive <br className={"hidden md:block"} /> learning methods that don't engage our natural learning abilities
                </p>
              </div>
            </div>
            {/* Right side */}
            <div className="relative h-full">
              <Image  
                src="/assets/landing/after.png" 
                alt="After" 
                radius={"none"}
                className="w-full h-full object-cover grayscale"
              />
              <div className="absolute z-40 bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent flex flex-col items-center justify-end text-white p-8 min-h-[50%]">
                <h3 className="text-5xl text-left font-semibold mb-6">How It Should Be</h3>
                <p className="text-xl text-left leading-relaxed text-center">
                  Interactive, engaging, and natural learning <br className={"hidden md:block"} /> through conversation and real-world application
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>


      {/* Section 2: The Solution - Vibly */}
      <div className="min-h-screen pt-36 bg-white flex items-center justify-center">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-5xl mx-auto text-center px-8"
        >
          <motion.h2 
            variants={fadeIn}
            className="text-6xl md:text-7xl font-bold text-black mb-8 leading-tight"
          >
            Hello, Vibly!
          </motion.h2>
          <motion.p 
            variants={fadeIn}
            className="text-3xl text-default-600 mb-16 max-w-3xl mx-auto leading-relaxed"
          >
            The first vibe learning app that makes learning feel natural
          </motion.p>

          {/* Mobile Screenshots */}
          <motion.div
            variants={fadeIn}
            className="flex justify-center items-center gap-4 mb-16"
          >
            <Image
              src="/assets/screenshots/screenshot_01.png"
              alt="Mobile Screenshot 1"
              className="md:w-80 rounded-2xl shadow-xl border-4 border-default-100"
            />
            <Image
              src="/assets/screenshots/screenshot_02.png"
              alt="Mobile Screenshot 2"
              className="md:w-80 rounded-2xl shadow-xl border-4 border-default-100 mt-8"
            />
            <Image
              src="/assets/screenshots/screenshot_00.png"
              alt="Mobile Screenshot 3"
              className="md:w-80 rounded-2xl shadow-xl border-4 border-default-100"
            />
          </motion.div>

          <motion.div 
            variants={fadeIn}
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="bg-default-50/50 rounded-3xl p-8 transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl font-semibold mb-4 text-black">Learn Like Humans</h3>
              <p className="text-lg text-default-600 leading-relaxed">
                Natural conversations and discussions that make learning feel effortless
              </p>
            </div>
            <div className="bg-default-50/50 rounded-3xl p-8 transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl font-semibold mb-4 text-black">Instant Feedback</h3>
              <p className="text-lg text-default-600 leading-relaxed">
                Get immediate responses and guidance to improve your learning journey
              </p>
            </div>
            <div className="bg-default-50/50 rounded-3xl p-8 transform hover:scale-105 transition-transform duration-300">
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