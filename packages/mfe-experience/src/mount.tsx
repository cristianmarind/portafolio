import { createRoot, Root } from 'react-dom/client';
import { Experience } from './Experience';

export function mount(container: HTMLElement): () => void {
  const root: Root = createRoot(container);
  root.render(<Experience />);
  return () => root.unmount();
}
