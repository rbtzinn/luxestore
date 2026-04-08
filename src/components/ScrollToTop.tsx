import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { animateScrollToTop } from '@/lib/scroll';

export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    animateScrollToTop();

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, [pathname, search]);

  return null;
}
