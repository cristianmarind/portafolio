import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface NavSection {
  id: string;
  label: string;
}

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="side-nav">
      <ul>
        <li *ngFor="let s of sections">
          <button
            class="nav-dot"
            [class.active]="activeId === s.id"
            [title]="s.label"
            (click)="scrollTo(s.id)">
          </button>
        </li>
      </ul>
      <button class="game-toggle" [class.active]="gameModeActive" (click)="gameToggle.emit()" title="Game Mode">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="1" y="5" width="16" height="10" rx="2" stroke="currentColor" stroke-width="1.5"/>
          <circle cx="13" cy="10" r="1.5" fill="currentColor"/>
          <path d="M5 8v4M3 10h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    </nav>
  `,
  styles: [`
    .side-nav {
      position: fixed; right: 1.5rem; top: 50%;
      transform: translateY(-50%);
      z-index: 100;
      display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
    }
    ul { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; }
    .nav-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: #1E3448; border: none; cursor: none;
      transition: background 0.2s, transform 0.2s;
    }
    .nav-dot.active, .nav-dot:hover { background: #00D9C0; transform: scale(1.4); }
    .game-toggle {
      margin-top: 0.5rem;
      background: none; border: 1.5px solid #1E3448;
      color: #7BA7BC; border-radius: 6px;
      padding: 6px; cursor: none;
      transition: color 0.2s, border-color 0.2s;
    }
    .game-toggle.active, .game-toggle:hover {
      color: #00D9C0; border-color: #00D9C0;
    }
  `]
})
export class SideNavComponent implements OnInit, OnDestroy {
  @Input() sections: NavSection[] = [];
  @Input() gameModeActive = false;
  @Output() gameToggle = new EventEmitter<void>();

  activeId = '';
  private observer!: IntersectionObserver;

  ngOnInit() {
    this.observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length) this.activeId = visible[0].target.id;
      },
      { threshold: 0.5 }
    );
    setTimeout(() => {
      this.sections.forEach(s => {
        const el = document.getElementById(s.id);
        if (el) this.observer.observe(el);
      });
    }, 500);
  }

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
