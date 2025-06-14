import { motion } from "framer-motion";
import React from "react";

//HeroUI
import { Button } from "@heroui/react";
import { Avatar } from "@heroui/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";


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

export const Hero = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  type AvatarType = {
    src: string;
    alt: string;
    name: string;
    desc: string;
    button: string;
  };
  const [selected, setSelected] = React.useState<AvatarType | null>(null);

  const avatars: AvatarType[] = [
    {
      src: "/assets/characters/german.png",
      alt: "John",
      name: "John",
      desc: "English teacher from Berlin",
      button: "Start learning English with John"
    },
    {
      src: "/assets/characters/french.png",
      alt: "Marie",
      name: "Marie",
      desc: "French tutor from Paris",
      button: "Start learning French with Marie"
    },
    {
      src: "/assets/characters/italian.png",
      alt: "Luca",
      name: "Luca",
      desc: "Italian coach from Rome",
      button: "Start learning Italian with Luca"
    },
    {
      src: "/assets/characters/spanish.png",
      alt: "Sofia",
      name: "Sofia",
      desc: "Spanish mentor from Madrid",
      button: "Start learning Spanish with Sofia"
    },
    {
      src: "/assets/characters/french.png",
      alt: "Claire",
      name: "Claire",
      desc: "Conversational French partner",
      button: "Practice French with Claire"
    },
    {
      src: "/assets/characters/italian.png",
      alt: "Marco",
      name: "Marco",
      desc: "Italian language enthusiast",
      button: "Practice Italian with Marco"
    },
    {
      src: "/assets/characters/english.png",
      alt: "Anna",
      name: "Anna",
      desc: "English learner from Hamburg",
      button: "Help Anna learn English"
    },
    {
      src: "/assets/characters/sapnish.png",
      alt: "Carlos",
      name: "Carlos",
      desc: "Spanish teacher from Barcelona",
      button: "Start learning Spanish with Carlos"
    },
    {
      src: "/assets/characters/french.png",
      alt: "Émile",
      name: "Émile",
      desc: "French language coach",
      button: "Start learning French with Émile"
    }
  ];

  // Circular positions for 8 avatars
  const positions = [
    { left: "70%", top: "18%" },
    { left: "82%", top: "50%" },
    { left: "70%", top: "70%" },
    { left: "50%", top: "85%" },
    { left: "30%", top: "70%" },
    { left: "18%", top: "50%" },
    { left: "30%", top: "18%" },
    { left: "50%", top: "5%" },
    { left: "85%", top: "30%" },
  ];

  return (
    <section className="min-h-screen flex items-center">
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h1 
            variants={fadeIn}
            className="text-4xl font-light text-default-500 mb-4"
          >
            vibly.
          </motion.h1>
          <motion.h1 
            variants={fadeIn}
            className="text-5xl font-black md:text-7xl text-black mb-6"
          >
            Learning in a human way
          </motion.h1>
          <motion.p 
            variants={fadeIn}
            className="text-2xl md:text-4xl text-gray-600 mb-8"
          >
            Learnings for human
          </motion.p>
          <motion.div
            variants={fadeIn}
            className="relative flex justify-center items-center mb-12 h-72 w-full"
          >
            {/* Central floating animation */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
              animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            >
              <img src="/assets/characters/english.png" alt="English Character" className="w-32 h-32 rounded-full shadow-2xl object-cover border-4 border-fuchsia-300" />
            </motion.div>
            {/* Interactive avatars in a circle */}
            {avatars.map((avatar, idx) => (
              <motion.div
                key={avatar.name}
                className={`absolute left-[${positions[idx].left}] top-[${positions[idx].top}] cursor-pointer`}
                animate={{ y: [0, idx % 2 === 0 ? -18 : 18, 0], scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 + idx * 0.3 }}
                onClick={() => { setSelected(avatar); onOpen(); }}
                whileHover={{ scale: 1.15, zIndex: 20 }}
                drag
                dragMomentum={false}
                dragElastic={0.5}
                dragTransition={{ bounceStiffness: 200, bounceDamping: 20 }}
              >
                <Avatar src={avatar.src} alt={avatar.alt} className="w-24 h-24 rounded-full shadow-xl object-cover border-4 border-fuchsia-100" />
              </motion.div>
            ))}
          </motion.div>
          <motion.div variants={fadeIn}>
            <Button 
              radius={"full"}
              size={"lg"}
              className={"px-12 py-8 text-3xl text-white font-black bg-black"}
            >
              Start learning now
            </Button>
          </motion.div>
        </motion.div>
        {/* Modal for avatar info */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            <ModalHeader>{selected?.name}</ModalHeader>
            <ModalBody>
              <div className="flex flex-col items-center">
                <Avatar src={selected?.src} alt={selected?.alt} className="w-24 h-24 rounded-full mb-4 border-4 border-fuchsia-200" />
                <p className="text-lg text-gray-700 mb-2">{selected?.desc}</p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button className="w-full bg-fuchsia-500 hover:bg-fuchsia-600 text-white" onClick={onClose}>
                {selected?.button}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </section>
  );
}; 