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
    scenarios: [
      {
        id: 'casual',
        title: 'Conversación Casual',
        description: 'Practice everyday Spanish in a relaxed setting',
        prompt: "You are having a casual conversation with your student. Keep the tone friendly and natural. Focus on common expressions and everyday vocabulary."
      },
      {
        id: 'food',
        title: 'Cocina Española',
        description: 'Learn about Spanish cuisine and culture',
        prompt: "You are discussing Spanish cuisine and cooking. Focus on food-related vocabulary, traditional dishes, and cultural aspects of Spanish food."
      },
      {
        id: 'travel',
        title: 'Viajes por España',
        description: 'Prepare for your trip to Spain',
        prompt: "You are helping the student prepare for travel in Spain. Focus on travel-related vocabulary, directions, and common tourist situations."
      }
    ]
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
    scenarios: [
      {
        id: 'casual',
        title: 'Alltagsgespräch',
        description: 'Practice everyday German in a relaxed setting',
        prompt: "You are having a casual conversation with your student. Keep the tone friendly and natural. Focus on common expressions and everyday vocabulary."
      },
      {
        id: 'business',
        title: 'Geschäftsdeutsch',
        description: 'Learn professional German communication',
        prompt: "You are conducting a business German session. Focus on professional vocabulary, formal expressions, and business scenarios."
      },
      {
        id: 'culture',
        title: 'Deutsche Kultur',
        description: 'Learn about German culture and traditions',
        prompt: "You are discussing German culture, traditions, and customs. Focus on cultural vocabulary and help the student understand German cultural context."
      }
    ]
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
    scenarios: [
      {
        id: 'casual',
        title: '日常对话',
        description: 'Practice everyday Chinese in a relaxed setting',
        prompt: "You are having a casual conversation with your student. Keep the tone friendly and natural. Focus on common expressions and everyday vocabulary."
      },
      {
        id: 'business',
        title: '商务中文',
        description: 'Learn business Chinese communication',
        prompt: "You are conducting a business Chinese session. Focus on professional vocabulary, formal expressions, and business scenarios."
      },
      {
        id: 'culture',
        title: '中国文化',
        description: 'Learn about Chinese culture and traditions',
        prompt: "You are discussing Chinese culture, traditions, and customs. Focus on cultural vocabulary and help the student understand Chinese cultural context."
      }
    ]
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
    scenarios: [
      {
        id: 'casual',
        title: 'Conversation Décontractée',
        description: 'Practice everyday French in a relaxed setting',
        prompt: "You are having a casual conversation with your student. Keep the tone friendly and natural. Focus on common expressions and everyday vocabulary."
      },
      {
        id: 'food',
        title: 'Cuisine Française',
        description: 'Learn about French cuisine and culture',
        prompt: "You are discussing French cuisine and cooking. Focus on food-related vocabulary, traditional dishes, and cultural aspects of French food."
      },
      {
        id: 'travel',
        title: 'Voyage en France',
        description: 'Prepare for your trip to France',
        prompt: "You are helping the student prepare for travel in France. Focus on travel-related vocabulary, directions, and common tourist situations."
      }
    ]
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