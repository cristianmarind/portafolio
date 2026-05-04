export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  duration: string;
  summary: string;
  bullets: string[];
  technologies: string[];
  highlight?: string;
}

export interface Skill {
  name: string;
  level: 'Senior' | 'Medium' | 'Junior';
  category: 'Backend' | 'Frontend' | 'Cloud' | 'Database' | 'Leadership' | 'DevOps';
  weight: number;
}

export interface Achievement {
  id: string;
  title: string;
  organization: string;
  year: number;
  description: string;
  icon: string;
  metric?: string;
}

export interface GameZone {
  id: string;
  section: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  safeZones: SafeZone[];
  enemies: EnemyConfig[];
  coins: CoinConfig[];
}

export interface SafeZone {
  x: number;
  y: number;
  width: number;
  height: number;
  targetSection: string;
}

export interface EnemyConfig {
  x: number;
  y: number;
  radius: number;
  speed: number;
  pattern: 'horizontal' | 'vertical' | 'circular' | 'sinusoidal' | 'spiral';
  amplitude: number;
  phase?: number;
}

export interface CoinConfig {
  x: number;
  y: number;
  label: string;
}

export interface GameMap {
  width: number;
  height: number;
  playerStart: { x: number; y: number };
  zones: GameZone[];
}

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  email: string;
  phone: string;
  linkedIn: string;
  location: string;
  about: string;
  objective: string;
}
