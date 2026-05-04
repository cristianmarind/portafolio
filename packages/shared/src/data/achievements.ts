import type { Achievement } from '../types/index.js';

export const achievements: Achievement[] = [
  {
    id: 'apithon-1st',
    title: '1st Place — International Apithon',
    organization: 'Bancolombia',
    year: 2018,
    description: 'Won first place in an international API hackathon organized by one of Latin America\'s largest banks.',
    icon: '🏆',
    metric: '#1',
  },
  {
    id: 'hackathon-1st',
    title: '1st Place — Hackathon',
    organization: 'Bancolombia',
    year: 2018,
    description: 'First place in a competitive hackathon with cross-functional teams building fintech solutions.',
    icon: '🥇',
    metric: '#1',
  },
  {
    id: 'oracle-partner',
    title: 'Oracle Innovation Partner',
    organization: 'Oracle & Banco Guayaquil',
    year: 2019,
    description: 'Selected as partner in an innovation process alongside Oracle and Banco Guayaquil.',
    icon: '🔮',
    metric: 'Partner',
  },
  {
    id: 'fedesoft-2nd',
    title: '2nd Place — National Programming Contest',
    organization: 'FEDESOFT',
    year: 2018,
    description: 'Second place in the national programming contest for students, serving as Project Manager.',
    icon: '🥈',
    metric: '#2',
  },
];
