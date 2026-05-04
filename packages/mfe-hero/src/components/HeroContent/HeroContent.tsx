import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function HeroContent() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapRef.current) return;
    const el = wrapRef.current;
    gsap.fromTo(
      el.querySelectorAll('.animate'),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 2.0 },
    );
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'absolute',
        bottom: '12%',
        left: '8vw',
        zIndex: 10,
        maxWidth: '600px',
      }}
    >
      <p
        className="animate"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#00D9C0',
          marginBottom: '1rem',
          opacity: 0,
        }}
      >
        // technical lead &amp; senior full stack engineer
      </p>

      <h1
        className="animate"
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 700,
          color: '#E8F4F8',
          lineHeight: 1.1,
          marginBottom: '1.25rem',
          opacity: 0,
        }}
      >
        I make things<br />
        <span style={{ color: '#00D9C0' }}>happen.</span>
      </h1>

      <p
        className="animate"
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '1rem',
          color: '#7BA7BC',
          lineHeight: 1.7,
          marginBottom: '2rem',
          opacity: 0,
        }}
      >
        Microservices · Microfrontends · Cloud · Technical Leadership
      </p>

      <div
        className="animate"
        style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', opacity: 0 }}
      >
        <a
          href="#experience"
          onClick={(e) => { e.preventDefault(); document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' }); }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '10px 24px',
            background: '#00D9C0',
            color: '#060E14',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: '0.85rem',
            borderRadius: '6px',
            cursor: 'none',
            textDecoration: 'none',
            transition: 'opacity 0.2s',
          }}
        >
          View Experience
        </a>
        <a
          href="mailto:camd1996@gmail.com"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '10px 24px',
            border: '1.5px solid #1E3448',
            color: '#E8F4F8',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 500,
            fontSize: '0.85rem',
            borderRadius: '6px',
            cursor: 'none',
            textDecoration: 'none',
          }}
        >
          Get in touch
        </a>
      </div>

      <div
        className="animate"
        style={{
          position: 'absolute',
          bottom: '-6rem',
          left: 0,
          opacity: 0,
        }}
      >
        <svg width="20" height="40" viewBox="0 0 20 40" style={{ animation: 'bounce 2s ease infinite' }}>
          <line x1="10" y1="0" x2="10" y2="28" stroke="#1E3448" strokeWidth="1.5"/>
          <polyline points="4,22 10,30 16,22" fill="none" stroke="#00D9C0" strokeWidth="1.5"/>
        </svg>
        <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }`}</style>
      </div>
    </div>
  );
}
