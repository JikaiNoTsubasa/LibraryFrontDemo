import { Publisher } from '../models/publisher.model';

/**
 * Mock Publishers Data
 * Collection of fictitious book publishers
 */
export const MOCK_PUBLISHERS: Publisher[] = [
  {
    id: 'p1',
    name: 'Epic Gaming Press',
    logo: 'https://via.placeholder.com/200x80/6b46c1/ffffff?text=Epic+Gaming',
    website: 'https://epicgamingpress.com',
    foundedYear: 2010,
    location: 'London, UK',
    bookIds: ['1', '5', '9', '20'],
  },
  {
    id: 'p2',
    name: 'Neon Future Publishing',
    logo: 'https://via.placeholder.com/200x80/0891b2/ffffff?text=Neon+Future',
    website: 'https://neonfuture.io',
    foundedYear: 2015,
    location: 'San Francisco, USA',
    bookIds: ['2', '8', '10', '15', '19'],
  },
  {
    id: 'p3',
    name: 'Mystery House Books',
    logo: 'https://via.placeholder.com/200x80/dc2626/ffffff?text=Mystery+House',
    website: 'https://mysteryhousebooks.com',
    foundedYear: 1998,
    location: 'Tokyo, Japan',
    bookIds: ['3', '11', '16'],
  },
  {
    id: 'p4',
    name: 'Romantic Chronicles',
    logo: 'https://via.placeholder.com/200x80/ec4899/ffffff?text=Romantic+Chronicles',
    website: 'https://romanticchronicles.com',
    foundedYear: 2005,
    location: 'Rome, Italy',
    bookIds: ['4', '12'],
  },
  {
    id: 'p5',
    name: 'Shadow & Spine Publishing',
    logo: 'https://via.placeholder.com/200x80/1f2937/ffffff?text=Shadow+%26+Spine',
    website: 'https://shadowandspine.com',
    foundedYear: 2012,
    location: 'Moscow, Russia',
    bookIds: ['6', '13', '17'],
  },
  {
    id: 'p6',
    name: 'Horizon YA Collective',
    logo: 'https://via.placeholder.com/200x80/f59e0b/ffffff?text=Horizon+YA',
    website: 'https://horizonya.com',
    foundedYear: 2018,
    location: 'Cape Town, South Africa',
    bookIds: ['7', '14', '18'],
  },
];
