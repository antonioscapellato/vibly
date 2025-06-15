import { motion } from "framer-motion";
import React from "react";
import { Button, Link } from "@heroui/react";
import { Avatar } from "@heroui/react";
import { tutors } from '@/config/tutors';
import { useRouter } from "next/router";
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

export const CTA = () => {
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

  // Convert tutors object to array
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

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={fadeIn} className="mb-8">
            <h2 className="text-4xl md:text-7xl font-black text-black mb-6">
              Ready to transform <br/> your learning journey?
            </h2>
            <p className="text-xl text-default-600 max-w-2xl mx-auto">
              Join thousands of learners who are already <br/> experiencing personalized education with AI tutors.
            </p>
          </motion.div>

          <motion.div variants={fadeIn} className="flex justify-center items-center mb-12">
            <Button
              as={Link}
              radius="full"
              size="lg"
              className="px-8 md:px-12 py-6 text-2xl text-white font-black bg-black transition-colors duration-300"
              href="/app"
            >
              Start Learning Now
            </Button>
          </motion.div>

          <motion.div 
            variants={fadeIn}
            className="flex flex-wrap justify-center gap-6 mb-12"
          >
            {avatars.map((avatar) => (
              <motion.div
                key={avatar.name}
                className="cursor-pointer"
                whileHover={{ 
                  scale: 1.1,
                  transition: { duration: 0.2 }
                }}
                onClick={() => { setSelected(avatar); onOpen(); }}
              >
                <Avatar 
                  src={avatar.src} 
                  alt={avatar.alt} 
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full shadow-lg object-cover border-4 border-fuchsia-100 hover:border-fuchsia-300 transition-colors duration-300" 
                />
                <p className="mt-2 text-sm font-medium text-default-700">{avatar.name}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            variants={fadeIn}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="p-6 bg-white rounded-2xl">
              <h3 className="text-default-800 text-xl">Personalized Learning</h3>
              <p className="font-light text-default-500">Adaptive AI tutors that match your learning style</p>
            </div>
            <div className="p-6 bg-white rounded-2xl">
              <h3 className="text-default-800 text-xl">24/7 Availability</h3>
              <p className="font-light text-default-500">Learn at your own pace, anytime, anywhere</p>
            </div>
            <div className="p-6 bg-white rounded-2xl">
              <h3 className="text-default-800 text-xl">Instant Feedback</h3>
              <p className="font-light text-default-500">Get immediate responses to your questions</p>
            </div>
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
                onPress={() => {
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