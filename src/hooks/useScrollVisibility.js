import { useEffect } from 'react';

export default function useScrollVisibility(idleDelay = 900) {
  useEffect(() => {
    const timers = new Map();

    function showScrollbar(event) {
      const element = event.target;
      if (!(element instanceof Element)) return;

      element.setAttribute('data-scrolling', 'true');
      window.clearTimeout(timers.get(element));
      timers.set(
        element,
        window.setTimeout(() => {
          element.removeAttribute('data-scrolling');
          timers.delete(element);
        }, idleDelay),
      );
    }

    // Capture also covers nested lists, the patient drawer, and keyboard scrolling.
    document.addEventListener('scroll', showScrollbar, {
      capture: true,
      passive: true,
    });
    return () => {
      document.removeEventListener('scroll', showScrollbar, true);
      for (const [element, timer] of timers) {
        window.clearTimeout(timer);
        element.removeAttribute('data-scrolling');
      }
    };
  }, [idleDelay]);
}
