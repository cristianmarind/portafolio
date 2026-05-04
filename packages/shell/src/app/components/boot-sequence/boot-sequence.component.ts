import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-boot-sequence',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="boot-screen" [class.fade-out]="fadingOut">
      <div class="boot-content">
        <div class="boot-logo">CM</div>
        <div class="boot-lines">
          <div class="boot-line" *ngFor="let line of visibleLines">
            <span class="prompt">›</span> {{ line }}
          </div>
        </div>
        <div class="boot-bar-wrap" *ngIf="progress > 0">
          <div class="boot-bar" [style.width.%]="progress"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .boot-screen {
      position: fixed; inset: 0; z-index: 9999;
      background: #060E14;
      display: flex; align-items: center; justify-content: center;
      transition: opacity 0.6s ease;
    }
    .boot-screen.fade-out { opacity: 0; pointer-events: none; }
    .boot-content { width: 480px; font-family: 'JetBrains Mono', monospace; }
    .boot-logo {
      font-size: 3rem; font-weight: 700; color: #00D9C0;
      margin-bottom: 2rem; letter-spacing: 0.1em;
    }
    .boot-line { color: #7BA7BC; font-size: 0.8rem; margin-bottom: 0.4rem; }
    .prompt { color: #00D9C0; margin-right: 0.5rem; }
    .boot-bar-wrap {
      height: 2px; background: #1E3448; margin-top: 1.5rem; border-radius: 1px;
    }
    .boot-bar {
      height: 100%; background: #00D9C0; border-radius: 1px;
      transition: width 0.3s ease;
    }
  `]
})
export class BootSequenceComponent implements OnInit {
  @Output() complete = new EventEmitter<void>();

  lines = [
    'Initializing portfolio runtime...',
    'Loading microfrontend manifests...',
    'Bootstrapping Angular shell...',
    'Connecting remote modules...',
    'Ready.',
  ];
  visibleLines: string[] = [];
  progress = 0;
  fadingOut = false;

  ngOnInit() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.complete.emit();
      return;
    }
    this.runSequence();
  }

  private async runSequence() {
    for (let i = 0; i < this.lines.length; i++) {
      await this.delay(300 + i * 200);
      this.visibleLines.push(this.lines[i]);
      this.progress = Math.round(((i + 1) / this.lines.length) * 100);
    }
    await this.delay(600);
    this.fadingOut = true;
    await this.delay(700);
    this.complete.emit();
  }

  private delay(ms: number) {
    return new Promise(r => setTimeout(r, ms));
  }
}
