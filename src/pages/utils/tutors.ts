export interface TutorConfig {
  id: string;
  name: string;
  avatar: string;
  role: string;
  systemPrompt: string;
  voiceId: string;
  desc: string;
  button: string;
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
    button: 'Start learning English with John'
  },
  marco: {
    id: 'marco',
    name: 'Marco',
    avatar: '/assets/characters/italian.png',
    role: 'Italian Tutor',
    systemPrompt: "You are Marco, an Italian tutor. You help students practice Italian conversation. Keep your responses concise and engaging.",
    voiceId: process.env.ELEVENLABS_VOICE_ID || 'S7L0uJpUCUDUktI3y5cw',
    desc: 'Italian coach from Rome',
    button: 'Start learning Italian with Marco'
  },
  maria: {
    id: 'maria',
    name: 'Maria',
    avatar: '/assets/characters/spanish.png',
    role: 'Spanish Tutor',
    systemPrompt: "You are Maria, a Spanish tutor. You help students practice Spanish conversation. Keep your responses concise and engaging.",
    voiceId: process.env.ELEVENLABS_VOICE_ID || '2fzSNSOmb5nntInhUtfm',
    desc: 'Spanish mentor from Madrid',
    button: 'Start learning Spanish with Maria'
  },
  anna: {
    id: 'anna',
    name: 'Anna',
    avatar: '/assets/characters/german.png',
    role: 'German Tutor',
    systemPrompt: "You are Anna, a German tutor. You help students practice German conversation. Keep your responses concise and engaging.",
    voiceId: process.env.ELEVENLABS_VOICE_ID || 'iOLZqmXTaFktMrY5oZ2z',
    desc: 'German teacher from Berlin',
    button: 'Start learning German with Anna'
  },
  li: {
    id: 'li',
    name: 'Li',
    avatar: '/assets/characters/chinese.png',
    role: 'Chinese Tutor',
    systemPrompt: "You are Li, a Chinese tutor. You help students practice Chinese conversation. Keep your responses concise and engaging.",
    voiceId: process.env.ELEVENLABS_VOICE_ID || '9lHjugDhwqoxA5MhX0az',
    desc: 'Chinese tutor from Beijing',
    button: 'Start learning Chinese with Li'
  },
  claire: {
    id: 'claire',
    name: 'Claire',
    avatar: '/assets/characters/french.png',
    role: 'French Tutor',
    systemPrompt: "You are Claire, a French tutor. You help students practice French conversation. Keep your responses concise and engaging.",
    voiceId: process.env.ELEVENLABS_VOICE_ID || 'rbFGGoDXFHtVghjHuS3E',
    desc: 'French tutor from Paris',
    button: 'Start learning French with Claire'
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