import { useEffect, useRef } from 'react';
import { ParticleField } from './components/ParticleField/ParticleField';
import { HeroContent } from './components/HeroContent/HeroContent';

export function Hero() {
  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: '#060E14',
      }}
    >
      <ParticleField />
      <HeroContent />
    </section>
  );
}
