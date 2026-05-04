<template>
  <section class="achievements-root">
    <!-- Header -->
    <div class="header">
      <p class="label">// milestones</p>
      <h2 class="title">
        Wins that<br /><span class="accent">matter.</span>
      </h2>
      <p class="subtitle">Recognition from industry leaders across Latin America</p>
    </div>

    <!-- Cards grid -->
    <div class="cards-grid">
      <div
        v-for="(ach, i) in achievements"
        :key="ach.id"
        class="holo-card"
        :style="{ '--card-color': COLORS[i % COLORS.length] }"
        @mouseenter="startParticles($event, i)"
        @mouseleave="stopParticles(i)"
        ref="cardRefs"
      >
        <!-- Holographic shimmer overlay -->
        <div class="holo-shine" />

        <div class="card-inner">
          <div class="card-icon">{{ ach.icon }}</div>

          <div class="card-metric" ref="metricRefs">
            {{ animatedMetrics[i] ?? ach.metric }}
          </div>

          <h3 class="card-title">{{ ach.title }}</h3>
          <p class="card-org">{{ ach.organization }} · {{ ach.year }}</p>
          <p class="card-desc">{{ ach.description }}</p>
        </div>

        <!-- Particle canvas per card -->
        <canvas
          class="particle-canvas"
          :ref="el => setCanvasRef(el as HTMLCanvasElement | null, i)"
          :width="320"
          :height="220"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { achievements } from '@portfolio/shared';

const COLORS = ['#00D9C0', '#F5A623', '#0099FF', '#A855F7'];

const cardRefs = ref<HTMLElement[]>([]);
const metricRefs = ref<HTMLElement[]>([]);
const animatedMetrics = ref<(string | null)[]>(achievements.map(() => null));

const canvasRefs: (HTMLCanvasElement | null)[] = Array(achievements.length).fill(null);
const particleTimers: (number | null)[] = Array(achievements.length).fill(null);

function setCanvasRef(el: HTMLCanvasElement | null, i: number) {
  canvasRefs[i] = el;
}

// Animate metric counters when cards enter viewport
function animateCounter(index: number) {
  const ach = achievements[index];
  if (ach.metric === '#1' || ach.metric === '#2') {
    animatedMetrics.value[index] = ach.metric;
    return;
  }
  if (ach.metric === 'Partner') {
    let frame = 0;
    const glyphs = '!@#$%^&*01Partner';
    const interval = setInterval(() => {
      if (frame >= 12) {
        animatedMetrics.value[index] = 'Partner';
        clearInterval(interval);
        return;
      }
      animatedMetrics.value[index] = glyphs[Math.floor(Math.random() * glyphs.length)]
        + glyphs[Math.floor(Math.random() * glyphs.length)]
        + glyphs[Math.floor(Math.random() * glyphs.length)]
        + glyphs[Math.floor(Math.random() * glyphs.length)]
        + glyphs[Math.floor(Math.random() * glyphs.length)]
        + glyphs[Math.floor(Math.random() * glyphs.length)]
        + glyphs[Math.floor(Math.random() * glyphs.length)];
      frame++;
    }, 60);
    return;
  }
  animatedMetrics.value[index] = ach.metric;
}

// Particle burst on hover
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  color: string; size: number;
}

const particleArrays: Particle[][] = Array(achievements.length).fill(null).map(() => []);
const rafHandles: (number | null)[] = Array(achievements.length).fill(null);

function spawnParticles(i: number) {
  const canvas = canvasRefs[i];
  if (!canvas) return;
  const color = COLORS[i % COLORS.length];
  for (let p = 0; p < 6; p++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * 2;
    particleArrays[i].push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 40 + Math.random() * 30,
      maxLife: 70,
      color,
      size: 1.5 + Math.random() * 2.5,
    });
  }
}

function runParticleLoop(i: number) {
  const canvas = canvasRefs[i];
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particleArrays[i] = particleArrays[i].filter(p => p.life > 0);
  for (const p of particleArrays[i]) {
    p.x += p.vx; p.y += p.vy; p.life--;
    ctx.globalAlpha = p.life / p.maxLife;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  rafHandles[i] = requestAnimationFrame(() => runParticleLoop(i));
}

function startParticles(e: MouseEvent, i: number) {
  if (particleTimers[i]) return;
  particleTimers[i] = window.setInterval(() => spawnParticles(i), 80);
  if (!rafHandles[i]) runParticleLoop(i);
}

function stopParticles(i: number) {
  if (particleTimers[i]) {
    clearInterval(particleTimers[i]!);
    particleTimers[i] = null;
  }
}

onMounted(() => {
  // IntersectionObserver to trigger counter animations
  const observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const idx = Number((entry.target as HTMLElement).dataset.idx);
          animateCounter(idx);
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.3 }
  );

  // Observe cards after they're rendered
  setTimeout(() => {
    document.querySelectorAll('.holo-card').forEach((el, i) => {
      (el as HTMLElement).dataset.idx = String(i);
      observer.observe(el);
    });
  }, 100);
});

onUnmounted(() => {
  rafHandles.forEach(h => h && cancelAnimationFrame(h));
  particleTimers.forEach(t => t && clearInterval(t));
});
</script>

<style scoped>
.achievements-root {
  background: #060E14;
  padding: 5rem 0 4rem;
  min-height: 100vh;
  font-family: 'Space Grotesk', sans-serif;
}

.header {
  padding: 0 8vw 3rem;
}

.label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #00D9C0;
  margin: 0 0 0.75rem;
}

.title {
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 700;
  color: #E8F4F8;
  line-height: 1.1;
  margin: 0 0 0.75rem;
}

.accent { color: #00D9C0; }

.subtitle {
  font-size: 0.85rem;
  color: #7BA7BC;
  margin: 0;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 0 8vw;
}

.holo-card {
  position: relative;
  background: linear-gradient(135deg, #0D1F2D 0%, #101e2a 100%);
  border: 1px solid var(--card-color, #1E3448);
  border-radius: 12px;
  overflow: hidden;
  cursor: default;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.holo-card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 16px 48px color-mix(in srgb, var(--card-color) 25%, transparent);
}

.holo-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    transparent 30%,
    color-mix(in srgb, var(--card-color) 6%, transparent) 50%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 1;
}

.holo-card:hover .holo-shine {
  opacity: 1;
}

.card-inner {
  position: relative;
  z-index: 2;
  padding: 1.75rem;
}

.card-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
  line-height: 1;
}

.card-metric {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: var(--card-color, #00D9C0);
  margin-bottom: 0.5rem;
  min-height: 1.2em;
  letter-spacing: -0.02em;
}

.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: #E8F4F8;
  margin: 0 0 0.35rem;
  line-height: 1.3;
}

.card-org {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--card-color, #7BA7BC);
  margin: 0 0 0.75rem;
  letter-spacing: 0.05em;
}

.card-desc {
  font-size: 0.82rem;
  color: #7BA7BC;
  line-height: 1.5;
  margin: 0;
}

.particle-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
</style>
