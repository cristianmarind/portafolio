import { createApp, App } from 'vue';
import Achievements from './Achievements.vue';
export function mount(container: HTMLElement): () => void {
  const app: App = createApp(Achievements);
  app.mount(container);
  return () => app.unmount();
}
