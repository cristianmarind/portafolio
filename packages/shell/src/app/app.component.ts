import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BootSequenceComponent } from './components/boot-sequence/boot-sequence.component';
import { CustomCursorComponent } from './components/custom-cursor/custom-cursor.component';
import { SideNavComponent, NavSection } from './components/side-nav/side-nav.component';
import { MfeWrapperComponent } from './components/mfe-wrapper/mfe-wrapper.component';
import { AboutComponent } from './sections/about/about.component';
import { LeadershipComponent } from './sections/leadership/leadership.component';
import { eventBus, Events } from '@portfolio/shared';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    BootSequenceComponent,
    CustomCursorComponent,
    SideNavComponent,
    MfeWrapperComponent,
    AboutComponent,
    LeadershipComponent,
  ],
  template: `
    <app-boot-sequence *ngIf="booting" (complete)="onBootComplete()"></app-boot-sequence>

    <app-custom-cursor></app-custom-cursor>

    <app-side-nav
      [sections]="navSections"
      [gameModeActive]="gameModeActive"
      (gameToggle)="toggleGameMode()">
    </app-side-nav>

    <!-- Game Mode overlay -->
    <div class="game-overlay" *ngIf="gameModeActive">
      <app-mfe-wrapper remote="mfe-game" module="./mount"></app-mfe-wrapper>
    </div>

    <main [class.hidden]="booting">
      <!-- Hero -->
      <section id="hero" class="mfe-section">
        <app-mfe-wrapper remote="mfe-hero" module="./mount"></app-mfe-wrapper>
      </section>

      <!-- About (static, in shell) -->
      <app-about></app-about>

      <!-- Experience -->
      <section id="experience" class="mfe-section">
        <app-mfe-wrapper remote="mfe-experience" module="./mount"></app-mfe-wrapper>
      </section>

      <!-- Skills -->
      <section id="skills" class="mfe-section">
        <app-mfe-wrapper remote="mfe-skills" module="./mount"></app-mfe-wrapper>
      </section>

      <!-- Achievements -->
      <section id="achievements" class="mfe-section">
        <app-mfe-wrapper remote="mfe-achievements" module="./mount"></app-mfe-wrapper>
      </section>

      <!-- Leadership (static, in shell) -->
      <app-leadership></app-leadership>

      <!-- Contact -->
      <section id="contact" class="mfe-section">
        <app-mfe-wrapper remote="mfe-contact" module="./mount"></app-mfe-wrapper>
      </section>
    </main>
  `,
  styles: [`
    main { transition: opacity 0.4s ease; }
    main.hidden { opacity: 0; pointer-events: none; }
    .mfe-section { min-height: 100vh; }
    .game-overlay {
      position: fixed; inset: 0; z-index: 500;
      background: rgba(6, 14, 20, 0.95);
      animation: fadeIn 0.3s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class AppComponent implements OnInit {
  booting = true;
  gameModeActive = false;

  navSections: NavSection[] = [
    { id: 'hero',         label: 'Hero'         },
    { id: 'about',        label: 'About'        },
    { id: 'experience',   label: 'Experience'   },
    { id: 'skills',       label: 'Skills'       },
    { id: 'achievements', label: 'Achievements' },
    { id: 'leadership',   label: 'Leadership'   },
    { id: 'contact',      label: 'Contact'      },
  ];

  ngOnInit() {
    eventBus.on(Events.GAME_SECTION_REACHED, (e: CustomEvent) => {
      const section = e.detail?.['section'] as string;
      if (section) {
        this.gameModeActive = false;
        setTimeout(() => {
          document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    });

    eventBus.on(Events.GAME_EXIT, () => {
      this.gameModeActive = false;
    });
  }

  onBootComplete() {
    this.booting = false;
  }

  toggleGameMode() {
    this.gameModeActive = !this.gameModeActive;
    eventBus.emit(Events.GAME_MODE_TOGGLE, { active: this.gameModeActive });
  }
}
