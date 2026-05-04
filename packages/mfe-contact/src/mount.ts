import { createApp, App } from 'vue';
import Contact from './Contact.vue';

export function mount(container: HTMLElement): () => void {
  const app: App = createApp(Contact);
  app.mount(container);
  return () => app.unmount();
}
