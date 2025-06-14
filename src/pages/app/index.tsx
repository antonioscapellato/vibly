import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { tutors } from '../../pages/utils/tutors';
import Head from 'next/head';

// HeroUI
import { Button, Card, Progress, Avatar } from "@heroui/react";


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

export default function Home() {
  const router = useRouter();

  const allTutors = Object.values(tutors);

  return (
    <>
      <Head>
        <title>Vibly - Dashboard</title>
        <link rel="icon" href="/logo.png" />
      </Head>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-6xl mx-auto"
        >
          {/* Welcome Section */}
          <motion.div variants={fadeIn} className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
            <p className="text-default-600">Continue your language learning journey</p>
          </motion.div>

          {/* Progress Section */}
          <motion.div variants={fadeIn} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Daily Streak</h3>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">7 days</span>
                <Progress value={70} className="w-24" />
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Words Learned</h3>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">245</span>
                <Progress value={45} className="w-24" />
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Conversation Time</h3>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">12h</span>
                <Progress value={60} className="w-24" />
              </div>
            </Card>
          </motion.div>

          {/* Tutors List */}
          <motion.div variants={fadeIn} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Tutors you can talk with</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {allTutors.map((tutor) => (
                <Card 
                  key={tutor.id}
                  className="p-6 cursor-pointer"
                  onClick={() => router.push(`/app/chat/${tutor.id}`)}
                >
                  <div className="flex items-center space-x-4">
                    <Avatar src={tutor.avatar} alt={tutor.name} className="w-16 h-16" />
                    <div>
                      <h3 className="font-semibold">{tutor.name}</h3>
                      <p className="text-default-600">{tutor.role}</p>
                      <p className="text-sm text-default-500">{tutor.desc}</p>
                    </div>
                  </div>
                  <Button className="mt-4 w-full bg-black hover:bg-default-900 text-white" onClick={() => router.push(`/app/chat/${tutor.id}`)}>
                    {tutor.button}
                  </Button>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={fadeIn}>
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="flex space-x-4">
              <Button 
                className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white"
                onClick={() => router.push('/app/chat/john')}
              >
                Start New Chat
              </Button>
              <Button 
                onPress={() => router.push('/app/profile')}
              >
                View Profile
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
