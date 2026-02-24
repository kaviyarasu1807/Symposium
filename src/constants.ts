export interface Event {
  id: string;
  name: string;
  category: 'technical' | 'non-technical';
  description: string;
  icon: string;
}

export const TECHNICAL_EVENTS: Event[] = [
  { id: 'innovision', name: 'Innovision – Ideathon', category: 'technical', description: 'Pitch your innovative ideas to solve real-world problems.', icon: 'Lightbulb' },
  { id: 'paper-vista', name: 'Paper Vista – Paper Presentation', category: 'technical', description: 'Present your research papers on emerging technologies.', icon: 'FileText' },
  { id: 'pixel-craft', name: 'Pixel Craft – UI / UX Design', category: 'technical', description: 'Showcase your creativity in designing user-centric interfaces.', icon: 'Palette' },
  { id: 'prompt-studio', name: 'Prompt Studio – Prompt with AI', category: 'technical', description: 'Master the art of prompt engineering with generative AI.', icon: 'Cpu' },
  { id: 'hidden-hack', name: 'The Hidden Hack – Blind Coding', category: 'technical', description: 'Code without looking at the screen. Test your muscle memory.', icon: 'Code' },
  { id: 'mind-spark', name: 'Mind Spark – Mind Tech', category: 'technical', description: 'A technical quiz and problem-solving challenge.', icon: 'Brain' },
];

export const NON_TECHNICAL_EVENTS: Event[] = [
  { id: 'ipl-auction', name: 'IPL Auction', category: 'non-technical', description: 'Build your dream team in this simulated cricket auction.', icon: 'Trophy' },
  { id: 'e-sports', name: 'E-Sports', category: 'non-technical', description: 'Compete in popular gaming titles.', icon: 'Gamepad2' },
  { id: 'dance', name: 'Dance', category: 'non-technical', description: 'Express yourself through movement.', icon: 'Music' },
  { id: 'song-composition', name: 'Song Composition', category: 'non-technical', description: 'Create original music and lyrics.', icon: 'Mic2' },
  { id: 'connections', name: 'Connections', category: 'non-technical', description: 'Find the hidden links between images.', icon: 'Link' },
  { id: 'photography', name: 'Photography', category: 'non-technical', description: 'Capture the world through your lens.', icon: 'Camera' },
  { id: 'tech-quiz', name: 'Technical Quiz', category: 'non-technical', description: 'Test your general technical knowledge.', icon: 'HelpCircle' },
];

export const ALL_EVENTS = [...TECHNICAL_EVENTS, ...NON_TECHNICAL_EVENTS];
