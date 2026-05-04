import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

const isProd = typeof window !== 'undefined' && window.location.hostname !== 'localhost';

const REMOTE_ENTRIES: Record<string, { url: string; scope: string }> = {
  'mfe-hero':         { url: isProd ? './mfe-hero/remoteEntry.js'         : 'http://localhost:3001/remoteEntry.js', scope: 'mfeHero'         },
  'mfe-experience':   { url: isProd ? './mfe-experience/remoteEntry.js'   : 'http://localhost:3002/remoteEntry.js', scope: 'mfeExperience'   },
  'mfe-skills':       { url: isProd ? './mfe-skills/remoteEntry.js'       : 'http://localhost:3003/remoteEntry.js', scope: 'mfeSkills'       },
  'mfe-achievements': { url: isProd ? './mfe-achievements/remoteEntry.js' : 'http://localhost:3004/remoteEntry.js', scope: 'mfeAchievements' },
  'mfe-contact':      { url: isProd ? './mfe-contact/remoteEntry.js'      : 'http://localhost:3005/remoteEntry.js', scope: 'mfeContact'      },
  'mfe-game':         { url: isProd ? './mfe-game/remoteEntry.js'         : 'http://localhost:3006/remoteEntry.js', scope: 'mfeGame'         },
};

async function loadWebpackRemote(remoteName: string, exposedModule: string): Promise<any> {
  const config = REMOTE_ENTRIES[remoteName];
  if (!config) throw new Error(`Unknown remote: ${remoteName}`);

  if (!(window as any)[config.scope]) {
    await new Promise<void>((resolve, reject) => {
      const existing = document.querySelector(`script[data-remote="${remoteName}"]`);
      if (existing) { resolve(); return; }
      const script = document.createElement('script');
      script.src = config.url;
      script.dataset['remote'] = remoteName;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${config.url}`));
      document.head.appendChild(script);
    });
  }

  const container = (window as any)[config.scope];
  const factory = await container.get(exposedModule);
  return factory();
}

@Component({
  selector: 'app-mfe-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mfe-host" *ngIf="!error">
      <div class="mfe-spinner" *ngIf="loading">
        <div class="spinner-ring"></div>
      </div>
      <div #host></div>
    </div>
    <div class="mfe-error" *ngIf="error">
      <p>{{ remote }} unavailable</p>
    </div>
  `,
  styles: [`
    .mfe-host { width: 100%; }
    .mfe-spinner {
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh;
    }
    .spinner-ring {
      width: 40px; height: 40px;
      border: 2px solid #1E3448;
      border-top-color: #00D9C0;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .mfe-error {
      display: flex; align-items: center; justify-content: center;
      min-height: 100px; color: #1E3448;
      font-family: 'JetBrains Mono', monospace; font-size: 0.75rem;
    }
  `]
})
export class MfeWrapperComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() remote = '';
  @Input() module = './mount';
  @ViewChild('host', { static: false }) hostEl?: ElementRef<HTMLDivElement>;

  loading = true;
  error = false;
  private unmount?: () => void;
  private loadedMod?: any;
  private viewReady = false;

  constructor(private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    try {
      this.loadedMod = await loadWebpackRemote(this.remote, this.module);
      this.loading = false;
      this.cdr.detectChanges();
      // If view already ready (AfterViewInit already ran), mount now
      if (this.viewReady) this.tryMount();
    } catch (e) {
      console.warn(`MFE ${this.remote} unavailable (is the dev server running?)`);
      this.error = true;
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  ngAfterViewInit() {
    this.viewReady = true;
    // If module already loaded, mount now
    if (this.loadedMod) this.tryMount();
  }

  private tryMount() {
    if (this.hostEl?.nativeElement && typeof this.loadedMod?.mount === 'function') {
      this.unmount = this.loadedMod.mount(this.hostEl.nativeElement);
    }
  }

  ngOnDestroy() {
    this.unmount?.();
  }
}
