import { createApp, App } from 'vue';
import Game from './Game.vue';

export function mount(container: HTMLElement): () => void {
  const app: App = createApp(Game);
  app.mount(container);
  return () => app.unmount();
}
