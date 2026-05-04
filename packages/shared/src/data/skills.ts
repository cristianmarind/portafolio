import type { Skill } from '../types/index.js';

export const skills: Skill[] = [
  // Backend
  { name: 'Node.js',    level: 'Senior', category: 'Backend',   weight: 10 },
  { name: 'NestJS',     level: 'Senior', category: 'Backend',   weight: 9  },
  { name: 'TypeScript', level: 'Senior', category: 'Backend',   weight: 10 },
  { name: 'JavaScript', level: 'Senior', category: 'Backend',   weight: 10 },
  { name: 'Loopback',   level: 'Senior', category: 'Backend',   weight: 6  },
  { name: 'Meteor.js',  level: 'Senior', category: 'Backend',   weight: 5  },
  { name: 'Python',     level: 'Medium', category: 'Backend',   weight: 5  },
  { name: 'Java',       level: 'Medium', category: 'Backend',   weight: 4  },

  // Frontend
  { name: 'React.js',   level: 'Senior', category: 'Frontend',  weight: 9  },
  { name: 'Vue.js',     level: 'Senior', category: 'Frontend',  weight: 9  },
  { name: 'Next.js',    level: 'Senior', category: 'Frontend',  weight: 8  },
  { name: 'Angular',    level: 'Junior', category: 'Frontend',  weight: 5  },
  { name: 'HTML5/CSS3', level: 'Senior', category: 'Frontend',  weight: 9  },
  { name: 'Ionic',      level: 'Senior', category: 'Frontend',  weight: 7  },
  { name: 'React Native',level:'Senior', category: 'Frontend',  weight: 7  },

  // Cloud & DevOps
  { name: 'AWS',            level: 'Medium', category: 'Cloud',   weight: 7  },
  { name: 'GitHub Actions', level: 'Senior', category: 'DevOps',  weight: 9  },
  { name: 'CI/CD',          level: 'Senior', category: 'DevOps',  weight: 9  },
  { name: 'Kubernetes',     level: 'Medium', category: 'Cloud',   weight: 6  },
  { name: 'Docker',         level: 'Medium', category: 'Cloud',   weight: 6  },
  { name: 'Amazon S3',      level: 'Senior', category: 'Cloud',   weight: 8  },
  { name: 'Firebase',       level: 'Senior', category: 'Cloud',   weight: 7  },

  // Database
  { name: 'MongoDB',    level: 'Senior', category: 'Database',  weight: 9  },
  { name: 'PostgreSQL', level: 'Senior', category: 'Database',  weight: 9  },
  { name: 'Redis',      level: 'Senior', category: 'Database',  weight: 8  },
  { name: 'SQL',        level: 'Senior', category: 'Database',  weight: 9  },
  { name: 'Sequelize',  level: 'Senior', category: 'Database',  weight: 7  },

  // Security & Auth
  { name: 'OAuth 2.0',  level: 'Senior', category: 'Backend',   weight: 9  },
  { name: 'JWT / OIDC', level: 'Senior', category: 'Backend',   weight: 9  },

  // Leadership
  { name: 'System Design', level: 'Senior', category: 'Leadership', weight: 9 },
  { name: 'Agile/Scrum',   level: 'Senior', category: 'Leadership', weight: 9 },
  { name: 'Stakeholder Mgmt', level: 'Senior', category: 'Leadership', weight: 8 },
  { name: 'ADR / HLD',     level: 'Senior', category: 'Leadership', weight: 8 },
  { name: 'Team Leadership',level: 'Senior', category: 'Leadership', weight: 9 },
];
