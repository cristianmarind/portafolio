import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
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

  // Load remoteEntry.js if not already loaded
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
      <p>{{ remote }} failed to load</p>
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
      min-height: 200px; color: #7BA7BC;
      font-family: 'JetBrains Mono', monospace; font-size: 0.8rem;
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
  private pendingMount?: { mod: any };

  async ngOnInit() {
    try {
      const mod = await loadWebpackRemote(this.remote, this.module);
      this.pendingMount = { mod };
    } catch (e) {
      console.error(`Failed to load remote ${this.remote}:`, e);
      this.error = true;
    } finally {
      this.loading = false;
    }
  }

  ngAfterViewInit() {
    if (this.pendingMount && this.hostEl?.nativeElement) {
      const { mod } = this.pendingMount;
      if (typeof mod?.mount === 'function') {
        this.unmount = mod.mount(this.hostEl.nativeElement);
      }
      this.pendingMount = undefined;
    }
  }

  ngOnDestroy() {
    this.unmount?.();
  }
}
