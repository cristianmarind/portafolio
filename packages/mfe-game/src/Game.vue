<template>
  <div class="game-overlay" @keydown="onKey" @keyup="offKey" tabindex="0" ref="overlayRef">
    <!-- HUD -->
    <div class="hud">
      <span class="deaths-label">DEATHS: <span class="deaths-count">{{ deaths }}</span></span>
      <span class="hud-title">GAME MODE</span>
      <button class="exit-btn" @click="exit">✕ EXIT</button>
    </div>

    <!-- Intro flash -->
    <Transition name="flash">
      <div v-if="showFlash" class="flash-overlay" :class="flashType" />
    </Transition>

    <!-- Canvas -->
    <canvas ref="canvasRef" class="game-canvas" />

    <!-- Section reached modal -->
    <Transition name="popup">
      <div v-if="reachedSection" class="section-modal-backdrop" @click.self="cancelNavigation">
        <div class="section-modal">
          <div class="modal-icon">✓</div>
          <div class="modal-title">{{ reachedSection.toUpperCase() }} REACHED!</div>
          <div class="modal-question">Open this section in a new tab?</div>
          <div class="modal-actions">
            <button class="modal-btn confirm" @click="confirmNavigation">YES — GO</button>
            <button class="modal-btn cancel" @click="cancelNavigation">NO — STAY</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Mobile joystick -->
    <div v-if="isMobile" class="joystick-area" ref="joystickRef"
      @touchstart.prevent="joyStart" @touchmove.prevent="joyMove" @touchend.prevent="joyEnd">
      <div class="joystick-base">
        <div class="joystick-knob" :style="{ transform: `translate(${joyDelta.x}px, ${joyDelta.y}px)` }" />
      </div>
    </div>

    <!-- Legend -->
    <div class="legend">
      <span><span class="dot cyan" /> You</span>
      <span><span class="dot green" /> Safe zone</span>
      <span><span class="dot blue" /> Enemy</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue';
import { gameMap, eventBus } from '@portfolio/shared';

/* ── Types ──────────────────────────────────────────── */
interface Enemy {
  x: number; y: number;
  originX: number; originY: number;
  radius: number; speed: number;
  pattern: string; amplitude: number; phase: number;
  color: string;
}
interface Coin { x: number; y: number; label: string; collected: boolean; bounce: number; }

/* ── Refs ───────────────────────────────────────────── */
const overlayRef = ref<HTMLDivElement>();
const canvasRef = ref<HTMLCanvasElement>();
const deaths = ref(0);
const showFlash = ref(false);
const flashType = ref<'red' | 'green'>('red');
const reachedSection = ref<string | null>(null);
const visitedSection = ref<string | null>(null); // tracks which safe zone player is currently inside
const isMobile = ref(false);

// Click-to-move (plain vars — read every frame, no need for reactivity)
let mouseDown = false;
let mouseCanvasX = 0;
let mouseCanvasY = 0;

function onCanvasMouseMove(e: MouseEvent) {
  if (!canvasRef.value) return;
  const rect = canvasRef.value.getBoundingClientRect();
  mouseCanvasX = e.clientX - rect.left;
  mouseCanvasY = e.clientY - rect.top;
}
function onCanvasMouseDown(e: MouseEvent) { if (e.button === 0) mouseDown = true; }
function onCanvasMouseUp() { mouseDown = false; }

/* ── Player state ───────────────────────────────────── */
const PLAYER_SIZE = 18;
const PLAYER_SPEED = 3.2;
const player = reactive({ x: gameMap.playerStart.x, y: gameMap.playerStart.y, vx: 0, vy: 0 });
const lastSafeX = ref(gameMap.playerStart.x);
const lastSafeY = ref(gameMap.playerStart.y);
const keys = new Set<string>();
const invincible = ref(false);

/* ── Joystick ───────────────────────────────────────── */
const joystickRef = ref<HTMLDivElement>();
const joyDelta = reactive({ x: 0, y: 0 });
const joyRaw = reactive({ x: 0, y: 0 });
let joyOrigin = { x: 0, y: 0 };
const JOY_MAX = 40;

function joyStart(e: TouchEvent) {
  const t = e.touches[0];
  joyOrigin = { x: t.clientX, y: t.clientY };
}
function joyMove(e: TouchEvent) {
  const t = e.touches[0];
  const dx = t.clientX - joyOrigin.x;
  const dy = t.clientY - joyOrigin.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const clamped = Math.min(len, JOY_MAX);
  const ratio = clamped / (len || 1);
  joyRaw.x = (dx / (len || 1)) * clamped;
  joyRaw.y = (dy / (len || 1)) * clamped;
  joyDelta.x = joyRaw.x * ratio;
  joyDelta.y = joyRaw.y * ratio;
}
function joyEnd() { joyDelta.x = 0; joyDelta.y = 0; joyRaw.x = 0; joyRaw.y = 0; }

/* ── Build runtime enemies and coins ────────────────── */
const ENEMY_COLORS = ['#0099FF', '#0077DD', '#0055BB', '#3399FF'];
const enemies: Enemy[] = [];
const coins: Coin[] = [];

for (const zone of gameMap.zones) {
  for (const e of zone.enemies) {
    enemies.push({
      x: e.x, y: e.y,
      originX: e.x, originY: e.y,
      radius: e.radius, speed: e.speed,
      pattern: e.pattern, amplitude: e.amplitude, phase: e.phase,
      color: ENEMY_COLORS[Math.floor(Math.random() * ENEMY_COLORS.length)],
    });
  }
  for (const c of zone.coins) {
    coins.push({ x: c.x, y: c.y, label: c.label, collected: false, bounce: Math.random() * Math.PI * 2 });
  }
}

/* ── Camera / viewport ──────────────────────────────── */
const camera = reactive({ x: 0, y: 0 });

/* ── Game loop ──────────────────────────────────────── */
let rafId = 0;
let t = 0;
let dying = false;

function updatePlayer() {
  if (dying || invincible.value || reachedSection.value) return;

  let ax = 0, ay = 0;

  // Keyboard
  if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A')) ax -= 1;
  if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) ax += 1;
  if (keys.has('ArrowUp') || keys.has('w') || keys.has('W')) ay -= 1;
  if (keys.has('ArrowDown') || keys.has('s') || keys.has('S')) ay += 1;

  // Joystick (normalize to [-1, 1])
  if (isMobile.value && (joyRaw.x !== 0 || joyRaw.y !== 0)) {
    ax = joyRaw.x / JOY_MAX;
    ay = joyRaw.y / JOY_MAX;
    const len = Math.sqrt(ax * ax + ay * ay);
    if (len > 1) { ax /= len; ay /= len; }
  }

  // Click-to-move: held mouse button drives direction toward cursor (overrides keyboard/joystick)
  if (mouseDown) {
    const dx = mouseCanvasX + camera.x - player.x;
    const dy = mouseCanvasY + camera.y - player.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 8) { ax = dx / dist; ay = dy / dist; }
  }

  player.vx = ax * PLAYER_SPEED;
  player.vy = ay * PLAYER_SPEED;

  player.x = Math.max(PLAYER_SIZE / 2, Math.min(gameMap.width - PLAYER_SIZE / 2, player.x + player.vx));
  player.y = Math.max(PLAYER_SIZE / 2, Math.min(gameMap.height - PLAYER_SIZE / 2, player.y + player.vy));
}

function updateEnemies(ts: number) {
  for (const e of enemies) {
    const time = ts * 0.001 * e.speed;
    switch (e.pattern) {
      case 'horizontal':
        e.x = e.originX + Math.sin(time + e.phase) * e.amplitude;
        break;
      case 'vertical':
        e.y = e.originY + Math.sin(time + e.phase) * e.amplitude;
        break;
      case 'sinusoidal':
        e.x = e.originX + Math.sin(time + e.phase) * e.amplitude;
        e.y = e.originY + Math.cos(time * 1.3 + e.phase) * (e.amplitude * 0.6);
        break;
      case 'circular':
        e.x = e.originX + Math.cos(time + e.phase) * e.amplitude;
        e.y = e.originY + Math.sin(time + e.phase) * e.amplitude;
        break;
      case 'spiral': {
        const r = e.amplitude * (0.4 + 0.6 * Math.abs(Math.sin(time * 0.3)));
        e.x = e.originX + Math.cos(time + e.phase) * r;
        e.y = e.originY + Math.sin(time + e.phase) * r;
        break;
      }
    }
  }
}

function checkCollisions(ts: number) {
  if (dying || invincible.value) return;

  const px = player.x, py = player.y;
  const half = PLAYER_SIZE / 2;

  // Safe zone check — also tracks entry for modal trigger
  let inSafeZone = false;
  for (const zone of gameMap.zones) {
    for (const sz of zone.safeZones) {
      if (px + half > sz.x && px - half < sz.x + sz.width &&
          py + half > sz.y && py - half < sz.y + sz.height) {
        inSafeZone = true;
        lastSafeX.value = sz.x + sz.width / 2;
        lastSafeY.value = sz.y + sz.height / 2;

        // Modal fires once per entry (resets when player leaves the zone)
        if (sz.targetSection !== visitedSection.value && !reachedSection.value) {
          visitedSection.value = sz.targetSection;
          reachedSection.value = sz.targetSection;
          keys.clear();
          flashType.value = 'green';
          showFlash.value = true;
          setTimeout(() => { showFlash.value = false; }, 400);
        }
      }
    }
  }

  // Reset visited tracking when player fully exits all safe zones
  if (!inSafeZone) visitedSection.value = null;

  // Coin collection (always active)
  for (const coin of coins) {
    if (coin.collected) continue;
    const dx = px - coin.x, dy = py - coin.y;
    if (dx * dx + dy * dy < (PLAYER_SIZE / 2 + 14) ** 2) {
      coin.collected = true;
    }
  }

  // Enemy collision blocked while inside a safe zone
  if (inSafeZone) return;
  for (const e of enemies) {
    const dx = px - e.x, dy = py - e.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < PLAYER_SIZE / 2 + e.radius - 2) {
      die();
      return;
    }
  }
}

function die() {
  if (dying) return;
  dying = true;
  deaths.value++;
  flashType.value = 'red';
  showFlash.value = true;

  // 8-bit death beep via Web Audio API
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(); osc.stop(ctx.currentTime + 0.3);
  } catch { /* AudioContext blocked */ }

  setTimeout(() => {
    showFlash.value = false;
    player.x = lastSafeX.value;
    player.y = lastSafeY.value;
    player.vx = 0; player.vy = 0;
    dying = false;
    invincible.value = true;
    setTimeout(() => { invincible.value = false; }, 1500);
  }, 500);
}

/* ── Rendering ──────────────────────────────────────── */
function render(canvas: HTMLCanvasElement, ts: number) {
  const ctx = canvas.getContext('2d')!;
  const W = canvas.width, H = canvas.height;

  // Camera follows player (center on player)
  const targetCamX = player.x - W / 2;
  const targetCamY = player.y - H / 2;
  camera.x += (targetCamX - camera.x) * 0.12;
  camera.y += (targetCamY - camera.y) * 0.12;
  camera.x = Math.max(0, Math.min(gameMap.width - W, camera.x));
  camera.y = Math.max(0, Math.min(gameMap.height - H, camera.y));

  ctx.clearRect(0, 0, W, H);
  ctx.save();
  ctx.translate(-camera.x, -camera.y);

  // Background grid
  ctx.strokeStyle = '#0D1F2D';
  ctx.lineWidth = 1;
  const gridSize = 40;
  const startX = Math.floor(camera.x / gridSize) * gridSize;
  const startY = Math.floor(camera.y / gridSize) * gridSize;
  for (let gx = startX; gx < camera.x + W + gridSize; gx += gridSize) {
    ctx.beginPath(); ctx.moveTo(gx, camera.y); ctx.lineTo(gx, camera.y + H); ctx.stroke();
  }
  for (let gy = startY; gy < camera.y + H + gridSize; gy += gridSize) {
    ctx.beginPath(); ctx.moveTo(camera.x, gy); ctx.lineTo(camera.x + W, gy); ctx.stroke();
  }

  // Zones
  for (const zone of gameMap.zones) {
    // Zone border
    ctx.strokeStyle = '#1E3448';
    ctx.lineWidth = 2;
    ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);

    // Zone label
    ctx.fillStyle = '#F5A623';
    ctx.font = '600 10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(zone.label, zone.x + zone.width / 2, zone.y + 14);

    // Safe zones
    for (const sz of zone.safeZones) {
      ctx.fillStyle = '#00FF6618';
      ctx.fillRect(sz.x, sz.y, sz.width, sz.height);
      ctx.strokeStyle = '#00FF66';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(sz.x, sz.y, sz.width, sz.height);
    }
  }

  // Coins
  for (const coin of coins) {
    if (coin.collected) continue;
    coin.bounce += 0.04;
    const by = Math.sin(coin.bounce) * 3;
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = '#F5A623';
    ctx.beginPath();
    ctx.arc(coin.x, coin.y + by, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#060E14';
    ctx.font = 'bold 8px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(coin.label.length <= 2 ? coin.label : coin.label.slice(0, 2), coin.x, coin.y + by);
  }
  ctx.textBaseline = 'alphabetic';

  // Enemies
  for (const e of enemies) {
    const grd = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.radius);
    grd.addColorStop(0, e.color + 'CC');
    grd.addColorStop(1, e.color + '44');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = e.color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Player
  const px = player.x, py = player.y;
  const blink = invincible.value && Math.sin(ts * 0.02) > 0;
  if (!blink) {
    const playerColor = '#00D9C0';
    ctx.shadowColor = playerColor;
    ctx.shadowBlur = 12;
    ctx.fillStyle = playerColor + 'CC';
    ctx.strokeStyle = playerColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(px - PLAYER_SIZE / 2, py - PLAYER_SIZE / 2, PLAYER_SIZE, PLAYER_SIZE);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Direction indicator triangle
    if (player.vx !== 0 || player.vy !== 0) {
      const angle = Math.atan2(player.vy, player.vx);
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(angle);
      ctx.fillStyle = playerColor;
      ctx.beginPath();
      ctx.moveTo(PLAYER_SIZE / 2 + 4, 0);
      ctx.lineTo(PLAYER_SIZE / 2 + 10, -3);
      ctx.lineTo(PLAYER_SIZE / 2 + 10, 3);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  ctx.restore();

  // Click-to-move target indicator (screen space)
  if (mouseDown) {
    ctx.save();
    ctx.strokeStyle = '#00D9C055';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(mouseCanvasX, mouseCanvasY, 9, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(mouseCanvasX - 5, mouseCanvasY);
    ctx.lineTo(mouseCanvasX + 5, mouseCanvasY);
    ctx.moveTo(mouseCanvasX, mouseCanvasY - 5);
    ctx.lineTo(mouseCanvasX, mouseCanvasY + 5);
    ctx.stroke();
    ctx.restore();
  }

  // Mini-map (top right)
  drawMiniMap(ctx, W, H);
}

function drawMiniMap(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const mmW = 120, mmH = 80, mmX = W - mmW - 12, mmY = 44;
  const scaleX = mmW / gameMap.width, scaleY = mmH / gameMap.height;

  ctx.fillStyle = '#060E14CC';
  ctx.strokeStyle = '#1E3448';
  ctx.lineWidth = 1;
  ctx.fillRect(mmX, mmY, mmW, mmH);
  ctx.strokeRect(mmX, mmY, mmW, mmH);

  // Zones on minimap
  for (const zone of gameMap.zones) {
    ctx.fillStyle = '#1E3448';
    ctx.fillRect(mmX + zone.x * scaleX, mmY + zone.y * scaleY, zone.width * scaleX, zone.height * scaleY);
    for (const sz of zone.safeZones) {
      ctx.fillStyle = '#00FF6644';
      ctx.fillRect(mmX + sz.x * scaleX, mmY + sz.y * scaleY, sz.width * scaleX, sz.height * scaleY);
    }
  }

  // Player on minimap
  ctx.fillStyle = '#00D9C0';
  ctx.fillRect(
    mmX + player.x * scaleX - 2, mmY + player.y * scaleY - 2, 4, 4
  );
}

/* ── Main loop ──────────────────────────────────────── */
function loop(ts: number) {
  t = ts;
  updatePlayer();
  updateEnemies(ts);
  checkCollisions(ts);
  if (canvasRef.value) render(canvasRef.value, ts);
  rafId = requestAnimationFrame(loop);
}

/* ── Modal navigation ───────────────────────────────── */
function confirmNavigation() {
  if (!reachedSection.value) return;
  const url = window.location.origin + window.location.pathname + '#' + reachedSection.value;
  window.open(url, '_blank', 'noopener,noreferrer');
  dismissModal();
}

function cancelNavigation() { dismissModal(); }

function dismissModal() {
  reachedSection.value = null;
  nextTick(() => overlayRef.value?.focus());
}

/* ── Keyboard ───────────────────────────────────────── */
function onKey(e: KeyboardEvent) {
  if (reachedSection.value) return;
  keys.add(e.key);
  e.preventDefault();
}
function offKey(e: KeyboardEvent) { keys.delete(e.key); }

/* ── Exit ───────────────────────────────────────────── */
function exit() { eventBus.emit('game:exit', {}); }

/* ── Resize canvas ──────────────────────────────────── */
function resize() {
  if (!canvasRef.value) return;
  canvasRef.value.width = canvasRef.value.offsetWidth;
  canvasRef.value.height = canvasRef.value.offsetHeight;
}

onMounted(async () => {
  isMobile.value = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
  await nextTick();
  overlayRef.value?.focus();
  resize();
  window.addEventListener('resize', resize);

  const canvas = canvasRef.value!;
  canvas.addEventListener('mousemove', onCanvasMouseMove);
  canvas.addEventListener('mousedown', onCanvasMouseDown);
  window.addEventListener('mouseup', onCanvasMouseUp);

  rafId = requestAnimationFrame(loop);
});

onUnmounted(() => {
  cancelAnimationFrame(rafId);
  window.removeEventListener('resize', resize);
  window.removeEventListener('mouseup', onCanvasMouseUp);
  const canvas = canvasRef.value;
  if (canvas) {
    canvas.removeEventListener('mousemove', onCanvasMouseMove);
    canvas.removeEventListener('mousedown', onCanvasMouseDown);
  }
});
</script>

<style scoped>
.game-overlay {
  position: fixed;
  inset: 0;
  background: #060E14F5;
  z-index: 9000;
  outline: none;
  display: flex;
  flex-direction: column;
}

.hud {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 1.5rem;
  background: #0D1F2D;
  border-bottom: 1px solid #1E3448;
  flex-shrink: 0;
  z-index: 1;
}

.deaths-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  color: #7BA7BC;
  text-transform: uppercase;
}

.deaths-count {
  color: #FF6B6B;
  font-weight: 700;
}

.hud-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.3em;
  color: #00D9C0;
  text-transform: uppercase;
}

.exit-btn {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 6px;
  border: 1px solid #FF6B9D;
  background: transparent;
  color: #FF6B9D;
  cursor: pointer;
  transition: all 0.2s;
}
.exit-btn:hover { background: #FF6B9D18; }

.game-canvas {
  flex: 1;
  display: block;
  width: 100%;
  cursor: none;
  background: #060E14;
}

.flash-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
}
.flash-overlay.red  { background: #FF333344; }
.flash-overlay.green { background: #00FF6622; }

.flash-enter-active, .flash-leave-active { transition: opacity 0.15s; }
.flash-enter-from, .flash-leave-to { opacity: 0; }

.section-modal-backdrop {
  position: absolute;
  inset: 0;
  background: #060E14BB;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.section-modal {
  background: #0D1F2D;
  border: 2px solid #00FF66;
  border-radius: 12px;
  padding: 2rem 2.5rem;
  text-align: center;
  box-shadow: 0 0 60px #00FF6644;
  min-width: 280px;
}

.modal-icon {
  font-size: 2.5rem;
  color: #00FF66;
  margin-bottom: 0.5rem;
}

.modal-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  font-weight: 700;
  color: #E8F4F8;
  letter-spacing: 0.15em;
  margin-bottom: 0.75rem;
}

.modal-question {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: #7BA7BC;
  margin-bottom: 1.25rem;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.modal-btn {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 6px 18px;
  border-radius: 6px;
  border: 1px solid;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
}

.modal-btn.confirm {
  border-color: #00D9C0;
  color: #00D9C0;
}
.modal-btn.confirm:hover { background: #00D9C018; }

.modal-btn.cancel {
  border-color: #FF6B9D;
  color: #FF6B9D;
}
.modal-btn.cancel:hover { background: #FF6B9D18; }

.popup-enter-active, .popup-leave-active { transition: all 0.25s ease; }
.popup-enter-from, .popup-leave-to { opacity: 0; transform: scale(0.95); }

.joystick-area {
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  width: 120px;
  height: 120px;
  z-index: 5;
  touch-action: none;
}

.joystick-base {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #0D1F2D88;
  border: 2px solid #1E3448;
  display: flex;
  align-items: center;
  justify-content: center;
}

.joystick-knob {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #00D9C0;
  opacity: 0.8;
}

.legend {
  position: absolute;
  bottom: 0.75rem;
  right: 1rem;
  display: flex;
  gap: 1rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: #7BA7BC;
  z-index: 5;
}

.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 4px;
  vertical-align: middle;
}
.dot.cyan  { background: #00D9C0; }
.dot.green { background: #00FF66; }
.dot.blue  { background: #0099FF; }
</style>
