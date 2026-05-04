import type { GameMap } from '../types/index.js';

export const gameMap: GameMap = {
  width: 1200,
  height: 800,
  playerStart: { x: 120, y: 390 },
  zones: [
    {
      id: 'hero',
      section: 'hero',
      label: 'HERO',
      x: 40, y: 280, width: 200, height: 220,
      safeZones: [{ x: 60, y: 300, width: 80, height: 80, targetSection: 'hero' }],
      enemies: [
        { x: 150, y: 350, radius: 14, speed: 1.2, pattern: 'horizontal', amplitude: 120, phase: 0 },
        { x: 150, y: 430, radius: 14, speed: 1.0, pattern: 'horizontal', amplitude: 100, phase: Math.PI },
      ],
      coins: [
        { x: 180, y: 310, label: 'JS' },
        { x: 180, y: 450, label: 'TS' },
      ],
    },
    {
      id: 'experience',
      section: 'experience',
      label: 'EXPERIENCE',
      x: 300, y: 100, width: 360, height: 260,
      safeZones: [
        { x: 330, y: 120, width: 80, height: 80, targetSection: 'experience' },
        { x: 550, y: 120, width: 80, height: 80, targetSection: 'experience' },
      ],
      enemies: [
        { x: 420, y: 180, radius: 14, speed: 1.8, pattern: 'horizontal', amplitude: 80,  phase: 0         },
        { x: 480, y: 280, radius: 14, speed: 1.8, pattern: 'vertical',   amplitude: 80,  phase: Math.PI   },
        { x: 360, y: 240, radius: 12, speed: 2.0, pattern: 'horizontal', amplitude: 120, phase: Math.PI/2 },
        { x: 540, y: 220, radius: 12, speed: 2.0, pattern: 'vertical',   amplitude: 100, phase: Math.PI*1.5},
      ],
      coins: [
        { x: 450, y: 140, label: 'Node' },
        { x: 500, y: 300, label: 'NestJS' },
      ],
    },
    {
      id: 'skills',
      section: 'skills',
      label: 'SKILLS',
      x: 40, y: 560, width: 280, height: 200,
      safeZones: [{ x: 60, y: 580, width: 80, height: 80, targetSection: 'skills' }],
      enemies: [
        { x: 200, y: 620, radius: 13, speed: 2.2, pattern: 'horizontal',  amplitude: 80,  phase: 0         },
        { x: 250, y: 580, radius: 13, speed: 2.0, pattern: 'vertical',    amplitude: 80,  phase: Math.PI/3 },
        { x: 160, y: 700, radius: 13, speed: 2.4, pattern: 'sinusoidal',  amplitude: 60,  phase: 0         },
        { x: 280, y: 660, radius: 12, speed: 2.4, pattern: 'sinusoidal',  amplitude: 50,  phase: Math.PI   },
        { x: 220, y: 640, radius: 12, speed: 1.8, pattern: 'horizontal',  amplitude: 100, phase: Math.PI/2 },
        { x: 130, y: 630, radius: 11, speed: 2.6, pattern: 'vertical',    amplitude: 90,  phase: Math.PI*1.5},
      ],
      coins: [
        { x: 290, y: 590, label: 'React' },
        { x: 290, y: 700, label: 'Vue' },
      ],
    },
    {
      id: 'achievements',
      section: 'achievements',
      label: 'ACHIEVEMENTS',
      x: 680, y: 480, width: 280, height: 220,
      safeZones: [{ x: 700, y: 500, width: 80, height: 80, targetSection: 'achievements' }],
      enemies: [
        { x: 820, y: 530, radius: 13, speed: 2.6, pattern: 'circular',   amplitude: 60,  phase: 0         },
        { x: 880, y: 590, radius: 13, speed: 2.4, pattern: 'circular',   amplitude: 50,  phase: Math.PI/2 },
        { x: 760, y: 640, radius: 12, speed: 2.8, pattern: 'spiral',     amplitude: 70,  phase: Math.PI   },
        { x: 840, y: 660, radius: 12, speed: 2.2, pattern: 'horizontal', amplitude: 80,  phase: Math.PI/3 },
        { x: 780, y: 570, radius: 11, speed: 3.0, pattern: 'sinusoidal', amplitude: 55,  phase: Math.PI*1.5},
        { x: 900, y: 510, radius: 11, speed: 2.6, pattern: 'vertical',   amplitude: 80,  phase: 0         },
        { x: 840, y: 600, radius: 10, speed: 2.8, pattern: 'circular',   amplitude: 45,  phase: Math.PI/4 },
        { x: 720, y: 660, radius: 10, speed: 3.0, pattern: 'spiral',     amplitude: 60,  phase: Math.PI*0.75},
      ],
      coins: [
        { x: 930, y: 500, label: '🏆' },
        { x: 930, y: 650, label: '🥇' },
      ],
    },
    {
      id: 'contact',
      section: 'contact',
      label: 'CONTACT',
      x: 880, y: 200, width: 300, height: 240,
      safeZones: [{ x: 900, y: 220, width: 80, height: 80, targetSection: 'contact' }],
      enemies: [
        { x: 1020, y: 250, radius: 13, speed: 3.2, pattern: 'horizontal',  amplitude: 80,  phase: 0         },
        { x: 1080, y: 310, radius: 13, speed: 3.0, pattern: 'vertical',    amplitude: 80,  phase: Math.PI/4 },
        { x: 1000, y: 370, radius: 13, speed: 3.2, pattern: 'sinusoidal',  amplitude: 70,  phase: Math.PI/2 },
        { x: 1060, y: 260, radius: 12, speed: 3.4, pattern: 'circular',    amplitude: 55,  phase: Math.PI   },
        { x: 1130, y: 330, radius: 12, speed: 3.0, pattern: 'spiral',      amplitude: 65,  phase: Math.PI*1.5},
        { x: 1020, y: 400, radius: 11, speed: 3.4, pattern: 'sinusoidal',  amplitude: 60,  phase: 0         },
        { x: 1090, y: 380, radius: 11, speed: 3.6, pattern: 'horizontal',  amplitude: 90,  phase: Math.PI/3 },
        { x: 1140, y: 260, radius: 10, speed: 3.2, pattern: 'vertical',    amplitude: 100, phase: Math.PI*0.75},
        { x: 1000, y: 300, radius: 10, speed: 3.6, pattern: 'circular',    amplitude: 45,  phase: Math.PI/6 },
        { x: 1120, y: 400, radius: 10, speed: 3.8, pattern: 'spiral',      amplitude: 50,  phase: Math.PI*1.25},
      ],
      coins: [
        { x: 1150, y: 220, label: '📧' },
        { x: 1150, y: 410, label: '💬' },
      ],
    },
  ],
};
