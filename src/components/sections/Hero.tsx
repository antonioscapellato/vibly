import { motion } from "framer-motion";
import React from "react";
import { tutors } from '@/config/tutors';
import { useRouter } from "next/router";

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
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  type AvatarType = {
    src: string;
    alt: string;
    name: string;
    desc: string;
    button: string;
    id: string;
  };
  const [selected, setSelected] = React.useState<AvatarType | null>(null);

  // Convert tutors object to array and shuffle it
  const avatars: AvatarType[] = React.useMemo(() => {
    const tutorArray = Object.entries(tutors).map(([id, tutor]) => ({
      src: tutor.avatar,
      alt: tutor.name,
      name: tutor.name,
      desc: tutor.desc,
      button: tutor.button,
      id: id,
    }));
    return tutorArray;
  }, []);

  // Calculate positions in a circle
  const getCirclePositions = (count: number) => {
    const positions = [];
    const radius = 25;
    const centerX = 35;
    const centerY = 40;

    for (let i = 0; i < count; i++) {
      const angle = (i * 2 * Math.PI) / count;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      positions.push({ left: `${x}%`, top: `${y}%` });
    }

    return positions;
  };

  const positions = getCirclePositions(avatars.length);

  return (
    <section className="flex items-center">
      <div className="container mx-auto px-4 pt-6 pb-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h1 
            variants={fadeIn}
            className="mb-6 flex items-center justify-center"
          >
            <div className="border px-8 border-default-200 rounded-full px-4 py-2 inline-flex items-center">
              <Avatar src="/logo.png" alt="Vibly Logo" className="h-10 w-10 mr-2" />
              <span className="text-4xl font-black text-default-900">vibly.</span>
            </div>
          </motion.h1>
          <motion.h1 
            variants={fadeIn}
            className="text-5xl font-black md:text-7xl text-black"
          >
            Learning the way it was always meant to be.
          </motion.h1>

          <motion.div
            variants={fadeIn}
            className="relative flex justify-center items-center mb-12 h-[400px] w-full"
          >
            {/* Interactive avatars in a circle */}
            {avatars.map((avatar, idx) => (
              <motion.div
                key={avatar.name}
                className="absolute cursor-pointer"
                style={{
                  left: positions[idx].left,
                  top: positions[idx].top,
                }}
                animate={{ 
                  y: [0, idx % 2 === 0 ? -15 : 15, 0],
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 4 + idx * 0.5, 
                  ease: "easeInOut",
                  delay: idx * 0.2
                }}
                onClick={() => { setSelected(avatar); onOpen(); }}
                whileHover={{ 
                  scale: 1.2,
                  zIndex: 20,
                  transition: { duration: 0.2 }
                }}
                drag
                dragMomentum={false}
                dragElastic={0.5}
                dragTransition={{ bounceStiffness: 200, bounceDamping: 20 }}
              >
                <Avatar 
                  src={avatar.src} 
                  alt={avatar.alt} 
                  className="w-28 h-28 md:w-32 md:h-32 rounded-full shadow-xl object-cover border-4 border-fuchsia-100 hover:border-fuchsia-300 transition-colors duration-300" 
                />
              </motion.div>
            ))}
          </motion.div>
          <motion.div variants={fadeIn}>
            <Button 
              as={Link}
              radius={"full"}
              size={"lg"}
              className={"px-8 md:px-12 py-8 text-3xl text-white font-black bg-black transition-colors duration-300"}
              href={"/app"}
            >
              Start learning now
            </Button>
          </motion.div>
        </motion.div>
        {/* Modal for avatar info */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            <ModalHeader></ModalHeader>
            <ModalBody>
              <div className="flex flex-col items-center">
                <Avatar src={selected?.src} alt={selected?.alt} className="w-24 h-24 rounded-full mb-4 border-4 border-fuchsia-200" />
                <p className="text-lg text-default-700 mb-2">{selected?.desc}</p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button 
                className="w-full bg-black font-bold text-white transition-colors duration-300" 
                onClick={() => {
                  onClose();
                  if (selected?.id) {
                    router.push(`/app/chat/${selected.id}`);
                  }
                }}
              >
                {selected?.button}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </section>
  );
}; 