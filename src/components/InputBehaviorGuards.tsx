import { useEffect } from 'react';

export default function InputBehaviorGuards() {
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const activeElement = document.activeElement;

      if (activeElement instanceof HTMLInputElement && activeElement.type === 'number') {
        activeElement.blur();
        event.preventDefault();
      }
    };

    document.addEventListener('wheel', handleWheel, { capture: true, passive: false });

    return () => document.removeEventListener('wheel', handleWheel, { capture: true });
  }, []);

  return null;
}
