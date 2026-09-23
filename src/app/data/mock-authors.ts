import { Author } from '../models/author.model';

/**
 * Mock Authors Data
 * Collection of fictitious authors for the gaming-style library
 */
export const MOCK_AUTHORS: Author[] = [
  {
    id: 'a1',
    name: 'Elena Darkwood',
    bio: 'Award-winning fantasy author known for her immersive dark fantasy worlds and complex magical systems. Master of atmospheric storytelling.',
    avatarImage: 'https://i.pravatar.cc/300?img=1',
    nationality: 'British',
    website: 'https://elenadarkwood.com',
    socialMedia: {
      twitter: '@elenadarkwood',
      instagram: '@elena_darkwood_author',
    },
    bookIds: ['1', '5', '9'],
  },
  {
    id: 'a2',
    name: 'Marcus Steel',
    bio: 'Cyberpunk and sci-fi visionary exploring the intersection of technology and humanity. Known for fast-paced action and philosophical depth.',
    avatarImage: 'https://i.pravatar.cc/300?img=12',
    nationality: 'American',
    website: 'https://marcussteel.io',
    socialMedia: {
      twitter: '@marcussteel',
    },
    bookIds: ['2', '10', '15'],
  },
  {
    id: 'a3',
    name: 'Yuki Tanaka',
    bio: 'Master of psychological thrillers and mysteries with a unique Japanese perspective. Every page keeps you guessing.',
    avatarImage: 'https://i.pravatar.cc/300?img=5',
    nationality: 'Japanese',
    bookIds: ['3', '11', '16'],
  },
  {
    id: 'a4',
    name: 'Isabella Romano',
    bio: 'Passionate romance and historical fiction author bringing epic love stories to life across centuries.',
    avatarImage: 'https://i.pravatar.cc/300?img=9',
    nationality: 'Italian',
    website: 'https://isabellaromano.com',
    socialMedia: {
      instagram: '@isabella.romano.writes',
    },
    bookIds: ['4', '12'],
  },
  {
    id: 'a5',
    name: 'Viktor Volkov',
    bio: 'Horror and dark fiction specialist crafting nightmares that linger long after the last page. Not for the faint of heart.',
    avatarImage: 'https://i.pravatar.cc/300?img=15',
    nationality: 'Russian',
    bookIds: ['6', '13', '17'],
  },
  {
    id: 'a6',
    name: 'Amara Jones',
    bio: 'Young adult adventure author creating diverse, action-packed worlds where every teenager can see themselves as a hero.',
    avatarImage: 'https://i.pravatar.cc/300?img=20',
    nationality: 'South African',
    website: 'https://amarajones.com',
    socialMedia: {
      twitter: '@amarajonesya',
      instagram: '@amara_jones_books',
    },
    bookIds: ['7', '14', '18'],
  },
  {
    id: 'a7',
    name: 'Dr. Chen Wei',
    bio: 'Former physicist turned hard sci-fi author. Brings scientific accuracy to mind-bending space operas.',
    avatarImage: 'https://i.pravatar.cc/300?img=33',
    nationality: 'Chinese',
    bookIds: ['8', '19'],
  },
  {
    id: 'a8',
    name: 'Sophia Blackthorne',
    bio: 'Gothic fantasy specialist weaving tales of magic, mystery, and forbidden love in Victorian-inspired settings.',
    avatarImage: 'https://i.pravatar.cc/300?img=27',
    nationality: 'Canadian',
    website: 'https://sophiablackthorne.com',
    bookIds: ['20'],
  },
];
