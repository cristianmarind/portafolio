import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  template: `
    <div #cursor class="cursor"></div>
    <div #dot class="cursor-dot"></div>
  `,
  styles: [`
    .cursor {
      position: fixed; pointer-events: none; z-index: 9998;
      width: 32px; height: 32px;
      border: 1.5px solid #00D9C0;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      transition: width 0.2s, height 0.2s, opacity 0.2s, border-color 0.2s;
      mix-blend-mode: difference;
    }
    .cursor-dot {
      position: fixed; pointer-events: none; z-index: 9998;
      width: 4px; height: 4px;
      background: #00D9C0;
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }
    :host-context(body:hover) .cursor { opacity: 1; }
  `]
})
export class CustomCursorComponent implements OnInit, OnDestroy {
  @ViewChild('cursor', { static: true }) cursorEl!: ElementRef<HTMLDivElement>;
  @ViewChild('dot', { static: true }) dotEl!: ElementRef<HTMLDivElement>;

  private curX = window.innerWidth / 2;
  private curY = window.innerHeight / 2;
  private targetX = this.curX;
  private targetY = this.curY;
  private rafId = 0;

  private onMove = (e: MouseEvent) => {
    this.targetX = e.clientX;
    this.targetY = e.clientY;
    this.dotEl.nativeElement.style.left = `${e.clientX}px`;
    this.dotEl.nativeElement.style.top = `${e.clientY}px`;
  };

  private onEnterInteractive = () => {
    this.cursorEl.nativeElement.style.width = '48px';
    this.cursorEl.nativeElement.style.height = '48px';
    this.cursorEl.nativeElement.style.borderColor = '#E8F4F8';
  };

  private onLeaveInteractive = () => {
    this.cursorEl.nativeElement.style.width = '32px';
    this.cursorEl.nativeElement.style.height = '32px';
    this.cursorEl.nativeElement.style.borderColor = '#00D9C0';
  };

  ngOnInit() {
    window.addEventListener('mousemove', this.onMove);
    document.querySelectorAll('a, button, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', this.onEnterInteractive);
      el.addEventListener('mouseleave', this.onLeaveInteractive);
    });
    this.loop();
  }

  private loop() {
    const lerp = 0.18;
    this.curX += (this.targetX - this.curX) * lerp;
    this.curY += (this.targetY - this.curY) * lerp;
    this.cursorEl.nativeElement.style.left = `${this.curX}px`;
    this.cursorEl.nativeElement.style.top = `${this.curY}px`;
    this.rafId = requestAnimationFrame(() => this.loop());
  }

  ngOnDestroy() {
    window.removeEventListener('mousemove', this.onMove);
    cancelAnimationFrame(this.rafId);
  }
}
