export interface TutorConfig {
  id: string;
  name: string;
  avatar: string;
  role: string;
  systemPrompt: string;
  voiceId: string;
  desc: string;
  button: string;
  scenarios: {
    id: string;
    title: string;
    description: string;
    prompt: string;
  }[];
}

export const tutors: Record<string, TutorConfig> = {
  john: {
    id: 'john',
    name: 'John',
    avatar: '/assets/characters/english.png',
    role: 'English Tutor',
    systemPrompt: "You are John, an English tutor. You help students practice English conversation. Keep your responses concise and engaging.",
    voiceId: process.env.ELEVENLABS_VOICE_ID || 'onwK4e9ZLuTAKqWW03F9',
    desc: 'English teacher from London',
    button: 'Start learning English with John',
    scenarios: [
      {
        id: 'casual',
        title: 'Casual Conversation',
        description: 'Practice everyday English in a relaxed setting',
        prompt: "You are having a casual conversation with your student. Keep the tone friendly and natural. Focus on common expressions and everyday vocabulary."
      },
      {
        id: 'business',
        title: 'Business English',
        description: 'Learn professional communication skills',
        prompt: "You are conducting a business English session. Focus on professional vocabulary, formal expressions, and business scenarios."
      },
      {
        id: 'travel',
        title: 'Travel English',
        description: 'Prepare for your next trip abroad',
        prompt: "You are helping the student prepare for travel. Focus on travel-related vocabulary, directions, and common tourist situations."
      }
    ]
  },
  marco: {
    id: 'marco',
    name: 'Marco',
    avatar: '/assets/characters/italian.png',
    role: 'Italian Tutor',
    systemPrompt: "You are Marco, an Italian tutor. You help students practice Italian conversation. Keep your responses concise and engaging.",
    voiceId: process.env.ELEVENLABS_VOICE_ID || 'S7L0uJpUCUDUktI3y5cw',
    desc: 'Italian coach from Rome',
    button: 'Start learning Italian with Marco',
    scenarios: [
      {
        id: 'casual',
        title: 'Conversazione Informale',
        description: 'Practice everyday Italian in a relaxed setting',
        prompt: "You are having a casual conversation with your student. Keep the tone friendly and natural. Focus on common expressions and everyday vocabulary."
      },
      {
        id: 'food',
        title: 'Cucina Italiana',
        description: 'Learn about Italian food and cooking',
        prompt: "You are discussing Italian cuisine and cooking. Focus on food-related vocabulary, recipes, and cultural aspects of Italian food."
      },
      {
        id: 'travel',
        title: 'Viaggi in Italia',
        description: 'Prepare for your trip to Italy',
        prompt: "You are helping the student prepare for travel in Italy. Focus on travel-related vocabulary, directions, and common tourist situations."
      }
    ]
  },
  maria: {
    id: 'maria',
    name: 'Maria',
    avatar: '/assets/characters/spanish.png',
    role: 'Spanish Tutor',
    systemPrompt: "You are Maria, a Spanish tutor. You help students practice Spanish conversation. Keep your responses concise and engaging.",
    voiceId: process.env.ELEVENLABS_VOICE_ID || '2fzSNSOmb5nntInhUtfm',
    desc: 'Spanish mentor from Madrid',
    button: 'Start learning Spanish with Maria',
    scenarios: []
  },
  anna: {
    id: 'anna',
    name: 'Anna',
    avatar: '/assets/characters/german.png',
    role: 'German Tutor',
    systemPrompt: "You are Anna, a German tutor. You help students practice German conversation. Keep your responses concise and engaging.",
    voiceId: process.env.ELEVENLABS_VOICE_ID || 'iOLZqmXTaFktMrY5oZ2z',
    desc: 'German teacher from Berlin',
    button: 'Start learning German with Anna',
    scenarios: []
  },
  li: {
    id: 'li',
    name: 'Li',
    avatar: '/assets/characters/chinese.png',
    role: 'Chinese Tutor',
    systemPrompt: "You are Li, a Chinese tutor. You help students practice Chinese conversation. Keep your responses concise and engaging.",
    voiceId: process.env.ELEVENLABS_VOICE_ID || '9lHjugDhwqoxA5MhX0az',
    desc: 'Chinese tutor from Beijing',
    button: 'Start learning Chinese with Li',
    scenarios: []
  },
  claire: {
    id: 'claire',
    name: 'Claire',
    avatar: '/assets/characters/french.png',
    role: 'French Tutor',
    systemPrompt: "You are Claire, a French tutor. You help students practice French conversation. Keep your responses concise and engaging.",
    voiceId: process.env.ELEVENLABS_VOICE_ID || 'rbFGGoDXFHtVghjHuS3E',
    desc: 'French tutor from Paris',
    button: 'Start learning French with Claire',
    scenarios: []
  },
  // Add more tutors as needed
};

export const getTutorConfig = (tutorId: string): TutorConfig => {
  const tutor = tutors[tutorId];
  if (!tutor) {
    throw new Error(`Tutor with id ${tutorId} not found`);
  }
  return tutor;
}; 