import { createRoot, Root } from 'react-dom/client';
import { Hero } from './Hero';

export function mount(container: HTMLElement): () => void {
  const root: Root = createRoot(container);
  root.render(<Hero />);
  return () => root.unmount();
}
