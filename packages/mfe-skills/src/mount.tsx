import { createRoot, Root } from 'react-dom/client';
import { Skills } from './Skills';
export function mount(container: HTMLElement): () => void {
  const root: Root = createRoot(container);
  root.render(<Skills />);
  return () => root.unmount();
}
