import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';

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
import { LuPlay, LuPause, LuMessageSquare, LuDownload, LuX, LuArrowLeftRight, LuImage } from 'react-icons/lu';
import { TutorConfig } from '@/config/tutors';

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
  improvementTip?: string;
  score?: number;
  imageUrl?: string;
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  prompt: string;
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
  const { isOpen: isChatModalOpen, onOpen: onChatModalOpen, onClose: onChatModalClose } = useDisclosure();
  const { isOpen: isScenarioModalOpen, onOpen: onScenarioModalOpen, onClose: onScenarioModalClose } = useDisclosure();
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [showScenarioModal, setShowScenarioModal] = useState(true);
  const [conversationStartTime] = useState(new Date());
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [showImageButton, setShowImageButton] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    if (tutorId && typeof tutorId === 'string') {
      try {
        const config = getTutorConfig(tutorId);
        setTutorConfig(config);
        if (config.scenarios.length > 0) {
          setShowScenarioModal(true);
          onScenarioModalOpen();
        } else {
          initializeChat(config);
        }
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

  const initializeChat = (config: TutorConfig, scenarioId?: string) => {
    const scenario = scenarioId ? config.scenarios.find((s: Scenario) => s.id === scenarioId) : null;
    const initialPrompt = scenario ? scenario.prompt : config.systemPrompt;
    
    setMessages([
      {
        id: 1,
        text: `Hello! I'm ${config.name}, your ${config.role}. ${scenario ? `Let's practice ${scenario.title.toLowerCase()}.` : 'How can I help you today?'}`,
        sender: 'tutor',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setSelectedScenario(scenarioId || null);
    setShowScenarioModal(false);
    onScenarioModalClose();
  };

  const handleScenarioChange = (scenarioId: string) => {
    if (tutorConfig) {
      initializeChat(tutorConfig, scenarioId);
    }
  };

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

      const { text, speechTip, score } = await transcriptionResponse.json();
      console.log('Transcription response:', text);

      if (!text) {
        throw new Error('No text received from transcription');
      }

      const userMessage: Message = {
        id: currentMessageId,
        text: text,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        speechTip: speechTip,
        score: score
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
        const errorMessage = responseData.message || 'Failed to get response from tutor';
        const errorDetails = responseData.error || '';
        console.error('API Error:', errorMessage, errorDetails);
        
        // Add user-friendly error message
        setMessages(prev => [...prev, {
          id: currentMessageId + 1,
          text: `I'm sorry, I encountered an error: ${errorMessage}${errorDetails ? ` (${errorDetails})` : ''}. The text response is still available, but I couldn't generate audio for it.`,
          sender: 'tutor',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        
        throw new Error(`${errorMessage}${errorDetails ? `: ${errorDetails}` : ''}`);
      }

      const { text: aiResponse, audio: audioBase64, improvementTip } = responseData;

      if (!aiResponse) {
        throw new Error('No response text received from tutor');
      }

      // Show temporary response
      setTempResponse(aiResponse);

      // Play audio if available
      if (audioBase64) {
        await playAudio(audioBase64);
      }

      // Update the user message with the improvement tip
      setMessages(prev => {
        const updatedMessages = [...prev];
        const lastUserMessageIndex = updatedMessages.findIndex(msg => msg.id === currentMessageId);
        if (lastUserMessageIndex !== -1) {
          updatedMessages[lastUserMessageIndex] = {
            ...updatedMessages[lastUserMessageIndex],
            improvementTip: improvementTip
          };
        }
        return [...updatedMessages, {
          id: currentMessageId + 1,
          text: aiResponse,
          sender: 'tutor',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }];
      });
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

  const generateImage = async () => {
    if (!messages.length) return;
    
    setIsGeneratingImage(true);
    setImageError(null);
    
    try {
      // Get the last few messages to create context
      const recentMessages = messages.slice(-3).map(msg => msg.text).join(' ');
      
      // Create a prompt for DALL-E
      const prompt = `Create a detailed, realistic image based on this conversation context: ${recentMessages}. The image should be natural and appropriate for a language learning context.`;
      
      const response = await fetch('/api/chat/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate image');
      }

      if (!data.imageUrl) {
        throw new Error('No image URL received');
      }

      // Add the image to the last tutor message
      setMessages(prev => {
        const updatedMessages = [...prev];
        const lastTutorMessageIndex = updatedMessages.findIndex(msg => msg.sender === 'tutor');
        if (lastTutorMessageIndex !== -1) {
          updatedMessages[lastTutorMessageIndex] = {
            ...updatedMessages[lastTutorMessageIndex],
            imageUrl: data.imageUrl
          };
        }
        return updatedMessages;
      });

      // Update tempResponse to include the image
      setTempResponse(prev => {
        const lastMessage = messages[messages.length - 1];
        return lastMessage?.text || '';
      });
    } catch (error) {
      console.error('Error generating image:', error);
      setImageError(error instanceof Error ? error.message : 'Failed to generate image');
      
      // Add error message to the chat
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "I'm sorry, I couldn't generate an image at this time. Please try again later.",
        sender: 'tutor',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    setShowImageButton(lastMessage?.sender === 'tutor' && !lastMessage?.imageUrl);
  }, [messages]);

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
        <div 
          className="w-full max-w-2xl px-4 py-6 flex items-center justify-between"
        >
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => router.push('/app')}
          >
            <Avatar 
              src="/logo.png"
              alt="Vibly"
              className="w-8 h-8"
            />
            <span className="text-xl font-black text-default-900">vibly.</span>
          </div>

          {/* Image Generation Button with Error Tooltip */}
          <div className="relative">
            <Button
              variant="light"
              radius={"full"}
              className="w-12 h-12"
              onPress={generateImage}
              isLoading={isGeneratingImage}
              //isDisabled={!showImageButton}
              isDisabled={true}
              startContent={
                <LuImage className={`h-6 w-6 ${!showImageButton ? 'opacity-50' : ''}`} />
              }
            />
            {imageError && (
              <div className="absolute right-0 mt-2 p-2 bg-red-100 text-red-700 rounded-lg text-sm whitespace-nowrap">
                {imageError}
              </div>
            )}
          </div>
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
            {selectedScenario && (
              <div className="mt-2 px-4 py-2 bg-default-100 rounded-full">
                <span className="text-sm text-default-600">
                  {tutorConfig.scenarios.find((s: Scenario) => s.id === selectedScenario)?.title}
                </span>
              </div>
            )}
          </div>

          {/* Real-time Transcription */}
          {isRecording && currentTranscription && (
            <div className="mt-4 p-4 bg-default-50 rounded-lg">
              <p className="text-default-600">{currentTranscription}</p>
            </div>
          )}

          {/* Temporary Response Display */}
          {tempResponse && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 p-6 bg-default-50 rounded-xl"
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
                  radius={"full"}
                  className="w-10 h-10 text-default-400"
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
              {messages[messages.length - 1]?.imageUrl && (
                <div className="mt-4">
                  <img 
                    src={messages[messages.length - 1].imageUrl} 
                    alt="Generated conversation context" 
                    className="rounded-lg max-w-full h-auto"
                  />
                </div>
              )}
              {messages[messages.length - 1]?.improvementTip && (
                <div className="mt-4 p-3 bg-default-100 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">💡 How to improve your response:</h4>
                  <div className="text-sm text-default-600 prose prose-sm max-w-none">
                    <ReactMarkdown
                      components={{
                        p: ({node, ...props}) => <p className="mb-2" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                        li: ({node, ...props}) => <li className="mb-1" {...props} />,
                        h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-2" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-base font-bold mb-2" {...props} />,
                        code: ({node, ...props}) => <code className="bg-default-200 px-1 py-0.5 rounded" {...props} />,
                        pre: ({node, ...props}) => <pre className="bg-default-200 p-2 rounded mb-2 overflow-x-auto" {...props} />,
                        blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-default-300 pl-4 mb-2" {...props} />,
                        a: ({node, ...props}) => <a className="text-blue-600 hover:underline" {...props} />
                      }}
                    >
                      {messages[messages.length - 1].improvementTip}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Loading Animation */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 p-6 bg-default-50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <Avatar 
                  src={tutorConfig.avatar}
                  alt={tutorConfig.name}
                  size="lg"
                />
                <div className="flex-1">
                  <div className="h-4 bg-default-200 rounded-full w-3/4 animate-pulse mb-2"></div>
                  <div className="h-4 bg-default-200 rounded-full w-1/2 animate-pulse"></div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Scenario Selection Modal */}
          <Modal isOpen={isScenarioModalOpen} onClose={onScenarioModalClose} size="md">
            <ModalContent>
              <ModalHeader>
                <h2 className="text-xl font-bold">Choose a Scenario</h2>
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 gap-3 pb-6">
                  {tutorConfig?.scenarios.map((scenario: Scenario) => (
                    <Button
                      key={scenario.id}
                      variant={selectedScenario === scenario.id ? "solid" : "flat"}
                      color="default"
                      className={`w-full h-auto py-4 px-6 justify-start ${
                        selectedScenario === scenario.id 
                          ? 'bg-default-900 text-white hover:bg-default-800' 
                          : 'hover:bg-default-100'
                      }`}
                      onPress={() => handleScenarioChange(scenario.id)}
                    >
                      <div className="flex flex-col items-start text-left">
                        <span className="font-semibold">{scenario.title}</span>
                        <span className={`text-sm ${selectedScenario === scenario.id ? 'text-white/70' : 'text-default-500'}`}>
                          {scenario.description}
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              </ModalBody>
            </ModalContent>
          </Modal>

          {/* Chat Modal */}
          <Modal scrollBehavior={"inside"} isOpen={isChatModalOpen} onClose={onChatModalClose} size="2xl">
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
                            {msg.imageUrl && (
                              <div className="mt-4">
                                <img 
                                  src={msg.imageUrl} 
                                  alt="Generated conversation context" 
                                  className="rounded-lg max-w-full h-auto"
                                />
                              </div>
                            )}
                            {msg.speechTip && (
                              <div className="mt-2 p-2 bg-default-800/40 rounded text-sm">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-semibold">Speech Analysis</h4>
                                  {msg.score !== undefined && (
                                    <span className="text-sm font-medium text-default-400 px-2 py-0.5 rounded">
                                      Score: {msg.score}/10
                                    </span>
                                  )}
                                </div>
                                <div className="prose prose-sm max-w-none">
                                  <ReactMarkdown
                                    components={{
                                      p: ({node, ...props}) => <p className="mb-2" {...props} />,
                                      ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                                      ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                                      li: ({node, ...props}) => <li className="mb-1" {...props} />,
                                      h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-2" {...props} />,
                                      h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2" {...props} />,
                                      h3: ({node, ...props}) => <h3 className="text-base font-bold mb-2" {...props} />,
                                      code: ({node, ...props}) => <code className="bg-default-200 px-1 py-0.5 rounded" {...props} />,
                                      pre: ({node, ...props}) => <pre className="bg-default-200 p-2 rounded mb-2 overflow-x-auto" {...props} />,
                                      blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-default-300 pl-4 mb-2" {...props} />,
                                      a: ({node, ...props}) => <a className="text-blue-600 hover:underline" {...props} />
                                    }}
                                  >
                                    {msg.speechTip}
                                  </ReactMarkdown>
                                </div>
                              </div>
                            )}
                            {msg.improvementTip && (
                              <div className="mt-2 p-2 bg-white/10 rounded text-sm">
                                <h4 className="font-semibold mb-1">💡 How to improve your response:</h4>
                                <div className="prose prose-sm max-w-none">
                                  <ReactMarkdown
                                    components={{
                                      p: ({node, ...props}) => <p className="mb-2" {...props} />,
                                      ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                                      ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                                      li: ({node, ...props}) => <li className="mb-1" {...props} />,
                                      h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-2" {...props} />,
                                      h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2" {...props} />,
                                      h3: ({node, ...props}) => <h3 className="text-base font-bold mb-2" {...props} />,
                                      code: ({node, ...props}) => <code className="bg-default-200 px-1 py-0.5 rounded" {...props} />,
                                      pre: ({node, ...props}) => <pre className="bg-default-200 p-2 rounded mb-2 overflow-x-auto" {...props} />,
                                      blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-default-300 pl-4 mb-2" {...props} />,
                                      a: ({node, ...props}) => <a className="text-blue-600 hover:underline" {...props} />
                                    }}
                                  >
                                    {msg.improvementTip}
                                  </ReactMarkdown>
                                </div>
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
        <div className="fixed bottom-0 bg-white/30 backdrop-blur-xl border-t border-white/20 left-0 right-0">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              {/* Switch Lesson Button */}
              <Button
                variant="light"
                radius={"full"}
                isIconOnly
                className="w-12 h-12"
                onPress={onScenarioModalOpen}
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
                onPress={onChatModalOpen}
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