import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leadership',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="leadership" class="leadership">
      <div class="leadership__inner">
        <span class="section-label">// leadership philosophy</span>
        <h2 class="section-title">
          Teams as <span class="highlight">services</span>.<br>
          Outcomes as <span class="highlight">SLAs</span>.
        </h2>
        <div class="blueprint" #blueprint>
          <svg class="blueprint__svg" viewBox="0 0 800 420" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Grid -->
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E3448" stroke-width="0.5"/>
              </pattern>
            </defs>
            <rect width="800" height="420" fill="url(#grid)"/>

            <!-- Connecting lines (drawn via CSS animation) -->
            <line class="bp-line" x1="200" y1="210" x2="400" y2="210" stroke="#00D9C0" stroke-width="1.5" stroke-dasharray="4 4"/>
            <line class="bp-line" x1="400" y1="210" x2="600" y2="100" stroke="#00D9C0" stroke-width="1.5" stroke-dasharray="4 4"/>
            <line class="bp-line" x1="400" y1="210" x2="600" y2="210" stroke="#00D9C0" stroke-width="1.5" stroke-dasharray="4 4"/>
            <line class="bp-line" x1="400" y1="210" x2="600" y2="320" stroke="#00D9C0" stroke-width="1.5" stroke-dasharray="4 4"/>

            <!-- Central node: Technical Lead -->
            <rect x="320" y="172" width="160" height="76" rx="8" fill="#0D1F2D" stroke="#00D9C0" stroke-width="2"/>
            <text x="400" y="200" text-anchor="middle" fill="#00D9C0" font-size="10" font-family="JetBrains Mono">TECHNICAL LEAD</text>
            <text x="400" y="220" text-anchor="middle" fill="#7BA7BC" font-size="8" font-family="JetBrains Mono">orchestrator</text>
            <text x="400" y="238" text-anchor="middle" fill="#7BA7BC" font-size="8" font-family="JetBrains Mono">camd1996&#64;gmail.com</text>

            <!-- Left node: Vision -->
            <rect x="60" y="172" width="140" height="76" rx="8" fill="#0D1F2D" stroke="#0099FF" stroke-width="1.5"/>
            <text x="130" y="200" text-anchor="middle" fill="#0099FF" font-size="10" font-family="JetBrains Mono">VISION</text>
            <text x="130" y="220" text-anchor="middle" fill="#7BA7BC" font-size="8" font-family="JetBrains Mono">→ business goals</text>
            <text x="130" y="236" text-anchor="middle" fill="#7BA7BC" font-size="8" font-family="JetBrains Mono">→ stakeholders</text>

            <!-- Right top: Autonomy -->
            <rect x="530" y="62" width="140" height="76" rx="8" fill="#0D1F2D" stroke="#0099FF" stroke-width="1.5"/>
            <text x="600" y="90" text-anchor="middle" fill="#0099FF" font-size="10" font-family="JetBrains Mono">AUTONOMY</text>
            <text x="600" y="110" text-anchor="middle" fill="#7BA7BC" font-size="8" font-family="JetBrains Mono">→ empowered teams</text>
            <text x="600" y="126" text-anchor="middle" fill="#7BA7BC" font-size="8" font-family="JetBrains Mono">→ owned outcomes</text>

            <!-- Right mid: Accountability -->
            <rect x="530" y="172" width="140" height="76" rx="8" fill="#0D1F2D" stroke="#0099FF" stroke-width="1.5"/>
            <text x="600" y="200" text-anchor="middle" fill="#0099FF" font-size="10" font-family="JetBrains Mono">QUALITY</text>
            <text x="600" y="220" text-anchor="middle" fill="#7BA7BC" font-size="8" font-family="JetBrains Mono">→ ADR / HLD</text>
            <text x="600" y="236" text-anchor="middle" fill="#7BA7BC" font-size="8" font-family="JetBrains Mono">→ release gates</text>

            <!-- Right bottom: Shipping -->
            <rect x="530" y="282" width="140" height="76" rx="8" fill="#0D1F2D" stroke="#F5A623" stroke-width="1.5"/>
            <text x="600" y="310" text-anchor="middle" fill="#F5A623" font-size="10" font-family="JetBrains Mono">SHIPPING</text>
            <text x="600" y="330" text-anchor="middle" fill="#7BA7BC" font-size="8" font-family="JetBrains Mono">→ CI/CD pipelines</text>
            <text x="600" y="346" text-anchor="middle" fill="#7BA7BC" font-size="8" font-family="JetBrains Mono">→ done = deployed</text>
          </svg>
        </div>
        <div class="leadership__principles">
          <div class="principle" *ngFor="let p of principles">
            <span class="principle__icon">{{ p.icon }}</span>
            <div>
              <h4>{{ p.title }}</h4>
              <p>{{ p.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .leadership { padding: 6rem 8vw; background: var(--color-bg-deep); }
    .leadership__inner { max-width: 1100px; margin: 0 auto; }
    .blueprint { margin: 3rem 0; background: #0B1A26; border: 1px solid var(--color-border); border-radius: 12px; overflow: hidden; }
    .blueprint__svg { width: 100%; height: auto; }
    .bp-line { stroke-dashoffset: 100; animation: drawLine 1.5s ease forwards; }
    .bp-line:nth-child(2) { animation-delay: 0.3s; }
    .bp-line:nth-child(3) { animation-delay: 0.6s; }
    .bp-line:nth-child(4) { animation-delay: 0.9s; }
    @keyframes drawLine { to { stroke-dashoffset: 0; } }
    .leadership__principles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
    .principle { display: flex; gap: 1rem; align-items: flex-start; }
    .principle__icon { font-size: 1.5rem; flex-shrink: 0; }
    .principle h4 { color: var(--color-text-primary); font-size: 0.95rem; margin-bottom: 0.25rem; }
    .principle p { color: var(--color-text-secondary); font-size: 0.85rem; line-height: 1.6; }
    @media (max-width: 768px) {
      .leadership__principles { grid-template-columns: 1fr; }
      .blueprint { display: none; }
    }
  `]
})
export class LeadershipComponent {
  principles = [
    { icon: '🎯', title: 'Outcome-driven', desc: 'Every architectural decision maps to a business outcome. No premature optimization, no gold-plating.' },
    { icon: '⚡', title: 'Bias for action', desc: 'Shipping imperfect is better than perfect in a backlog. I unblock teams and resolve technical debt in motion.' },
    { icon: '🔭', title: 'Systems thinking', desc: 'I design for failure, plan for scale, and build observability from day one — not as afterthoughts.' },
  ];
}
