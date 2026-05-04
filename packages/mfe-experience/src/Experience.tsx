import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Timeline } from './components/Timeline/Timeline';

gsap.registerPlugin(ScrollTrigger);

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headingRef.current) return;
    gsap.fromTo(
      headingRef.current.querySelectorAll('.animate'),
      { opacity: 0, y: 24 },
      {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: headingRef.current, start: 'top 80%' },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      style={{ background: '#060E14', paddingTop: '5rem' }}
    >
      <div ref={headingRef} style={{ padding: '0 8vw 3rem' }}>
        <p
          className="animate"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#00D9C0',
            marginBottom: '0.75rem',
            opacity: 0,
          }}
        >
          // career timeline
        </p>
        <h2
          className="animate"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: 700,
            color: '#E8F4F8',
            lineHeight: 1.1,
            opacity: 0,
          }}
        >
          Where I've<br />
          <span style={{ color: '#00D9C0' }}>made impact.</span>
        </h2>
      </div>

      <Timeline />
    </section>
  );
}
