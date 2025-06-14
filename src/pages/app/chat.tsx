import { motion } from "framer-motion";
import { Button, Card, Avatar, Input, ScrollShadow } from "@heroui/react";
import { useRouter } from "next/router";
import { useState } from "react";

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

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'tutor';
  timestamp: string;
  translation?: string;
}

export default function Chat() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm John, your English tutor. How can I help you today?",
      sender: 'tutor',
      timestamp: '10:00 AM'
    },
    {
      id: 2,
      text: "Hi John! I'd like to practice my English conversation skills.",
      sender: 'user',
      timestamp: '10:01 AM'
    },
    {
      id: 3,
      text: "That's great! Let's start with a simple topic. What's your favorite hobby?",
      sender: 'tutor',
      timestamp: '10:02 AM'
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: message,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-4xl mx-auto"
      >
        {/* Chat Header */}
        <motion.div variants={fadeIn} className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Avatar 
              src="/assets/characters/german.png" 
              alt="Tutor" 
              className="w-12 h-12"
            />
            <div>
              <h1 className="text-2xl font-bold">John</h1>
              <p className="text-gray-600">English Tutor</p>
            </div>
          </div>
          <Button 
            className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white"
            onClick={() => router.push('/app/home')}
          >
            Back to Dashboard
          </Button>
        </motion.div>

        {/* Chat Messages */}
        <Card className="p-6 mb-4">
          <ScrollShadow className="h-[500px] overflow-y-auto">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-4 ${
                      msg.sender === 'user'
                        ? 'bg-fuchsia-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p>{msg.text}</p>
                    {msg.translation && (
                      <p className="text-sm mt-2 opacity-75">{msg.translation}</p>
                    )}
                    <p className="text-xs mt-2 opacity-75">{msg.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollShadow>
        </Card>

        {/* Message Input */}
        <div className="flex space-x-4">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <Button
            className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white"
            onClick={handleSendMessage}
          >
            Send
          </Button>
        </div>

        {/* Learning Tools */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Vocabulary</h3>
            <p className="text-sm text-gray-600">Save new words during chat</p>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Grammar Check</h3>
            <p className="text-sm text-gray-600">Get instant feedback</p>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Translation</h3>
            <p className="text-sm text-gray-600">Translate messages</p>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
