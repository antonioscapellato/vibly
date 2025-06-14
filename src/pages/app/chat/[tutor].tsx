import { motion } from "framer-motion";
import { Button, Card, Avatar } from "@heroui/react";
import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
import { getTutorConfig } from "../../utils/tutors";
import Head from 'next/head';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'tutor';
  timestamp: string;
}

export default function TutorChat() {
  const router = useRouter();
  const { tutor: tutorId } = router.query;
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [tutorConfig, setTutorConfig] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tutorId && typeof tutorId === 'string') {
      try {
        const config = getTutorConfig(tutorId);
        setTutorConfig(config);
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
        router.push('/app');
      }
    }
  }, [tutorId, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        if (audioChunksRef.current.length === 0) {
          console.error('No audio data recorded');
          return;
        }
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        console.log('Audio blob size:', audioBlob.size);
        await handleAudioInput(audioBlob);
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please ensure you have granted microphone permissions.');
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
      // Convert blob to base64
      const reader = new FileReader();
      const base64Audio = await new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = reader.result as string;
          // Remove the data URL prefix (e.g., "data:audio/webm;base64,")
          const base64Clean = base64.split(',')[1];
          resolve(base64Clean);
        };
        reader.readAsDataURL(audioBlob);
      });

      // Send to our API endpoint instead of directly to OpenAI
      const transcriptionResponse = await fetch('/api/chat/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio: base64Audio,
          format: 'webm'
        }),
      });

      if (!transcriptionResponse.ok) {
        const errorText = await transcriptionResponse.text();
        console.error('Transcription error:', errorText);
        throw new Error(`Transcription failed: ${errorText}`);
      }

      const { text } = await transcriptionResponse.json();
      console.log('Transcription response:', text);

      if (!text) {
        throw new Error('No text received from transcription');
      }

      const userMessage: Message = {
        id: messages.length + 1,
        text: text,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, userMessage]);

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

      console.log('Completion response status:', response.status);
      const responseData = await response.json();
      console.log('Completion response data:', responseData);

      const { text: aiResponse, audio: audioBase64 } = responseData;

      const aiMessage: Message = {
        id: messages.length + 2,
        text: aiResponse,
        sender: 'tutor',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMessage]);

      // Only attempt to play audio if we received audio data
      if (audioBase64) {
        try {
          const responseAudioBlob = new Blob([Buffer.from(audioBase64, 'base64')], { type: 'audio/mpeg' });
          const audioUrl = URL.createObjectURL(responseAudioBlob);
          const audioElement = new Audio(audioUrl);
          await audioElement.play();
        } catch (audioError) {
          console.error('Error playing audio:', audioError);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!tutorConfig) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>{tutorConfig ? `Chat with ${tutorConfig.name}` : 'Vibly - Chat'}</title>
        <link rel="icon" href="/logo.png" />
      </Head>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="max-w-2xl mx-auto"
        >
          {/* Centered Avatar and Info */}
          <div className="flex flex-col items-center mb-8">
            <Avatar 
              src={tutorConfig.avatar}
              alt={tutorConfig.name}
              className="w-32 h-32 mb-4"
            />
            <h1 className="text-2xl font-bold">{tutorConfig.name}</h1>
            <p className="text-gray-600">{tutorConfig.role}</p>
          </div>

          {/* Voice Button */}
          <div className="flex justify-center mb-8">
            <Button
              className={`${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-fuchsia-500 hover:bg-fuchsia-600'
              } text-white px-8 py-4 text-lg rounded-full`}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isLoading}
            >
              {isRecording ? 'Stop Talking' : 'Start Talking'}
            </Button>
          </div>

          {/* Conversation Window */}
          <Card className="p-6 h-[400px] overflow-hidden relative">
            <div className="h-full overflow-y-auto">
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
                      <p className="text-xs mt-2 opacity-75">{msg.timestamp}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
