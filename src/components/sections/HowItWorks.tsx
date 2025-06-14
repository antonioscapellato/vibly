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

export const HowItWorks = () => {
  const features = [
    {
      title: "Connect with natives",
      description: "Practice with native speakers and mentors"
    },
    {
      title: "Join practice groups",
      description: "Participate in live chat sessions"
    },
    {
      title: "Speak from day one",
      description: "Start conversations immediately"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
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
            Real people. Real conversations. Real fluency.
          </motion.h2>
          <motion.div 
            variants={fadeIn}
            className="grid md:grid-cols-3 gap-8 mt-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}; 