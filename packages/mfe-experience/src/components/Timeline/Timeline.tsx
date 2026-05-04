import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { experiences } from '@portfolio/shared';
import { ExperienceCard } from '../ExperienceCard/ExperienceCard';

gsap.registerPlugin(ScrollTrigger);

export function Timeline() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    const cards = gsap.utils.toArray<HTMLElement>('.exp-card', track);
    const totalScroll = track.scrollWidth - wrap.offsetWidth;

    // Pin the section and drive horizontal scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: 'top top',
        end: () => `+=${totalScroll + window.innerHeight}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    tl.to(track, { x: -totalScroll, ease: 'none' });

    // Animate SVG line width as scroll progresses
    if (lineRef.current) {
      tl.to(lineRef.current, { attr: { x2: '100%' }, ease: 'none' }, 0);
    }

    // Fade-in each card as it enters viewport (within horizontal scroll)
    cards.forEach((card, i) => {
      tl.fromTo(
        card,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
        i * 0.12
      );
    });

    return () => { ScrollTrigger.getAll().forEach(st => st.kill()); };
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{ position: 'relative', overflow: 'hidden', height: '100vh' }}
    >
      {/* Timeline SVG line */}
      <svg
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          width: '100%',
          height: '2px',
          pointerEvents: 'none',
          zIndex: 1,
        }}
        preserveAspectRatio="none"
      >
        <line
          x1="0" y1="1" x2="0%" y2="1"
          ref={lineRef}
          stroke="#1E3448"
          strokeWidth="2"
        />
        <line x1="0" y1="1" x2="100%" y2="1" stroke="#0D1F2D" strokeWidth="2" />
      </svg>

      {/* Horizontal track */}
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          padding: '2rem 8vw',
          height: '100%',
          willChange: 'transform',
        }}
      >
        {experiences.map((exp, i) => (
          <ExperienceCard key={exp.id} experience={exp} index={i} />
        ))}

        {/* End cap */}
        <div style={{
          flexShrink: 0, width: '240px', display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem',
        }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            border: '2px solid #00D9C0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12l7 7 7-7" stroke="#00D9C0" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.7rem', color: '#7BA7BC',
            textAlign: 'center', letterSpacing: '0.15em',
          }}>
            WHAT'S NEXT?
          </p>
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{
        position: 'absolute', bottom: '2rem', left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.65rem', color: '#1E3448',
        letterSpacing: '0.15em',
        display: 'flex', alignItems: 'center', gap: '0.5rem',
      }}>
        <svg width="16" height="8" viewBox="0 0 16 8">
          <path d="M0 4h14M10 1l4 3-4 3" stroke="#1E3448" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        SCROLL
      </div>
    </div>
  );
}
