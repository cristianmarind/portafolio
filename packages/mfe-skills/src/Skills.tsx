import { useEffect, useRef, useState } from 'react';
import { skills } from '@portfolio/shared';
import type { Skill } from '@portfolio/shared';

const CATEGORY_COLORS: Record<string, string> = {
  Backend:    '#00D9C0',
  Frontend:   '#0099FF',
  Cloud:      '#F5A623',
  DevOps:     '#FF6B9D',
  Database:   '#A855F7',
  Leadership: '#E8F4F8',
};

interface Bubble {
  skill: Skill;
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  color: string;
  alpha: number;
  exploding: boolean;
  particles: Particle[];
}

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  color: string; size: number;
}

function initBubbles(w: number, h: number): Bubble[] {
  return skills.map(skill => {
    const r = 20 + skill.weight * 3.2;
    return {
      skill,
      x: r + Math.random() * (w - r * 2),
      y: r + Math.random() * (h - r * 2),
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r,
      color: CATEGORY_COLORS[skill.category] ?? '#7BA7BC',
      alpha: 0,
      exploding: false,
      particles: [],
    };
  });
}

export function Skills() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const rafRef = useRef(0);
  const [tooltip, setTooltip] = useState<{ skill: Skill; x: number; y: number } | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      bubblesRef.current = initBubbles(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    // Fade in bubbles
    bubblesRef.current.forEach((b, i) => {
      setTimeout(() => { b.alpha = 1; }, i * 40);
    });

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      const { width: W, height: H } = canvas;
      ctx.clearRect(0, 0, W, H);

      const bubbles = bubblesRef.current;

      // Physics
      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];
        if (b.exploding) continue;

        b.x += b.vx;
        b.y += b.vy;

        // Wall bounce
        if (b.x - b.r < 0) { b.x = b.r; b.vx = Math.abs(b.vx); }
        if (b.x + b.r > W) { b.x = W - b.r; b.vx = -Math.abs(b.vx); }
        if (b.y - b.r < 0) { b.y = b.r; b.vy = Math.abs(b.vy); }
        if (b.y + b.r > H) { b.y = H - b.r; b.vy = -Math.abs(b.vy); }

        // Bubble-bubble repulsion
        for (let j = i + 1; j < bubbles.length; j++) {
          const b2 = bubbles[j];
          if (b2.exploding) continue;
          const dx = b2.x - b.x, dy = b2.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = b.r + b2.r + 4;
          if (dist < minDist && dist > 0) {
            const nx = dx / dist, ny = dy / dist;
            const overlap = (minDist - dist) / 2;
            b.x -= nx * overlap; b.y -= ny * overlap;
            b2.x += nx * overlap; b2.y += ny * overlap;
            const relV = (b.vx - b2.vx) * nx + (b.vy - b2.vy) * ny;
            if (relV > 0) {
              b.vx -= relV * nx; b.vy -= relV * ny;
              b2.vx += relV * nx; b2.vy += relV * ny;
            }
          }
        }
      }

      // Draw bubbles
      for (const b of bubbles) {
        if (b.exploding) {
          // Draw particles
          b.particles = b.particles.filter(p => p.life > 0);
          for (const p of b.particles) {
            p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.life--;
            ctx.globalAlpha = p.life / p.maxLife;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalAlpha = 1;
          if (b.particles.length === 0) b.exploding = false;
          continue;
        }

        const isActive = activeCategory === null || b.skill.category === activeCategory;
        const alpha = b.alpha * (isActive ? 1 : 0.15);

        ctx.globalAlpha = alpha;

        // Glow
        const grd = ctx.createRadialGradient(b.x, b.y, b.r * 0.3, b.x, b.y, b.r);
        grd.addColorStop(0, b.color + '33');
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Circle
        ctx.strokeStyle = b.color;
        ctx.lineWidth = 1.5;
        ctx.fillStyle = '#0D1F2D';
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Label
        ctx.fillStyle = isActive ? '#E8F4F8' : '#7BA7BC';
        ctx.font = `${Math.max(9, b.r * 0.38)}px "Space Grotesk", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const words = b.skill.name.split(' ');
        if (words.length > 1 && b.r > 36) {
          ctx.fillText(words[0], b.x, b.y - 6);
          ctx.fillText(words.slice(1).join(' '), b.x, b.y + 8);
        } else {
          ctx.fillText(b.skill.name, b.x, b.y);
        }

        ctx.globalAlpha = 1;
      }
    };
    loop();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [activeCategory]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    for (const b of bubblesRef.current) {
      if (b.exploding) continue;
      const dx = mx - b.x, dy = my - b.y;
      if (dx * dx + dy * dy < b.r * b.r) {
        setTooltip({ skill: b.skill, x: e.clientX, y: e.clientY });
        // Explode
        b.exploding = true;
        for (let i = 0; i < 28; i++) {
          const angle = (Math.PI * 2 * i) / 28;
          const speed = 1.5 + Math.random() * 3;
          b.particles.push({
            x: b.x, y: b.y,
            vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
            life: 40 + Math.random() * 20, maxLife: 60,
            color: b.color, size: 2 + Math.random() * 3,
          });
        }
        setTimeout(() => {
          b.exploding = false;
          b.x = b.r + Math.random() * (canvasRef.current!.width - b.r * 2);
          b.y = b.r + Math.random() * (canvasRef.current!.height - b.r * 2);
          b.alpha = 1;
        }, 800);
        break;
      }
    }
  };

  const categories = Array.from(new Set(skills.map(s => s.category)));

  return (
    <section style={{ background: '#060E14', padding: '5rem 0 0', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ padding: '0 8vw 2rem' }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#00D9C0', marginBottom: '0.75rem' }}>
          // tech stack
        </p>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 700, color: '#E8F4F8', lineHeight: 1.1 }}>
          The tools I<br /><span style={{ color: '#00D9C0' }}>master.</span>
        </h2>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.85rem', color: '#7BA7BC', marginTop: '0.75rem' }}>
          Click any bubble to interact
        </p>
      </div>

      {/* Category filters */}
      <div style={{ padding: '0 8vw 1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveCategory(null)} style={filterBtn(activeCategory === null, '#7BA7BC')}>All</button>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(activeCategory === cat ? null : cat)} style={filterBtn(activeCategory === cat, CATEGORY_COLORS[cat] ?? '#7BA7BC')}>
            {cat}
          </button>
        ))}
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        style={{ display: 'block', width: '100%', height: '65vh', cursor: 'none' }}
      />

      {/* Tooltip */}
      {tooltip && (
        <div
          onClick={() => setTooltip(null)}
          style={{
            position: 'fixed', top: tooltip.y + 16, left: Math.min(tooltip.x, window.innerWidth - 240),
            background: '#0D1F2D', border: `1px solid ${CATEGORY_COLORS[tooltip.skill.category] ?? '#1E3448'}`,
            borderRadius: '8px', padding: '0.75rem 1rem', zIndex: 1000, minWidth: '180px',
            boxShadow: `0 8px 32px ${CATEGORY_COLORS[tooltip.skill.category] ?? '#1E3448'}22`,
          }}
        >
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#E8F4F8', fontSize: '0.95rem', marginBottom: '0.25rem' }}>{tooltip.skill.name}</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: CATEGORY_COLORS[tooltip.skill.category] ?? '#7BA7BC', marginBottom: '0.25rem' }}>{tooltip.skill.category}</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#7BA7BC' }}>{tooltip.skill.level}</div>
        </div>
      )}
    </section>
  );
}

function filterBtn(active: boolean, color: string): React.CSSProperties {
  return {
    fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem',
    letterSpacing: '0.1em', textTransform: 'uppercase' as const,
    padding: '4px 12px', borderRadius: '6px', cursor: 'none',
    border: `1px solid ${active ? color : '#1E3448'}`,
    background: active ? color + '18' : 'transparent',
    color: active ? color : '#7BA7BC',
    transition: 'all 0.2s',
  };
}
