import { initFederation } from '@angular-architects/native-federation';

const isProd = location.hostname !== 'localhost';
const base = isProd ? '.' : 'http://localhost';

const remotes: Record<string, string> = isProd
  ? {
      'mfe-hero':         './mfe-hero/remoteEntry.json',
      'mfe-experience':   './mfe-experience/remoteEntry.json',
      'mfe-skills':       './mfe-skills/remoteEntry.json',
      'mfe-achievements': './mfe-achievements/remoteEntry.json',
      'mfe-contact':      './mfe-contact/remoteEntry.json',
      'mfe-game':         './mfe-game/remoteEntry.json',
    }
  : {
      'mfe-hero':         `${base}:3001/remoteEntry.json`,
      'mfe-experience':   `${base}:3002/remoteEntry.json`,
      'mfe-skills':       `${base}:3003/remoteEntry.json`,
      'mfe-achievements': `${base}:3004/remoteEntry.json`,
      'mfe-contact':      `${base}:3005/remoteEntry.json`,
      'mfe-game':         `${base}:3006/remoteEntry.json`,
    };

initFederation(remotes)
  .catch(err => console.error('Federation init failed:', err))
  .then(() => import('./bootstrap'))
  .catch(err => console.error('Bootstrap failed:', err));
