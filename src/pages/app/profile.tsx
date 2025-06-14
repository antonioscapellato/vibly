import { motion } from "framer-motion";
import { Button, Card, Avatar, Progress, Tabs, Tab } from "@heroui/react";
import { useRouter } from "next/router";

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

export default function Profile() {
  const router = useRouter();

  const languages = [
    {
      name: "English",
      level: "Intermediate",
      progress: 65,
      streak: 7
    },
    {
      name: "French",
      level: "Beginner",
      progress: 30,
      streak: 3
    }
  ];

  const achievements = [
    {
      title: "First Conversation",
      description: "Completed your first chat session",
      date: "2 weeks ago"
    },
    {
      title: "7-Day Streak",
      description: "Practiced for 7 days in a row",
      date: "1 week ago"
    },
    {
      title: "Vocabulary Master",
      description: "Learned 100 new words",
      date: "3 days ago"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-4xl mx-auto"
      >
        {/* Profile Header */}
        <motion.div variants={fadeIn} className="flex items-center space-x-6 mb-8">
          <Avatar 
            src="/assets/characters/english.png" 
            alt="Profile" 
            className="w-24 h-24"
          />
          <div>
            <h1 className="text-3xl font-bold">John Doe</h1>
            <p className="text-gray-600">Language Learner</p>
            <Button 
              className="mt-2 bg-fuchsia-500 hover:bg-fuchsia-600 text-white"
              onClick={() => router.push('/app/home')}
            >
              Back to Dashboard
            </Button>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs aria-label="Profile Sections" className="mb-8">
          <Tab key="languages" title="Languages">
            <motion.div variants={fadeIn} className="space-y-6">
              {languages.map((language) => (
                <Card key={language.name} className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{language.name}</h3>
                      <p className="text-gray-600">{language.level}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{language.streak} day streak</p>
                    </div>
                  </div>
                  <Progress value={language.progress} className="w-full" />
                </Card>
              ))}
            </motion.div>
          </Tab>
          <Tab key="achievements" title="Achievements">
            <motion.div variants={fadeIn} className="space-y-4">
              {achievements.map((achievement) => (
                <Card key={achievement.title} className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{achievement.title}</h3>
                  <p className="text-gray-600 mb-2">{achievement.description}</p>
                  <p className="text-sm text-gray-500">Earned {achievement.date}</p>
                </Card>
              ))}
            </motion.div>
          </Tab>
          <Tab key="settings" title="Settings">
            <motion.div variants={fadeIn} className="space-y-4">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <Button className="w-full">Edit Profile</Button>
                  <Button className="w-full">Notification Preferences</Button>
                  <Button className="w-full">Privacy Settings</Button>
                </div>
              </Card>
            </motion.div>
          </Tab>
        </Tabs>
      </motion.div>
    </div>
  );
}
