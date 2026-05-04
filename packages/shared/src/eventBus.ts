type EventDetail = Record<string, unknown>;

class PortfolioEventBus extends EventTarget {
  emit(event: string, detail?: EventDetail): void {
    this.dispatchEvent(new CustomEvent(event, { detail }));
  }

  on(event: string, handler: (e: CustomEvent<EventDetail>) => void): () => void {
    this.addEventListener(event, handler as EventListener);
    return () => this.removeEventListener(event, handler as EventListener);
  }
}

export const eventBus = new PortfolioEventBus();

// Typed event names
export const Events = {
  GAME_SECTION_REACHED: 'game:section-reached',
  GAME_MODE_TOGGLE:     'game:mode-toggle',
  GAME_EXIT:            'game:exit',
  MFE_MOUNTED:          'mfe:mounted',
  BOOT_PROGRESS:        'boot:progress',
  BOOT_COMPLETE:        'boot:complete',
  SECTION_ENTER:        'section:enter',
} as const;
