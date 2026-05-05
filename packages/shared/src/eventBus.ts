type EventDetail = Record<string, unknown>;

// Use window as the shared bus target so events cross Module Federation bundle boundaries.
// Each MFE gets its own PortfolioEventBus instance, but they all dispatch/listen on
// the same underlying window object within the same browser tab.
const _bus: EventTarget = typeof window !== 'undefined' ? window : new EventTarget();

class PortfolioEventBus {
  emit(event: string, detail?: EventDetail): void {
    _bus.dispatchEvent(new CustomEvent(event, { detail }));
  }

  on(event: string, handler: (e: CustomEvent<EventDetail>) => void): () => void {
    _bus.addEventListener(event, handler as EventListener);
    return () => _bus.removeEventListener(event, handler as EventListener);
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
