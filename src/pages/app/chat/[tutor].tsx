import { motion } from "framer-motion";

import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";

import { Button, Card, Avatar } from "@heroui/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";

import Head from 'next/head';

import { getTutorConfig } from '@/config/tutors';
import { LuPlay, LuPause, LuMessageSquare, LuDownload, LuX, LuArrowLeftRight } from 'react-icons/lu';

// Add type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  interpretation: any;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: Event) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'tutor';
  timestamp: string;
  speechTip?: string;
}

export default function TutorChat() {
  const router = useRouter();
  const { tutor: tutorId } = router.query;
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTranscription, setCurrentTranscription] = useState('');
  const [pendingResponses, setPendingResponses] = useState<number[]>([]);
  const [tempResponse, setTempResponse] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [tutorConfig, setTutorConfig] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const messageCounterRef = useRef<number>(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [conversationStartTime] = useState(new Date());

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          setCurrentTranscription(transcript);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
        };
      }
    }
  }, []);

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
        setCurrentTranscription(''); // Clear the transcription after processing
      };

      mediaRecorder.start(1000);
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      setIsRecording(true);
      setTempResponse(null); // Clear temporary response when starting new recording
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please ensure you have granted microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    }
  };

  const playAudio = async (audioBase64: string) => {
    try {
      const responseAudioBlob = new Blob([Buffer.from(audioBase64, 'base64')], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(responseAudioBlob);
      
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }

      const audioElement = new Audio(audioUrl);
      audioRef.current = audioElement;

      audioElement.onplay = () => setIsPlaying(true);
      audioElement.onpause = () => setIsPlaying(false);
      audioElement.onended = () => setIsPlaying(false);

      await audioElement.play();
    } catch (audioError) {
      console.error('Error playing audio:', audioError);
    }
  };

  const handleAudioInput = async (audioBlob: Blob) => {
    if (!tutorId || typeof tutorId !== 'string') return;
    
    setIsLoading(true);
    const currentMessageId = ++messageCounterRef.current;
    setPendingResponses(prev => [...prev, currentMessageId]);

    try {
      // Convert blob to base64
      const reader = new FileReader();
      const base64Audio = await new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = reader.result as string;
          const base64Clean = base64.split(',')[1];
          resolve(base64Clean);
        };
        reader.readAsDataURL(audioBlob);
      });

      // Send to our API endpoint
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
        id: currentMessageId,
        text: text,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        speechTip: text.speechTip
      };
      
      // Update messages with user message first
      setMessages(prev => [...prev, userMessage]);

      // Wait for state update to complete
      await new Promise(resolve => setTimeout(resolve, 0));

      const response = await fetch('/api/chat/completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          })).slice(-10),
          tutorId
        }),
      });

      console.log('Completion response status:', response.status);
      const responseData = await response.json();
      console.log('Completion response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to get response from tutor');
      }

      const { text: aiResponse, audio: audioBase64 } = responseData;

      if (!aiResponse) {
        throw new Error('No response text received from tutor');
      }

      // Show temporary response
      setTempResponse(aiResponse);

      // Play audio if available
      if (audioBase64) {
        await playAudio(audioBase64);
      }

      // Create the AI message
      const aiMessage: Message = {
        id: currentMessageId + 1,
        text: aiResponse,
        sender: 'tutor',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // Update messages and pending responses atomically
      setMessages(prev => [...prev, aiMessage]);
      setPendingResponses(prev => prev.filter(id => id !== currentMessageId));
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: currentMessageId + 1,
        text: "I'm sorry, I encountered an error. Please try again.",
        sender: 'tutor',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
      setPendingResponses(prev => prev.filter(id => id !== currentMessageId));
    }
  };

  const getConversationStats = () => {
    const duration = new Date().getTime() - conversationStartTime.getTime();
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    
    const userMessages = messages.filter(msg => msg.sender === 'user').length;
    const tutorMessages = messages.filter(msg => msg.sender === 'tutor').length;
    
    return {
      duration: `${minutes}m ${seconds}s`,
      totalMessages: messages.length,
      userMessages,
      tutorMessages,
      averageResponseTime: tutorMessages > 0 ? `${Math.floor(duration / tutorMessages / 1000)}s` : '0s'
    };
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
      <div className="min-h-screen flex flex-col items-center pb-20">
        {/* Vibly Logo and Text */}
        <div className="w-full max-w-2xl px-4 py-6 flex items-center gap-3">
          <Avatar 
            src="/logo.png"
            alt="Vibly"
            className="w-8 h-8"
          />
          <span className="text-xl font-black text-default-900">vibly.</span>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="w-full max-w-2xl px-4"
        >
          {/* Centered Avatar and Info */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              {isPlaying && (
                <div className="absolute inset-0 rounded-full bg-default-200 animate-ping opacity-75"></div>
              )}
              <Avatar 
                src={tutorConfig.avatar}
                alt={tutorConfig.name}
                className="w-32 h-32 mb-4 relative"
              />
            </div>
            <h1 className="text-2xl font-bold">{tutorConfig.name}</h1>
            <p className="text-default-600">{tutorConfig.role}</p>
          </div>

          {/* Real-time Transcription */}
          {isRecording && currentTranscription && (
            <div className="mt-4 p-4 bg-default-100 rounded-lg">
              <p className="text-default-600 italic">{currentTranscription}</p>
            </div>
          )}

          {/* Temporary Response Display */}
          {tempResponse && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 p-6 bg-default-100 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Avatar 
                    src={tutorConfig.avatar}
                    alt={tutorConfig.name}
                    size="lg"
                  />
                  <span className="font-semibold">{tutorConfig.name}</span>
                </div>
                <Button
                  isIconOnly
                  variant="light"
                  className="w-10 h-10"
                  onPress={() => {
                    if (audioRef.current) {
                      if (isPlaying) {
                        audioRef.current.pause();
                      } else {
                        audioRef.current.play();
                      }
                    }
                  }}
                >
                  {isPlaying ? (
                    <LuPause className="h-5 w-5" />
                  ) : (
                    <LuPlay className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <p className="text-default-900">{tempResponse}</p>
            </motion.div>
          )}

          {/* Chat Modal */}
          <Modal scrollBehavior={"inside"} isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalContent>
              <ModalHeader>
                <h2 className="text-xl font-bold">Chat with {tutorConfig.name}</h2>
              </ModalHeader>
              <ModalBody>
                <div className="p-6">
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
                                ? 'bg-default-900 text-white'
                                : 'bg-default-100 text-default-900'
                            }`}
                          >
                            <p>{msg.text}</p>
                            {msg.speechTip && (
                              <div className="mt-2 p-2 bg-white/10 rounded text-sm italic">
                                💡 Tip: {msg.speechTip}
                              </div>
                            )}
                            <p className="text-xs mt-2 opacity-75">{msg.timestamp}</p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="w-full flex justify-between items-center text-sm text-default-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">You:</span>
                      <span>{getConversationStats().userMessages} messages</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{tutorConfig.name}:</span>
                      <span>{getConversationStats().tutorMessages} messages</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Duration:</span>
                      <span>{getConversationStats().duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Avg. Response:</span>
                      <span>{getConversationStats().averageResponseTime}</span>
                    </div>
                  </div>
                </div>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </motion.div>

        {/* Bottom Menu */}
        <div className="fixed bottom-0 left-0 right-0">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              {/* Switch Lesson Button */}
              <Button
                variant="light"
                radius={"full"}
                isIconOnly
                className="w-12 h-12"
                onPress={() => router.push('/app')}
                startContent={
                  <LuArrowLeftRight className="h-6 w-6" />
                }
              />

              {/* Chat History Button */}
              <Button
                radius={"full"}
                variant="light"
                isIconOnly
                className="w-12 h-12"
                onPress={onOpen}
                startContent={
                  <LuMessageSquare className="h-6 w-6" />
                }
              />

              {/* Voice Button */}
              <Button
                radius={"full"}
                className={`${
                  isRecording 
                    ? 'bg-red-400 hover:bg-red-500 animate-pulse' 
                    : 'bg-default-900'
                } text-white w-32 h-16 rounded-full flex items-center justify-center`}
                onPress={isRecording ? stopRecording : startRecording}
                disabled={isLoading}
                startContent={
                  isRecording ? (
                    <LuPause className="h-8 w-8" />
                  ) : (
                    <LuPlay className="h-8 w-8" />
                  )
                }
              />

              {/* Download Button */}
              <Button
                variant="light"
                isIconOnly
                radius={"full"}
                className="w-12 h-12"
                onPress={() => {
                  const chatContent = messages.map(msg => 
                    `${msg.sender === 'user' ? 'You' : tutorConfig.name}: ${msg.text}`
                  ).join('\n\n');
                  const blob = new Blob([chatContent], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `chat-with-${tutorConfig.name}-${new Date().toISOString().split('T')[0]}.txt`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                startContent={
                  <LuDownload className="h-6 w-6" />
                }
              />

              {/* Exit Button */}
              <Button
                variant="light"
                isIconOnly
                radius={"full"}
                className="w-12 h-12"
                onPress={() => router.push('/app')}
                startContent={
                  <LuX className="h-6 w-6" />
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
