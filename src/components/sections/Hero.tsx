import { motion } from "framer-motion";
import React from "react";
import { tutors } from '@/config/tutors';

//HeroUI
import { Button, Link } from "@heroui/react";
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

  const avatars: AvatarType[] = Object.values(tutors).map(tutor => ({
    src: tutor.avatar,
    alt: tutor.name,
    name: tutor.name,
    desc: tutor.desc,
    button: tutor.button,
  }));

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
    <section className="flex items-center">
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h1 
            variants={fadeIn}
            className="text-4xl font-black text-default-200 mb-12"
          >
            vibly.
          </motion.h1>
          <motion.h1 
            variants={fadeIn}
            className="text-5xl font-black md:text-7xl text-black mb-6"
          >
            Learning the way it was always meant to be.
          </motion.h1>

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
              as={Link}
              radius={"full"}
              size={"lg"}
              className={"px-12 py-8 text-3xl text-white font-black bg-black"}
              href={"/app"}
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