import { useEffect, useRef } from 'react';

/** Keep each scene visible in SSR, but only run its loops near the viewport. */
export function useMotionStage<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      node.dataset.active = String(entry.isIntersecting);
    }, { rootMargin: '80px', threshold: 0 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return ref;
}
