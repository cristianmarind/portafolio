import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="about" class="about">
      <div class="about__inner">
        <span class="section-label">// about me</span>
        <h2 class="section-title">
          Building systems<br>that <span class="highlight">scale</span>.
        </h2>
        <div class="about__grid">
          <div class="about__bio">
            <p>
              I'm a Technical Lead and Full Stack Engineer based in Colombia,
              with deep experience in microservices, distributed systems, and
              microfrontend architectures. I've led engineering teams in
              healthcare, fintech, and banking — turning complex technical
              challenges into shipped products.
            </p>
            <p>
              I don't just write code. I define architecture, coordinate teams,
              align stakeholders, and own delivery end-to-end.
              <strong class="highlight">I make things happen.</strong>
            </p>
            <div class="about__edu">
              <span class="about__edu-title">Education</span>
              <p>Computer Science Engineer</p>
              <p class="muted">Universidad de Antioquia</p>
            </div>
          </div>
          <div class="about__stack">
            <span class="section-label">// core stack</span>
            <ul>
              <li *ngFor="let item of coreStack">
                <span class="mono">›</span> {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .about {
      display: flex; align-items: center; padding: 6rem 8vw;
      background: var(--color-bg-surface);
    }
    .about__inner { max-width: 1100px; margin: 0 auto; width: 100%; }
    .about__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; margin-top: 3rem; }
    .about__bio p { color: var(--color-text-secondary); line-height: 1.8; margin-bottom: 1.5rem; }
    .about__bio strong { font-weight: 700; }
    .about__edu { margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--color-border); }
    .about__edu-title { font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--color-accent-cyan); display: block; margin-bottom: 0.5rem; }
    .muted { color: var(--color-text-secondary); font-size: 0.9rem; }
    .about__stack ul { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem; }
    .about__stack li { color: var(--color-text-secondary); font-size: 0.95rem; }
    .mono { color: var(--color-accent-cyan); font-family: var(--font-mono); margin-right: 8px; }
    @media (max-width: 768px) { .about__grid { grid-template-columns: 1fr; gap: 2rem; } }
  `]
})
export class AboutComponent {
  coreStack = [
    'Node.js · NestJS · TypeScript',
    'React.js · Vue.js · Angular',
    'Microservices · Microfrontends',
    'AWS · Kubernetes · GitHub Actions',
    'OAuth 2.0 · OIDC · JWT · SSO',
    'MongoDB · PostgreSQL · Redis',
    'System Design · ADR / HLD',
    'Agile / Scrum · Stakeholder Mgmt',
  ];
}
