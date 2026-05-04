import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { loadRemoteModule } from '@angular-architects/native-federation';

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
    .mfe-host { width: 100%; min-height: 100vh; }
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
export class MfeWrapperComponent implements OnInit, OnDestroy {
  @Input() remote = '';
  @Input() module = './mount';
  @ViewChild('host', { static: false }) hostEl?: ElementRef<HTMLDivElement>;

  loading = true;
  error = false;
  private unmount?: () => void;

  async ngOnInit() {
    try {
      const mod = await loadRemoteModule({ remoteName: this.remote, exposedModule: this.module });
      await new Promise(r => setTimeout(r, 0));
      if (this.hostEl?.nativeElement && typeof mod?.mount === 'function') {
        this.unmount = mod.mount(this.hostEl.nativeElement);
      }
    } catch (e) {
      console.error(`Failed to load remote ${this.remote}:`, e);
      this.error = true;
    } finally {
      this.loading = false;
    }
  }

  ngOnDestroy() {
    this.unmount?.();
  }
}
