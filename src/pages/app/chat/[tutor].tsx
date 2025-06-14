import { motion } from "framer-motion";
import { Button, Card, Avatar, Input, ScrollShadow } from "@heroui/react";
import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
import { getTutorConfig } from "../../utils/tutors";

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

export default function TutorChat() {
  const router = useRouter();
  const { tutor: tutorId } = router.query;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [tutorConfig, setTutorConfig] = useState<any>(null);

  useEffect(() => {
    if (tutorId && typeof tutorId === 'string') {
      try {
        const config = getTutorConfig(tutorId);
        setTutorConfig(config);
        // Initialize messages with welcome message
        setMessages([
          {
            id: 1,
            text: `Hello! I'm ${config.name}, your ${config.role}. How can I help you today?`,
            sender: 'tutor',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } catch (error) {
        console.error('Error loading tutor:', error);
        router.push('/chat'); // Redirect to main chat page if tutor not found
      }
    }
  }, [tutorId, router]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await handleAudioInput(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleAudioInput = async (audioBlob: Blob) => {
    if (!tutorId || typeof tutorId !== 'string') return;
    
    setIsLoading(true);
    try {
      // Convert audio to text using OpenAI Whisper API
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');
      formData.append('model', 'whisper-1');

      const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: formData,
      });

      const { text } = await transcriptionResponse.json();

      // Add user message
      const userMessage: Message = {
        id: messages.length + 1,
        text,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, userMessage]);

      // Get AI response
      const response = await fetch('/api/chat/completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          })),
          tutorId
        }),
      });

      const { text: aiResponse, audio: audioBase64 } = await response.json();

      // Add AI message
      const aiMessage: Message = {
        id: messages.length + 2,
        text: aiResponse,
        sender: 'tutor',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMessage]);

      // Play audio response
      const responseAudioBlob = new Blob([Buffer.from(audioBase64, 'base64')], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(responseAudioBlob);
      const audioElement = new Audio(audioUrl);
      await audioElement.play();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  if (!tutorConfig) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-4xl mx-auto"
      >
        {/* Centered Avatar */}
        <motion.div variants={fadeIn} className="flex flex-col items-center mb-8">
          <Avatar 
            src={tutorConfig.avatar}
            alt={tutorConfig.name}
            className="w-32 h-32 mb-4"
          />
          <h1 className="text-2xl font-bold">{tutorConfig.name}</h1>
          <p className="text-gray-600">{tutorConfig.role}</p>
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

        {/* Voice Input Controls */}
        <div className="flex justify-center space-x-4 mb-4">
          <Button
            className={`${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-fuchsia-500 hover:bg-fuchsia-600'
            } text-white`}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isLoading}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>
        </div>

        {/* Text Input (as fallback) */}
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
