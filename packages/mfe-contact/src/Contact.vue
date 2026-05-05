<template>
  <section class="contact-root">
    <!-- Header -->
    <div class="header">
      <p class="label">// get in touch</p>
      <h2 class="title">
        Let's build<br /><span class="accent">something.</span>
      </h2>
    </div>

    <div class="layout">
      <!-- Contact cards -->
      <div class="cards">
        <a :href="`mailto:${profile.email}`" class="contact-card" style="--c: #00D9C0">
          <span class="card-icon">✉</span>
          <div>
            <div class="card-label">Email</div>
            <div class="card-value">{{ profile.email }}</div>
          </div>
        </a>
        <a :href="profile.linkedIn" target="_blank" rel="noopener" class="contact-card" style="--c: #0099FF">
          <span class="card-icon">in</span>
          <div>
            <div class="card-label">LinkedIn</div>
            <div class="card-value">cristian-marin-durango</div>
          </div>
        </a>
        <div class="contact-card" style="--c: #F5A623; cursor: default">
          <span class="card-icon">📍</span>
          <div>
            <div class="card-label">Location</div>
            <div class="card-value">{{ profile.location }} (Remote)</div>
          </div>
        </div>
      </div>

      <!-- Terminal emulator -->
      <div class="terminal" ref="terminalRef" @click="focusInput">
        <div class="term-bar">
          <span class="dot red" /><span class="dot yellow" /><span class="dot green" />
          <span class="term-title">portfolio ~ bash</span>
        </div>

        <div class="term-body" ref="termBodyRef">
          <div class="term-line" v-for="(line, i) in history" :key="i">
            <span v-if="line.type === 'input'" class="prompt">
              <span class="prompt-host">cristian@portfolio</span>:<span class="prompt-dir">~</span>$
            </span>
            <span :class="['line-text', line.type]" v-html="line.text" />
          </div>

          <!-- Current input line -->
          <div class="term-line">
            <span class="prompt">
              <span class="prompt-host">cristian@portfolio</span>:<span class="prompt-dir">~</span>$
            </span>
            <span class="input-wrap">
              <span class="input-text">{{ currentInput }}</span>
              <span class="cursor" :class="{ blink: cursorBlink }">▋</span>
            </span>
            <input
              ref="inputRef"
              class="hidden-input"
              v-model="currentInput"
              @keydown="onKeyDown"
              autocomplete="off"
              spellcheck="false"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p class="footer-text">
        Built with Angular · React · Vue · Module Federation
        <br/>
        <span class="footer-sub">The architecture IS the portfolio.</span>
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue';
import { profile } from '@portfolio/shared';

interface TermLine { type: 'input' | 'output' | 'error' | 'success'; text: string; }

const terminalRef = ref<HTMLDivElement>();
const termBodyRef = ref<HTMLDivElement>();
const inputRef = ref<HTMLInputElement>();
const currentInput = ref('');
const cursorBlink = ref(true);
const history = ref<TermLine[]>([
  { type: 'output', text: '<span style="color:#00D9C0">Welcome to Cristian\'s portfolio terminal.</span>' },
  { type: 'output', text: 'Type <b>help</b> to see available commands.' },
  { type: 'output', text: '' },
]);

const cmdHistory: string[] = [];
let histIdx = -1;
let blinkTimer = 0;

const COMMANDS: Record<string, () => string | string[]> = {
  help: () => [
    '<span style="color:#F5A623">Available commands:</span>',
    '  <b>whoami</b>        — Who is Cristian?',
    '  <b>skills</b>        — Tech stack overview',
    '  <b>experience</b>    — Work history summary',
    '  <b>achievements</b>  — Awards & recognition',
    '  <b>contact</b>       — How to reach me',
    '  <b>hire me</b>       — Open my LinkedIn',
    '  <b>cv</b>            — Download resume',
    '  <b>sudo make coffee</b> — ☕',
    '  <b>clear</b>         — Clear terminal',
    '  <b>exit</b>          — Close terminal',
  ],
  whoami: () => [
    `<b style="color:#E8F4F8">${profile.name}</b>`,
    `<span style="color:#00D9C0">${profile.title}</span>`,
    '',
    profile.about,
    '',
    `📍 ${profile.location} · Remote`,
  ],
  skills: () => [
    '<span style="color:#F5A623">Tech Stack:</span>',
    '  Backend   → Node.js · NestJS · Spring Boot · .NET',
    '  Frontend  → Angular · React · Vue · TypeScript',
    '  Cloud     → AWS (ECS, Lambda, RDS, S3, CloudFront)',
    '  DevOps    → Docker · Kubernetes · GitHub Actions · Terraform',
    '  Database  → PostgreSQL · MongoDB · Redis · DynamoDB',
    '  Leadership→ Scrum · Kanban · Team building · Architecture reviews',
  ],
  experience: () => [
    '<span style="color:#F5A623">Work History:</span>',
    '  <b>2023–Present</b> → Senior Software Engineer (Freelance)',
    '  <b>2022–2023</b>    → Technical Lead — Assurant',
    '  <b>2021–2022</b>    → Tech Lead — Banco W',
    '  <b>2020–2021</b>    → Senior Software Engineer — Claro',
    '  <b>2019–2020</b>    → Software Engineer — Perficient',
    '  <b>2018–2019</b>    → Software Engineer — Pragma',
    '',
    'Type <b>experience --full</b> for details on any role.',
  ],
  achievements: () => [
    '<span style="color:#F5A623">Recognition:</span>',
    '  🏆 1st Place — International Apithon (Bancolombia, 2018)',
    '  🥇 1st Place — Hackathon (Bancolombia, 2018)',
    '  🔮 Oracle Innovation Partner (Oracle & Banco Guayaquil, 2019)',
    '  🥈 2nd Place — National Programming Contest (FEDESOFT, 2018)',
  ],
  contact: () => [
    '<span style="color:#F5A623">Get in touch:</span>',
    `  ✉  <a href="mailto:${profile.email}" style="color:#00D9C0">${profile.email}</a>`,
    `  in <a href="${profile.linkedIn}" target="_blank" style="color:#0099FF">linkedin.com/in/cristian-marin-durango-347527142/</a>`,
    `  📍 ${profile.location} · Open to remote worldwide`,
  ],
  'hire me': () => {
    window.open(profile.linkedIn, '_blank');
    return '<span style="color:#00FF88">Opening LinkedIn… See you there! 👋</span>';
  },
  cv: () => {
    return '<span style="color:#7BA7BC">CV download coming soon. Email me: <a href="mailto:' + profile.email + '" style="color:#00D9C0">' + profile.email + '</a></span>';
  },
  'sudo make coffee': () => [
    'sudo: make: command not found',
    '☕ Just kidding. Here\'s your virtual coffee.',
    '<span style="color:#F5A623">  (  )',
    ' (    )',
    '  (  )',
    '   ||',
    '   ||</span>',
  ],
  clear: () => {
    history.value = [];
    return '';
  },
  exit: () => {
    setTimeout(() => {
      history.value = [
        { type: 'output', text: '<span style="color:#00D9C0">Terminal closed. Goodbye!</span>' },
        { type: 'output', text: '' },
      ];
    }, 400);
    return '<span style="color:#7BA7BC">Closing terminal…</span>';
  },
};

async function runCommand(raw: string) {
  const cmd = raw.trim().toLowerCase();
  if (!cmd) return;

  history.value.push({ type: 'input', text: raw });
  cmdHistory.unshift(raw);
  histIdx = -1;

  const fn = COMMANDS[cmd];
  if (fn) {
    const result = fn();
    const lines = Array.isArray(result) ? result : [result];
    for (const line of lines) {
      if (line !== '') history.value.push({ type: 'output', text: line });
      else history.value.push({ type: 'output', text: '&nbsp;' });
    }
  } else if (cmd) {
    history.value.push({
      type: 'error',
      text: `bash: <b>${cmd}</b>: command not found. Type <b>help</b>.`,
    });
  }

  await nextTick();
  termBodyRef.value?.scrollTo({ top: termBodyRef.value.scrollHeight, behavior: 'smooth' });
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    runCommand(currentInput.value);
    currentInput.value = '';
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (histIdx < cmdHistory.length - 1) {
      histIdx++;
      currentInput.value = cmdHistory[histIdx] ?? '';
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (histIdx > 0) {
      histIdx--;
      currentInput.value = cmdHistory[histIdx] ?? '';
    } else {
      histIdx = -1;
      currentInput.value = '';
    }
  } else if (e.key === 'Tab') {
    e.preventDefault();
    // Autocomplete
    const partial = currentInput.value.toLowerCase();
    const match = Object.keys(COMMANDS).find(c => c.startsWith(partial));
    if (match) currentInput.value = match;
  }
}

function focusInput() { inputRef.value?.focus(); }

onMounted(() => {
  blinkTimer = window.setInterval(() => { cursorBlink.value = !cursorBlink.value; }, 530);
  setTimeout(() => inputRef.value?.focus(), 100);
});

onUnmounted(() => clearInterval(blinkTimer));
</script>

<style scoped>
.contact-root {
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

.layout {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 2rem;
  padding: 0 8vw 3rem;
  align-items: start;
}

@media (max-width: 768px) {
  .layout { grid-template-columns: 1fr; }
}

/* ── Contact cards ── */
.cards { display: flex; flex-direction: column; gap: 1rem; }

.contact-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: #0D1F2D;
  border: 1px solid var(--c, #1E3448);
  border-radius: 10px;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
}

.contact-card:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 24px color-mix(in srgb, var(--c) 20%, transparent);
}

.card-icon {
  font-size: 1.4rem;
  width: 2rem;
  text-align: center;
  flex-shrink: 0;
  color: var(--c, #E8F4F8);
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
}

.card-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #7BA7BC;
  margin-bottom: 0.2rem;
}

.card-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--c, #E8F4F8);
}

/* ── Terminal ── */
.terminal {
  background: #030810;
  border: 1px solid #1E3448;
  border-radius: 10px;
  overflow: hidden;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.78rem;
  cursor: text;
}

.term-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0.6rem 1rem;
  background: #0D1F2D;
  border-bottom: 1px solid #1E3448;
}

.term-bar .dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.dot.red    { background: #FF5F57; }
.dot.yellow { background: #FEBC2E; }
.dot.green  { background: #28C840; }

.term-title {
  margin-left: auto;
  font-size: 0.65rem;
  color: #7BA7BC;
  letter-spacing: 0.05em;
}

.term-body {
  padding: 1rem;
  min-height: 340px;
  max-height: 420px;
  overflow-y: auto;
  line-height: 1.7;
  scroll-behavior: smooth;
}

.term-line {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  flex-wrap: wrap;
  min-height: 1.4em;
}

.prompt {
  color: #7BA7BC;
  white-space: nowrap;
  flex-shrink: 0;
}

.prompt-host { color: #00D9C0; font-weight: 700; }
.prompt-dir  { color: #0099FF; }

.line-text { color: #E8F4F8; flex: 1; }
.line-text.output { color: #B0C8D8; }
.line-text.error  { color: #FF6B6B; }
.line-text.success { color: #00FF88; }
.line-text.input  { color: #E8F4F8; }

.input-wrap {
  display: inline-flex;
  align-items: baseline;
  gap: 0;
  flex: 1;
}

.input-text { color: #E8F4F8; }

.cursor {
  color: #00D9C0;
  margin-left: 1px;
}
.cursor.blink { opacity: 0; }

.hidden-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 1px;
  height: 1px;
}

/* ── Footer ── */
.footer {
  padding: 2rem 8vw 0;
  border-top: 1px solid #1E3448;
  text-align: center;
}

.footer-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: #7BA7BC;
  line-height: 1.8;
}

.footer-sub {
  color: #00D9C0;
  font-style: italic;
}
</style>
