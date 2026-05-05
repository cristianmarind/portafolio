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

    // Center first card at t=0
    const firstCard = track.querySelector<HTMLElement>('.exp-card');
    const leadPad = firstCard
      ? Math.max(0, (wrap.offsetWidth - firstCard.offsetWidth) / 2)
      : wrap.offsetWidth * 0.08;
    track.style.paddingLeft = `${leadPad}px`;
    track.style.paddingRight = `${leadPad}px`;

    const cards = gsap.utils.toArray<HTMLElement>('.exp-card', track);
    const calcTotal = () => track.scrollWidth - wrap.offsetWidth;

    // Anchor at t=1 so positions map 1:1 with scroll progress
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: 'top top',
        end: () => `+=${calcTotal() + window.innerHeight}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    tl.set({}, {}, 1);
    tl.to(track, { x: () => -calcTotal(), duration: 1, ease: 'none' }, 0);
    if (lineRef.current) {
      tl.to(lineRef.current, { attr: { x2: '100%' }, duration: 1, ease: 'none' }, 0);
    }

    // Viewport-synced card fade in/out
    const totalScroll = calcTotal();
    const fadeDur = 0.06;

    cards.forEach((card) => {
      const cardLeft = card.offsetLeft;
      const cardW = card.offsetWidth;
      // when card's right edge first enters viewport from the right
      const rawEnter = (cardLeft + cardW - wrap.offsetWidth) / totalScroll;
      // when card's left edge exits viewport to the left
      const exitAt = cardLeft / totalScroll;

      if (rawEnter > fadeDur) {
        gsap.set(card, { opacity: 0, y: 24 });
        tl.to(card, { opacity: 1, y: 0, duration: fadeDur, ease: 'power2.out' }, rawEnter - fadeDur);
      } else {
        gsap.set(card, { opacity: 1, y: 0 });
      }

      if (exitAt > fadeDur && exitAt < 1 - fadeDur) {
        tl.to(card, { opacity: 0, y: -12, duration: fadeDur, ease: 'power1.in' }, exitAt);
      }
    });

    // Mouse drag: horizontal drag → vertical scroll to drive pinned section
    let dragging = false;
    let startX = 0;
    let startScrollY = 0;

    const onDown = (e: MouseEvent) => {
      dragging = true;
      startX = e.clientX;
      startScrollY = window.scrollY;
      wrap.style.cursor = 'grabbing';
      e.preventDefault();
    };

    const onMove = (e: MouseEvent) => {
      if (!dragging) return;
      const total = calcTotal();
      const dx = startX - e.clientX;
      window.scrollTo(0, startScrollY + dx * ((total + window.innerHeight) / total));
    };

    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      wrap.style.cursor = 'grab';
    };

    wrap.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
      wrap.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{ position: 'relative', overflow: 'hidden', height: '100vh', cursor: 'grab' }}
    >
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

      <div
        ref={trackRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          paddingTop: '2rem',
          paddingBottom: '2rem',
          height: '100%',
          willChange: 'transform',
        }}
      >
        {experiences.map((exp, i) => (
          <ExperienceCard key={exp.id} experience={exp} index={i} />
        ))}

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
